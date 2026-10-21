import React, { useState } from "react";
import { Layout, Typography, Card, Row, Col, Button, Space, Tag, Avatar, notification, Divider } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    SafetyCertificateOutlined,
    ApiOutlined,
    CopyOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/auth.context";
import { callFetchUserById } from "../../services/api";
import { getAccessToken } from "../../services/auth-memory";

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [loadingApi, setLoadingApi] = useState<boolean>(false);

    // Lấy Access Token trực tiếp từ bộ nhớ RAM
    const token = getAccessToken() || "";

    /**
     * Sao chép Access Token vào clipboard
     */
    const copyTokenToClipboard = () => {
        if (!token) return;
        navigator.clipboard.writeText(token);
        notification.success({
            message: "Đã sao chép",
            description: "Access Token đã được lưu vào bộ nhớ tạm!",
            duration: 2,
        });
    };

    /**
     * BƯỚC 5: Thử nghiệm gửi Request kèm Access Token qua Axios Interceptor
     */
    const testProtectedApi = async () => {
        setLoadingApi(true);
        try {
            const userId = user?.id || 1;
            // Interceptor trong axios-customize.ts sẽ tự động gắn Authorization: Bearer <token>
            const res = await callFetchUserById(userId);
            setApiResponse(res);
            notification.success({
                message: "Gọi API thành công (HTTP 200)",
                description: `Interceptor đã tự động gắn Token và lấy thành công thông tin User ID = ${userId}`,
            });
        } catch (error: any) {
            setApiResponse(error);
            notification.error({
                message: "Gọi API thất bại",
                description: error?.message || "Đã xảy ra lỗi!",
            });
        } finally {
            setLoadingApi(false);
        }
    };

    /**
     * Thử nghiệm gọi trực tiếp API nhưng cố tình KHÔNG gắn Token
     */
    const testWithoutToken = async () => {
        setLoadingApi(true);
        try {
            const rawResponse = await fetch("http://localhost:8080/api/v1/users/1", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await rawResponse.json().catch(() => null);
            setApiResponse(data);

            if (rawResponse.status === 401) {
                notification.info({
                    message: "Kỳ vọng chính xác: HTTP 401",
                    description: "Backend chặn lại vì Request không có Bearer Token!",
                });
            }
        } catch (e: any) {
            setApiResponse({ error: e.message });
        } finally {
            setLoadingApi(false);
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#0b0f19" }}>
            {/* THANH HEADER ĐIỀU HƯỚNG */}
            <Header
                style={{
                    backgroundColor: "#111827",
                    borderBottom: "1px solid #1e293b",
                    padding: "0 28px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>🧬</span>
                    <Text strong style={{ color: "#fff", fontSize: 16 }}>
                        LearnBiology Dashboard
                    </Text>
                </div>

                <Space size="middle">
                    <Space style={{ backgroundColor: "#1f2937", padding: "4px 12px", borderRadius: 20 }}>
                        <Avatar
                            size="small"
                            icon={<UserOutlined />}
                            style={{ backgroundColor: "#4f46e5" }}
                        >
                            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                        </Avatar>
                        <Text style={{ color: "#e2e8f0", fontSize: 13 }}>
                            {user?.name || user?.email || "Người dùng"}
                        </Text>
                    </Space>

                    {/* NÚT ĐĂNG XUẤT */}
                    <Button
                        danger
                        type="primary"
                        icon={<LogoutOutlined />}
                        onClick={logout}
                        style={{ borderRadius: 8, fontWeight: 600 }}
                    >
                        Đăng Xuất
                    </Button>
                </Space>
            </Header>

            {/* NỘI DUNG CHÍNH */}
            <Content style={{ padding: "28px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
                {/* BANNER CHÀO MỪNG */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
                        border: "1px solid #4338ca",
                        borderRadius: 16,
                        padding: "24px 28px",
                        marginBottom: 24,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <Title level={3} style={{ color: "#fff", margin: 0 }}>
                            Xin chào, {user?.name || user?.email}! 👋
                        </Title>
                        <Paragraph style={{ color: "#c7d2fe", margin: "6px 0 0 0", fontSize: 14 }}>
                            Phiên đăng nhập của bạn đang hoạt động an toàn với cơ chế bảo mật JWT + HttpOnly Cookie.
                        </Paragraph>
                    </div>
                    <Tag icon={<CheckCircleOutlined />} color="success" style={{ padding: "4px 10px", fontSize: 13 }}>
                        Đã xác thực
                    </Tag>
                </div>

                {/* 2 CỘT CHỨC NĂNG */}
                <Row gutter={[20, 20]}>
                    {/* CỘT 1: THÔNG TIN TÀI KHOẢN VÀ TOKEN */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <span style={{ color: "#f8fafc" }}>
                                    <SafetyCertificateOutlined style={{ color: "#38bdf8", marginRight: 8 }} />
                                    Thông Tin Tài Khoản & Token
                                </span>
                            }
                            style={{
                                backgroundColor: "#151d30",
                                borderColor: "#243049",
                                borderRadius: 14,
                            }}
                        >
                            <Paragraph style={{ color: "#94a3b8" }}>
                                <strong>User ID:</strong> <Text style={{ color: "#f1f5f9" }}>{user?.id || "N/A"}</Text>
                            </Paragraph>
                            <Paragraph style={{ color: "#94a3b8" }}>
                                <strong>Họ tên:</strong> <Text style={{ color: "#f1f5f9" }}>{user?.name || "N/A"}</Text>
                            </Paragraph>
                            <Paragraph style={{ color: "#94a3b8" }}>
                                <strong>Email:</strong> <Text style={{ color: "#f1f5f9" }}>{user?.email || "N/A"}</Text>
                            </Paragraph>
                            <Paragraph style={{ color: "#94a3b8" }}>
                                <strong>Vai trò (Role):</strong>{" "}
                                <Tag color="blue">
                                    {typeof user?.role === "object" && user?.role !== null
                                        ? (user.role as any).name || "ROLE_USER"
                                        : String(user?.role || "ROLE_USER")}
                                </Tag>
                            </Paragraph>

                            <Divider style={{ borderColor: "#243049" }} />

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text strong style={{ color: "#cbd5e1" }}>
                                    Access Token (Bearer):
                                </Text>
                                <Button
                                    size="small"
                                    type="dashed"
                                    icon={<CopyOutlined />}
                                    onClick={copyTokenToClipboard}
                                    style={{ color: "#38bdf8", borderColor: "#0284c7" }}
                                >
                                    Sao chép
                                </Button>
                            </div>

                            <div
                                style={{
                                    backgroundColor: "#090d16",
                                    padding: 10,
                                    borderRadius: 8,
                                    color: "#38bdf8",
                                    fontSize: 11,
                                    fontFamily: "monospace",
                                    wordBreak: "break-all",
                                    maxHeight: 90,
                                    overflowY: "auto",
                                    marginTop: 8,
                                    border: "1px solid #1e293b",
                                }}
                            >
                                {token || "Chưa có token"}
                            </div>
                        </Card>
                    </Col>

                    {/* CỘT 2: KIỂM THỬ GỌI API */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <span style={{ color: "#f8fafc" }}>
                                    <ApiOutlined style={{ color: "#10b981", marginRight: 8 }} />
                                    Kiểm Thử Request & Interceptor
                                </span>
                            }
                            style={{
                                backgroundColor: "#151d30",
                                borderColor: "#243049",
                                borderRadius: 14,
                            }}
                        >
                            <Paragraph style={{ color: "#94a3b8", fontSize: 13 }}>
                                Kiểm tra cơ chế tự động đính kèm Access Token của <code>axios-customize.ts</code> khi gọi API được bảo vệ.
                            </Paragraph>

                            <Space wrap style={{ marginBottom: 16 }}>
                                <Button
                                    type="primary"
                                    loading={loadingApi}
                                    onClick={testProtectedApi}
                                    style={{ backgroundColor: "#4f46e5" }}
                                >
                                    ⚡ Gọi API User (kèm Token)
                                </Button>
                                <Button danger ghost loading={loadingApi} onClick={testWithoutToken}>
                                    ❌ Test không kèm Token
                                </Button>
                            </Space>

                            <Text strong style={{ color: "#cbd5e1", display: "block", marginBottom: 6 }}>
                                Kết Quả Phản Hồi (Generic IBackendRes&lt;T&gt;):
                            </Text>

                            <div
                                style={{
                                    backgroundColor: "#080c14",
                                    padding: 12,
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontFamily: "monospace",
                                    color: "#a7f3d0",
                                    minHeight: 140,
                                    maxHeight: 180,
                                    overflowY: "auto",
                                    border: "1px solid #1e293b",
                                }}
                            >
                                {apiResponse ? (
                                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                                        {JSON.stringify(apiResponse, null, 2)}
                                    </pre>
                                ) : (
                                    <span style={{ color: "#64748b" }}>
                                        Chưa có phản hồi. Nhấn nút kiểm thử ở trên để xem kết quả trả về từ Backend.
                                    </span>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default DashboardPage;

