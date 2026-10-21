import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { callLogout, callRefreshToken } from "../services/api";
import {
    setAccessToken,
    clearAuthMemory,
    setupSilentRefreshTimer,
} from "../services/auth-memory";

interface IAuthContext {
    user: IUserLogin | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (accessToken: string, user: IUserLogin) => void;
    logout: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<IUserLogin | null>>;
    triggerSilentRefresh: () => Promise<boolean>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUserLogin | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * Hàm làm mới vô hình (Silent Refresh) được kích hoạt tự động theo Timer
     * hoặc được kích hoạt thủ công khi vừa redirect từ Google về
     */
    const triggerSilentRefresh = useCallback(async (): Promise<boolean> => {
        try {
            const res = await callRefreshToken();
            if (res && res.data && res.data.access_token) {
                const newToken = res.data.access_token;
                // Nạp token mới vào RAM
                setAccessToken(newToken);
                if (res.data.user) {
                    setUser(res.data.user);
                }
                setIsAuthenticated(true);

                // Lên lịch tiếp theo cho lần làm mới kế tiếp
                setupSilentRefreshTimer(newToken, triggerSilentRefresh);
                return true;
            }
            return false;
        } catch (error) {
            console.warn("Silent Refresh thất bại, phiên đăng nhập có thể đã kết thúc.");
            clearAuthMemory();
            setUser(null);
            setIsAuthenticated(false);
            return false;
        }
    }, []);

    /**
     * KHỞI ĐỘNG ỨNG DỤNG (Bootstrapping khi mở web hoặc bấm F5):
     * Do RAM bị xóa trắng khi F5, ứng dụng sẽ tự động gửi request âm thầm
     * kèm Cookie HttpOnly lên Backend để xin cấp Access Token mới nạp vào RAM.
     */
    useEffect(() => {
        const bootstrapSession = async () => {
            try {
                // Gọi API refresh token (trình duyệt tự đính kèm HttpOnly cookie)
                const res = await callRefreshToken();

                if (res && res.data && res.data.access_token) {
                    const token = res.data.access_token;
                    // Nạp vào RAM
                    setAccessToken(token);

                    if (res.data.user) {
                        setUser(res.data.user);
                    }
                    setIsAuthenticated(true);

                    // Thiết lập Timer Silent Refresh tự động trước khi token hết hạn
                    setupSilentRefreshTimer(token, triggerSilentRefresh);
                } else {
                    clearAuthMemory();
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // Chưa đăng nhập hoặc cookie hết hạn -> trạng thái khách
                clearAuthMemory();
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        bootstrapSession();
    }, [triggerSilentRefresh]);

    /**
     * Hàm login: Được gọi khi đăng nhập mật khẩu hoặc Google thành công
     */
    const login = (accessToken: string, userData: IUserLogin) => {
        // Lưu token vào RAM
        setAccessToken(accessToken);
        setUser(userData);
        setIsAuthenticated(true);

        // Thiết lập bộ đếm thời gian Silent Refresh tự động
        setupSilentRefreshTimer(accessToken, triggerSilentRefresh);
    };

    /**
     * Hàm logout: Xóa session phía server và dọn sạch RAM phía client
     */
    const logout = async () => {
        try {
            await callLogout();
        } catch (error) {
            console.error("Lỗi khi gọi API logout:", error);
        } finally {
            // Xóa sạch token và timer trong RAM
            clearAuthMemory();
            setUser(null);
            setIsAuthenticated(false);
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                setUser,
                triggerSilentRefresh,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): IAuthContext => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
    }
    return context;
};
