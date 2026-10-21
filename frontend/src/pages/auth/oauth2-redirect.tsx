// frontend/src/pages/auth/oauth2-redirect.tsx
import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notification, Spin } from "antd";
import { useAuth } from "../../context/auth.context";

const OAuth2RedirectHandler: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { triggerSilentRefresh } = useAuth();
    const isCalledRef = useRef<boolean>(false);

    useEffect(() => {
        if (isCalledRef.current) return;
        isCalledRef.current = true;

        // BƯỚC 1: Kiểm tra xem có lỗi từ OAuth2 hay không
        const error = searchParams.get("error");
        if (error) {
            notification.error({
                message: "Đăng nhập Google không thành công",
                description: error === "oauth2_cancelled"
                    ? "Bạn đã hủy quá trình đăng nhập bằng tài khoản Google."
                    : "Đã xảy ra lỗi xác thực từ Google. Vui lòng thử lại!",
                duration: 4,
            });
            navigate("/login", { replace: true });
            return;
        }

        // BƯỚC 2: Nếu không có lỗi, tiến hành nạp phiên đăng nhập
        const processGoogleAuth = async () => {
            try {
                const isSuccess = await triggerSilentRefresh();
                if (isSuccess) {
                    notification.success({
                        message: "Đăng nhập Google thành công! 🎉",
                        description: "Xác thực bảo mật hoàn tất. Chào mừng bạn đã quay trở lại!",
                        duration: 3,
                    });
                    navigate("/", { replace: true });
                } else {
                    notification.error({
                        message: "Đăng nhập thất bại",
                        description: "Không thể lấy thông tin phiên làm việc từ máy chủ. Vui lòng thử lại!",
                        duration: 4,
                    });
                    navigate("/login", { replace: true });
                }
            } catch (err: any) {
                notification.error({
                    message: "Lỗi kết nối",
                    description: err?.message || "Đã xảy ra lỗi khi hoàn tất đăng nhập Google!",
                    duration: 4,
                });
                navigate("/login", { replace: true });
            }
        };

        processGoogleAuth();
    }, [triggerSilentRefresh, navigate, searchParams]);

    return (
        <div style={{ /* giữ nguyên UI của bạn */ }}>
            <Spin size="large" />
            <span style={{ fontSize: 16, color: "#94a3b8" }}>
                Đang hoàn tất xác thực tài khoản Google an toàn, vui lòng chờ trong giây lát...
            </span>
        </div>
    );
};

export default OAuth2RedirectHandler;