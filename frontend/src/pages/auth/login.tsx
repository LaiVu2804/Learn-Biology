import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Row, Col, notification, Divider } from "antd";
import { UserOutlined, LockOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { callLogin } from "../../services/api";
import { useAuth } from "../../context/auth.context";

const { Title, Text } = Typography;

interface ILoginFormValues {
    username: string; // Bản chất là email người dùng
    password: string;
}

const GoogleIcon: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8, verticalAlign: "middle" }}>
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
    </svg>
);

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    // Nếu đã đăng nhập thì tự động chuyển hướng về trang chủ
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // BƯỚC 1: Trạng thái isSubmit (loading) ban đầu là false
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm<ILoginFormValues>();

    /**
     * Lấy đường dẫn callback mà người dùng đang muốn truy cập trước khi bị chuyển về trang login
     */
    const callbackPath = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

    /**
     * BƯỚC 2: Xử lý khi người dùng ấn nút "Đăng nhập"
     * @param values Chứa email (username) và password
     */
    const onFinish = async (values: ILoginFormValues) => {
        const { username, password } = values;

        // Bật loading để chặn việc click nhiều lần
        setIsSubmit(true);

        try {
            // Gọi hàm callLogin (từ api.ts) gửi HTTP POST tới /api/v1/auth/login
            const res = await callLogin(username, password);

            // BƯỚC 3 & BƯỚC 4: Kiểm tra kết quả phản hồi từ Backend
            if (res && res.data && res.data.access_token) {
                // Nạp Access Token vào bộ nhớ RAM và cập nhật Global State (KHÔNG lưu localStorage)
                const userPayload: IUserLogin = res.data.user || {
                    id: 1,
                    email: username,
                    name: username,
                    role: "ROLE_USER",
                };
                login(res.data.access_token, userPayload);

                // Hiển thị thông báo thành công
                notification.success({
                    message: "Đăng nhập thành công",
                    description: `Chào mừng ${userPayload.name || userPayload.email} đã quay trở lại!`,
                    duration: 3,
                });

                // Chuyển hướng người dùng (Redirect) về Dashboard hoặc Callback Path
                navigate(callbackPath, { replace: true });
            } else {
                // BƯỚC 3 (Lỗi): Backend trả về thông báo lỗi
                const errorMessage = Array.isArray(res.message)
                    ? res.message.join(", ")
                    : res.message || res.error || "Email hoặc mật khẩu không chính xác!";

                notification.error({
                    message: "Đăng nhập thất bại",
                    description: errorMessage,
                    duration: 4,
                });
            }
        } catch (error: any) {
            notification.error({
                message: "Lỗi kết nối",
                description: error?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau!",
                duration: 4,
            });
        } finally {
            // Tắt trạng thái loading sau khi có phản hồi
            setIsSubmit(false);
        }
    };

    /**
     * Chuyển hướng trình duyệt sang Backend để bắt đầu luồng xác thực OAuth2 với Google
     */
    const handleLoginWithGoogle = () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
        window.location.href = `${backendUrl}/oauth2/authorization/google`;
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px",
            }}
        >
            <Row justify="center" style={{ width: "100%" }}>
                <Col xs={24} sm={20} md={12} lg={8} xl={7}>
                    <Card
                        style={{
                            borderRadius: 16,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
                            border: "1px solid #334155",
                            backgroundColor: "#1e293b",
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <Title level={3} style={{ color: "#f8fafc", margin: 0 }}>
                                🧬 Đăng Nhập
                            </Title>
                            <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                                Cổng xác thực sinh học LearnBiology
                            </Text>
                        </div>

                        {/* FORM ĐĂNG NHẬP ANT DESIGN */}
                        <Form<ILoginFormValues>
                            form={form}
                            name="loginForm"
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                            size="large"
                        >
                            <Form.Item
                                label={<span style={{ color: "#cbd5e1" }}>Email / Tên tài khoản</span>}
                                name="username"
                                rules={[
                                    { required: true, message: "Vui lòng nhập Email của bạn!" },
                                    { type: "email", message: "Định dạng email không hợp lệ!" },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: "#64748b" }} />}
                                    placeholder="admin@gmail.com"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span style={{ color: "#cbd5e1" }}>Mật khẩu</span>}
                                name="password"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: "#64748b" }} />}
                                    placeholder="••••••••"
                                />
                            </Form.Item>

                            <Form.Item style={{ marginTop: 24, marginBottom: 12 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={isSubmit}
                                    style={{
                                        height: 44,
                                        fontWeight: 600,
                                        borderRadius: 8,
                                        backgroundColor: "#4f46e5",
                                    }}
                                >
                                    Đăng Nhập <ArrowRightOutlined />
                                </Button>
                            </Form.Item>
                        </Form>

                        <Divider style={{ borderColor: "#334155", margin: "16px 0", color: "#64748b", fontSize: 13 }}>
                            Hoặc tiếp tục với
                        </Divider>

                        {/* NÚT ĐĂNG NHẬP GOOGLE */}
                        <Button
                            block
                            size="large"
                            icon={<GoogleIcon />}
                            onClick={handleLoginWithGoogle}
                            style={{
                                height: 44,
                                borderRadius: 8,
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                color: "#f8fafc",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                            }}
                        >
                            Đăng nhập bằng tài khoản Google
                        </Button>

                        <Divider style={{ borderColor: "#334155", margin: "20px 0" }} />

                        <div style={{ textAlign: "center" }}>
                            <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                                Chưa có tài khoản?{" "}
                                <Link to="/register" style={{ color: "#818cf8", fontWeight: 600 }}>
                                    Đăng ký ngay
                                </Link>
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default LoginPage;

