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
    userRole: string;
    isAdmin: boolean;
    isTutor: boolean;
    hasRole: (allowedRoles: string | string[]) => boolean;
    hasPermission: (permissionName: string) => boolean;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUserLogin | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * Trích xuất tên vai trò từ đối tượng user
     */
    const getUserRoleName = (currentUser: IUserLogin | null): string => {
        if (!currentUser || !currentUser.role) return "ROLE_USER";
        if (typeof currentUser.role === "string") return currentUser.role;
        return currentUser.role.name || "ROLE_USER";
    };

    const userRole = getUserRoleName(user);
    const isAdmin = userRole === "ROLE_ADMIN" || userRole === "ADMIN";
    const isTutor = isAdmin || userRole === "ROLE_TUTOR" || userRole === "TUTOR" || userRole === "ROLE_TEACHER";

    const hasRole = useCallback((allowedRoles: string | string[]): boolean => {
        if (!user) return false;
        const currentRole = getUserRoleName(user);
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        return roles.some((r) => {
            const cleanTarget = r.replace(/^ROLE_/, "").toUpperCase();
            const cleanCurrent = currentRole.replace(/^ROLE_/, "").toUpperCase();
            return cleanTarget === cleanCurrent || currentRole === r;
        });
    }, [user]);

    const hasPermission = useCallback((permissionName: string): boolean => {
        if (!user || !user.role) return false;
        if (isAdmin) return true; // SuperAdmin có toàn bộ quyền
        if (typeof user.role === "object" && user.role.permissions) {
            return (user.role.permissions as any[]).some((p) => {
                if (typeof p === "string") return p === permissionName;
                return p?.name === permissionName;
            });
        }
        return false;
    }, [user, isAdmin]);

    /**
     * Hàm làm mới vô hình (Silent Refresh) được kích hoạt tự động theo Timer
     */
    const triggerSilentRefresh = useCallback(async (): Promise<boolean> => {
        try {
            const res = await callRefreshToken();
            if (res && res.data && res.data.access_token) {
                const newToken = res.data.access_token;
                setAccessToken(newToken);
                if (res.data.user) {
                    setUser(res.data.user);
                }
                setIsAuthenticated(true);
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
     * Bootstrapping khi mở web hoặc bấm F5
     */
    useEffect(() => {
        const bootstrapSession = async () => {
            try {
                const res = await callRefreshToken();
                if (res && res.data && res.data.access_token) {
                    const token = res.data.access_token;
                    setAccessToken(token);

                    if (res.data.user) {
                        setUser(res.data.user);
                    }
                    setIsAuthenticated(true);
                    setupSilentRefreshTimer(token, triggerSilentRefresh);
                } else {
                    clearAuthMemory();
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                clearAuthMemory();
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        bootstrapSession();
    }, [triggerSilentRefresh]);

    const login = (accessToken: string, userData: IUserLogin) => {
        setAccessToken(accessToken);
        setUser(userData);
        setIsAuthenticated(true);
        setupSilentRefreshTimer(accessToken, triggerSilentRefresh);
    };

    const logout = async () => {
        try {
            await callLogout();
        } catch (error) {
            console.error("Lỗi khi gọi API logout:", error);
        } finally {
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
                userRole,
                isAdmin,
                isTutor,
                hasRole,
                hasPermission,
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
