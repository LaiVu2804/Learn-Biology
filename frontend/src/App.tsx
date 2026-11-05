import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth.context";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import OAuth2RedirectHandler from "./pages/auth/oauth2-redirect";
import ExamConfigPage from "./pages/exam-config";
import ExamRoomPage from "./pages/exam-room";
import AdminPage from "./pages/admin";
import TutorPage from "./pages/tutor";
import RoleRoute from "./components/common/RoleRoute";

/**
 * Component bảo vệ định tuyến (Protected Route):
 * Nếu chưa đăng nhập -> chuyển hướng về trang /login
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "#006948",
          fontFamily: "Be Vietnam Pro, sans-serif",
          backgroundColor: "#f8f9ff",
        }}
      >
        Đang xác thực phiên làm việc BioPrep...
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
          {/* Trang Landing Page công khai theo thiết kế Stitch */}
          <Route path="/" element={<LandingPage />} />

          {/* Các trang Public Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* Trang Cấu hình bài kiểm tra (sau khi đăng nhập) */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <ExamConfigPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ExamConfigPage />
              </ProtectedRoute>
            }
          />

          {/* Trang Phòng thi trực tuyến thực chiến bấm giờ */}
          <Route
            path="/exam"
            element={
              <ProtectedRoute>
                <ExamRoomPage />
              </ProtectedRoute>
            }
          />

          {/* CỔNG QUẢN TRỊ ADMIN (Chỉ dành cho ROLE_ADMIN) */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={["ROLE_ADMIN"]}>
                <AdminPage />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RoleRoute allowedRoles={["ROLE_ADMIN"]}>
                <AdminPage />
              </RoleRoute>
            }
          />

          {/* CỔNG GIẢNG VIÊN KHẢO THÍ (Dành cho ROLE_TUTOR và ROLE_ADMIN) */}
          <Route
            path="/tutor"
            element={
              <RoleRoute allowedRoles={["ROLE_TUTOR", "ROLE_ADMIN"]}>
                <TutorPage />
              </RoleRoute>
            }
          />
          <Route
            path="/tutor/*"
            element={
              <RoleRoute allowedRoles={["ROLE_TUTOR", "ROLE_ADMIN"]}>
                <TutorPage />
              </RoleRoute>
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
