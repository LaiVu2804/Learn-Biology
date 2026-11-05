import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/auth.context";

interface RoleRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, isLoading, hasRole, userRole } = useAuth();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-surface-canvas text-primary">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-label-md text-label-md">Đang xác thực quyền truy cập BioPrep...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        return (
            <div className="min-h-screen bg-surface-canvas flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-danger-surface text-danger-text flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[36px]">gavel</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-text-heading mb-2">
                    403 - Không có quyền truy cập
                </h1>
                <p className="text-text-muted max-w-md mb-6 font-body-md text-body-md">
                    Tài khoản của bạn hiện có vai trò: <span className="font-semibold text-primary">{userRole}</span>. 
                    Trang này yêu cầu một trong các quyền: <span className="font-mono text-danger-text font-medium">{allowedRoles.join(", ")}</span>.
                </p>
                <div className="flex items-center gap-3">
                    <Link
                        to="/home"
                        className="px-4 py-2 bg-primary hover:bg-brand-emerald-dark text-on-primary rounded-lg font-label-md text-label-md transition-colors"
                    >
                        Quay lại Trang chính
                    </Link>
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-surface-card border border-border-hairline text-text-body hover:bg-surface-canvas rounded-lg font-label-md text-label-md transition-colors"
                    >
                        Đổi tài khoản khác
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default RoleRoute;

