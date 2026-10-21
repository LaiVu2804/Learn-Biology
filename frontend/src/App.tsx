import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth.context";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import OAuth2RedirectHandler from "./pages/auth/oauth2-redirect";
import DashboardPage from "./pages/dashboard";

/**
 * Component bảo vệ định tuyến (Protected Route):
 * Nếu chưa đăng nhập -> chuyển hướng về trang /login
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#fff" }}>
                Đang xác thực phiên làm việc...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Các trang Public */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

                    {/* Trang Bảng điều khiển (Protected) */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;

