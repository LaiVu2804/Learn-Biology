import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Row, Col, notification, Select, InputNumber, Divider } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm<IRegisterReq>();

    /**
     * Xử lý gửi Form Đăng Ký
     */
    const onFinish = async (values: IRegisterReq) => {
        setIsSubmit(true);

        try {
            const res = await callRegister(values);

            if (res && (res.statusCode === 201 || res.data)) {
                notification.success({
                    message: "Đăng ký thành công",
                    description: `Tài khoản ${values.email} đã được tạo thành công! Hãy đăng nhập để tiếp tục.`,
                    duration: 3,
                });

                // Chuyển hướng sang trang đăng nhập
                navigate("/login");
            } else {
                const errorMessage = Array.isArray(res.message)
                    ? res.message.join(", ")
                    : res.message || res.error || "Không thể đăng ký tài khoản. Vui lòng thử lại!";

                notification.error({
                    message: "Đăng ký thất bại",
                    description: errorMessage,
                    duration: 4,
                });
            }
        } catch (error: any) {
            notification.error({
                message: "Lỗi kết nối",
                description: error?.message || "Đã xảy ra lỗi khi tạo tài khoản!",
                duration: 4,
            });
        } finally {
            setIsSubmit(false);
        }
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
                <Col xs={24} sm={20} md={14} lg={10} xl={9}>
                    <Card
                        style={{
                            borderRadius: 16,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                            border: "1px solid #334155",
                            backgroundColor: "#1e293b",
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                            <Title level={3} style={{ color: "#f8fafc", margin: 0 }}>
                                🧬 Đăng Ký Tài Khoản
                            </Title>
                            <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                                Khởi tạo tài khoản người dùng mới trên hệ thống
                            </Text>
                        </div>

                        <Form<IRegisterReq>
                            form={form}
                            name="registerForm"
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                            size="large"
                            initialValues={{
                                age: 20,
                                gender: "MALE",
                            }}
                        >
                            <Form.Item
                                label={<span style={{ color: "#cbd5e1" }}>Họ và tên</span>}
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên của bạn!" }]}
                            >
                                <Input prefix={<UserOutlined style={{ color: "#64748b" }} />} placeholder="Nguyễn Văn A" />
                            </Form.Item>

                            <Form.Item
                                label={<span style={{ color: "#cbd5e1" }}>Email</span>}
                                name="email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập Email!" },
                                    { type: "email", message: "Định dạng email không hợp lệ!" },
                                ]}
                            >
                                <Input prefix={<MailOutlined style={{ color: "#64748b" }} />} placeholder="student@gmail.com" />
                            </Form.Item>

                            <Form.Item
                                label={<span style={{ color: "#cbd5e1" }}>Mật khẩu</span>}
                                name="password"
                                rules={[
                                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                                    { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined style={{ color: "#64748b" }} />} placeholder="••••••••" />
                            </Form.Item>

                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label={<span style={{ color: "#cbd5e1" }}>Tuổi</span>} name="age">
                                        <InputNumber style={{ width: "100%" }} min={1} max={120} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={<span style={{ color: "#cbd5e1" }}>Giới tính</span>} name="gender">
                                        <Select>
                                            <Option value="MALE">Nam</Option>
                                            <Option value="FEMALE">Nữ</Option>
                                            <Option value="OTHER">Khác</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label={<span style={{ color: "#cbd5e1" }}>Địa chỉ</span>} name="address">
                                <Input prefix={<HomeOutlined style={{ color: "#64748b" }} />} placeholder="Hà Nội, Việt Nam" />
                            </Form.Item>

                            <Form.Item style={{ marginTop: 20 }}>
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
                                    Đăng Ký Tài Khoản
                                </Button>
                            </Form.Item>
                        </Form>

                        <Divider style={{ borderColor: "#334155", margin: "16px 0" }} />

                        <div style={{ textAlign: "center" }}>
                            <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                                Đã có tài khoản?{" "}
                                <Link to="/login" style={{ color: "#818cf8", fontWeight: 600 }}>
                                    Đăng nhập tại đây
                                </Link>
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RegisterPage;

