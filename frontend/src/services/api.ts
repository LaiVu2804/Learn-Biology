import axios from "../config/axios-customize";

/**
 * BƯỚC 2: Gọi API Đăng nhập
 * Endpoint: POST /api/v1/auth/login
 * @param username Email hoặc tên tài khoản
 * @param password Mật khẩu thô
 * @returns Promise<IBackendRes<ILoginResponse>>
 */
export const callLogin = (username: string, password: string): Promise<IBackendRes<ILoginResponse>> => {
    return axios.post<any, IBackendRes<ILoginResponse>>("/api/v1/auth/login", {
        username,
        password,
    });
};

/**
 * Gọi API Đăng ký tài khoản
 * Endpoint: POST /api/v1/auth/register
 * @param data Dữ liệu người dùng cần đăng ký
 * @returns Promise<IBackendRes<IRegisterRes>>
 */
export const callRegister = (data: IRegisterReq): Promise<IBackendRes<IRegisterRes>> => {
    return axios.post<any, IBackendRes<IRegisterRes>>("/api/v1/auth/register", data);
};

/**
 * Gọi API Đăng xuất (Logout)
 * Endpoint: POST /api/v1/auth/logout
 * Gửi kèm Access Token (qua interceptor) và HttpOnly Cookie để Backend xóa Session
 * @returns Promise<IBackendRes<null>>
 */
export const callLogout = (): Promise<IBackendRes<null>> => {
    return axios.post<any, IBackendRes<null>>("/api/v1/auth/logout");
};

/**
 * Gọi API Refresh Token
 * Endpoint: POST /api/v1/auth/refresh
 * Trình duyệt sẽ tự động đính kèm Cookie refresh_token (HttpOnly)
 * Sử dụng cơ chế Deduplication Promise để tránh xung đột Token Rotation khi nhiều nơi gọi cùng lúc
 * @returns Promise<IBackendRes<ILoginResponse>>
 */
let refreshTokenPromise: Promise<IBackendRes<ILoginResponse>> | null = null;

export const callRefreshToken = (): Promise<IBackendRes<ILoginResponse>> => {
    if (refreshTokenPromise) {
        return refreshTokenPromise;
    }
    refreshTokenPromise = axios
        .post<any, IBackendRes<ILoginResponse>>("/api/v1/auth/refresh")
        .finally(() => {
            refreshTokenPromise = null;
        });
    return refreshTokenPromise;
};

/**
 * Lấy thông tin tài khoản hiện tại từ Session/Token
 * Endpoint: GET /api/v1/auth/account
 */
export const callFetchAccount = (): Promise<IBackendRes<IGetAccount>> => {
    return axios.get<any, IBackendRes<IGetAccount>>("/api/v1/auth/account");
};

/**
 * Lấy thông tin chi tiết một User theo ID (dùng để kiểm tra API có bảo vệ)
 * Endpoint: GET /api/v1/users/{id}
 */
export const callFetchUserById = (id: number | string): Promise<IBackendRes<IUser>> => {
    return axios.get<any, IBackendRes<IUser>>(`/api/v1/users/${id}`);
};
