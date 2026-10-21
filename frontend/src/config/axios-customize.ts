import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { Mutex } from "async-mutex";
import { getAccessToken, setAccessToken, clearAuthMemory } from "../services/auth-memory";

/**
 * Khởi tạo Axios instance
 * withCredentials: true cho phép gửi kèm HttpOnly Cookie (refresh_token) qua các request
 */
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
    withCredentials: true,
});

// Mutex để chống xung đột race-condition khi có nhiều request đồng thời bị lỗi 401
const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

/**
 * Hàm gọi API lấy Access Token mới bằng Refresh Token lưu trong HttpOnly Cookie
 * Access Token mới được nạp thẳng vào bộ nhớ RAM, KHÔNG lưu vào localStorage
 */
export const handleRefreshToken = async (): Promise<string | null> => {
    return await mutex.runExclusive(async () => {
        try {
            const res = await axios.post<IBackendRes<ILoginResponse>>(
                `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"}/api/v1/auth/refresh`,
                {},
                { withCredentials: true }
            );

            if (res && res.data && res.data.data?.access_token) {
                const newAccessToken = res.data.data.access_token;
                // Lưu token mới vào bộ nhớ RAM
                setAccessToken(newAccessToken);
                return newAccessToken;
            }
            return null;
        } catch (error) {
            // Khi Refresh Token hết hạn hoặc bị thu hồi -> dọn sạch bộ nhớ RAM
            clearAuthMemory();
            return null;
        }
    });
};

/**
 * ----------------------------------------------------------------------------
 * REQUEST INTERCEPTOR: Lấy Access Token từ RAM (Memory) và gắn vào Header
 * ----------------------------------------------------------------------------
 */
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Lấy token trực tiếp từ bộ nhớ RAM thay vì localStorage
        const accessToken = getAccessToken();

        if (accessToken && !config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        if (!config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * ----------------------------------------------------------------------------
 * RESPONSE INTERCEPTOR: Bắt mã 401 -> Kích hoạt Silent Refresh ngầm -> Retry request
 * ----------------------------------------------------------------------------
 */
instance.interceptors.response.use(
    (response) => {
        return response && response.data ? response.data : response;
    },
    async (error: AxiosError<IBackendRes<null>>) => {
        const config = error.config as AxiosRequestConfig & { [NO_RETRY_HEADER]?: boolean };

        // Bắt lỗi 401 Unauthorized khi Access Token trong RAM hết hạn
        if (
            error.response &&
            error.response.status === 401 &&
            config &&
            !config[NO_RETRY_HEADER] &&
            !config.url?.includes("/api/v1/auth/login") &&
            !config.url?.includes("/api/v1/auth/refresh")
        ) {
            config[NO_RETRY_HEADER] = true;

            // Gọi Refresh Token ngầm để đổi lấy Access Token mới
            const newAccessToken = await handleRefreshToken();

            if (newAccessToken) {
                // Gắn Access Token mới vào request cũ
                if (config.headers) {
                    config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                }
                // Thực thi lại request cũ liền mạch
                return instance.request(config);
            } else {
                // Nếu refresh thất bại (hết phiên), chuyển hướng về trang đăng nhập
                window.location.href = "/login";
            }
        }

        if (error.response && error.response.data) {
            return error.response.data;
        }

        return Promise.reject(error);
    }
);

export default instance;
