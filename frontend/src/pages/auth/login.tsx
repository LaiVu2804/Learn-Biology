import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import { callLogin, callRegister } from "../../services/api";
import { useAuth } from "../../context/auth.context";

interface AuthPageProps {
  initialTab?: "login" | "register";
}

export const LoginPage: React.FC<AuthPageProps> = ({ initialTab = "login" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Active tab state: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<"login" | "register">(
    location.pathname === "/register" ? "register" : initialTab
  );

  // Sync tab with pathname when route changes
  useEffect(() => {
    if (location.pathname === "/register") {
      setActiveTab("register");
    } else if (location.pathname === "/login") {
      setActiveTab("login");
    }
  }, [location.pathname]);

  // If already authenticated, redirect immediately to /home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Login form states
  const [loginAccount, setLoginAccount] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form states
  const [regFullname, setRegFullname] = useState("");
  const [regContact, setRegContact] = useState("");
  const [regGrade, setRegGrade] = useState("12-thpt");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  // Destination path after login
  const callbackPath = (location.state as { from?: { pathname: string } })?.from?.pathname || "/home";

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAccount.trim() || !loginPassword) {
      notification.warning({
        message: "Thiếu thông tin",
        description: "Vui lòng nhập Email hoặc Số điện thoại và Mật khẩu!",
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      const res = await callLogin(loginAccount.trim(), loginPassword);

      if (res && res.data && res.data.access_token) {
        const userPayload: IUserLogin = res.data.user || {
          id: 1,
          email: loginAccount.trim(),
          name: loginAccount.trim().split("@")[0],
          role: "ROLE_USER",
        };

        // Save token to global state in memory
        login(res.data.access_token, userPayload);

        notification.success({
          message: "Đăng nhập thành công!",
          description: `Chào mừng ${userPayload.name || userPayload.email} đã quay trở lại!`,
          duration: 3,
        });

        // Redirect to new page with "Xin chào"
        navigate("/home", { replace: true });
      } else {
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
        description: error?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại!",
        duration: 4,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regFullname.trim() || !regContact.trim() || !regPassword) {
      notification.warning({
        message: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ họ tên, email/số điện thoại và mật khẩu!",
      });
      return;
    }

    if (regPassword.length < 6) {
      notification.error({
        message: "Mật khẩu không hợp lệ",
        description: "Mật khẩu phải có tối thiểu 6 ký tự!",
      });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      notification.error({
        message: "Mật khẩu không khớp",
        description: "Mật khẩu xác nhận không trùng khớp với mật khẩu mới!",
      });
      return;
    }

    if (!agreeTerms) {
      notification.warning({
        message: "Điều khoản",
        description: "Bạn cần đồng ý với Điều khoản sử dụng của BioPrep!",
      });
      return;
    }

    setIsRegistering(true);

    try {
      const calculatedAge = regGrade.startsWith("12") ? 18 : regGrade === "11" ? 17 : 16;
      const res = await callRegister({
        name: regFullname.trim(),
        email: regContact.trim(),
        password: regPassword,
        age: calculatedAge,
        gender: "MALE",
        address: `Học sinh ${regGrade}`,
      });

      if (res && (res.statusCode === 201 || res.data)) {
        notification.success({
          message: "Tạo tài khoản thành công! 🎉",
          description: "Tài khoản của bạn đã được khởi tạo. Vui lòng đăng nhập để bắt đầu!",
          duration: 4,
        });

        // Pre-fill login account and switch to login tab
        setLoginAccount(regContact.trim());
        setLoginPassword(regPassword);
        setActiveTab("login");
        window.history.pushState(null, "", "/login");
      } else {
        const errorMsg = Array.isArray(res?.message)
          ? res.message.join(", ")
          : res?.message || res?.error || "Đăng ký thất bại. Email có thể đã được sử dụng!";

        notification.error({
          message: "Đăng ký thất bại",
          description: errorMsg,
          duration: 4,
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi kết nối",
        description: err?.message || "Không thể đăng ký lúc này. Vui lòng thử lại sau!",
        duration: 4,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const switchTab = (tab: "login" | "register") => {
    setActiveTab(tab);
    window.history.pushState(null, "", tab === "login" ? "/login" : "/register");
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="bg-surface-canvas font-body-md text-body min-h-screen flex flex-col justify-between selection:bg-brand-emerald-surface selection:text-brand-emerald-dark">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-surface-card/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border-hairline">
        <div className="h-16 max-w-7xl mx-auto px-gutter-mobile md:px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm group">
            <Link to="/" className="flex items-center gap-2 group select-none">
              <img
                src="/bioprep-logo.png"
                alt="BioPrep Logo"
                className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="font-headline-md text-headline-md text-text-heading group-hover:text-primary transition-colors font-bold">
                BioPrep
              </span>
            </Link>
            <span className="hidden sm:inline-block text-border-hairline mx-space-xs font-light">|</span>
            <span className="hidden sm:inline-block font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
              {activeTab === "login" ? "Cổng Đăng Nhập Khảo Thí" : "Cổng Đăng Ký Học Viên"}
            </span>
          </div>

          <div className="flex items-center gap-space-lg">
            <nav className="flex items-center gap-space-md">
              <Link
                to="/"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">home</span>
                <span className="hidden sm:inline">Trang chủ</span>
              </Link>
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  notification.info({
                    message: "Trợ giúp & Hướng dẫn",
                    description: "Đội ngũ học thuật BioPrep luôn sẵn sàng hỗ trợ bạn 24/7 qua hotline 1900-BioPrep.",
                  });
                }}
                className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Trợ giúp & Hướng dẫn
              </a>
            </nav>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 flex-1 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Subtle decorative background motifs */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#059669_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.035]"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-emerald-surface rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-intellect-indigo-surface rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 w-full flex items-center justify-center px-gutter-mobile md:px-gutter py-space-xl">
          <div className="flex flex-col w-full items-center justify-center py-space-md md:py-space-lg">
            <div className="w-full max-w-[520px] mx-auto flex flex-col gap-space-md">
              {/* Academic Badge Bar */}
              <div className="flex items-center justify-center gap-space-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-label-sm tracking-wide">
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    school
                  </span>
                  Cổng Luyện Thi Trực Tuyến • 2K7 • 2K8 • 2K9
                </span>
              </div>

              {/* Main Central Form Card */}
              <div className="w-full bg-surface-card rounded-xl p-space-lg md:p-space-xl flex flex-col shadow-sm border border-border-hairline">
                {/* Dynamic Header Section */}
                <div className="text-center mb-space-md">
                  <h1 className="font-headline-md text-headline-md text-text-heading tracking-tight font-bold">
                    {activeTab === "login"
                      ? "Chào mừng bạn trở lại với BioPrep"
                      : "Bắt đầu hành trình 9+ Sinh học"}
                  </h1>
                  <p className="font-body-sm text-body-sm text-text-muted mt-1">
                    {activeTab === "login"
                      ? "Hệ thống khảo thí chuyên sâu Sinh học THPT & ĐGNL"
                      : "Trải nghiệm ngân hàng 15.000+ câu hỏi phân hóa thực chiến"}
                  </p>
                </div>

                {/* Segmented Tab Switcher */}
                <div className="relative bg-surface-container p-1 rounded-lg flex items-center mb-space-lg select-none">
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface-card rounded-md transition-all duration-200 ease-out shadow-sm ${activeTab === "login" ? "left-1" : "left-[calc(50%+0px)]"
                      }`}
                  ></div>
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className={`relative z-10 w-1/2 py-2 text-center font-label-md text-label-md transition-colors cursor-pointer ${activeTab === "login"
                        ? "text-primary font-bold"
                        : "text-text-muted hover:text-text-heading font-medium"
                      }`}
                  >
                    Đăng nhập
                  </button>
                  <button
                    type="button"
                    onClick={() => switchTab("register")}
                    className={`relative z-10 w-1/2 py-2 text-center font-label-md text-label-md transition-colors cursor-pointer ${activeTab === "register"
                        ? "text-primary font-bold"
                        : "text-text-muted hover:text-text-heading font-medium"
                      }`}
                  >
                    Đăng ký mới
                  </button>
                </div>

                {/* ================= LOGIN FORM ================= */}
                {activeTab === "login" && (
                  <form className="flex flex-col gap-space-md" onSubmit={handleLoginSubmit}>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-text-heading font-semibold" htmlFor="login-account">
                        Email hoặc Số điện thoại
                      </label>
                      <div className="relative">
                        <input
                          id="login-account"
                          type="text"
                          required
                          value={loginAccount}
                          onChange={(e) => setLoginAccount(e.target.value)}
                          placeholder="nguyenvana@gmail.com hoặc 0912xxx"
                          className="w-full h-11 px-3.5 bg-surface-card text-text-body font-body-md text-body-md rounded-lg border border-border-hairline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-caption transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-text-heading font-semibold" htmlFor="login-password">
                        Mật khẩu
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Nhập mật khẩu tài khoản"
                          className="w-full h-11 pl-3.5 pr-10 bg-surface-card text-text-body font-body-md text-body-md rounded-lg border border-border-hairline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-caption transition-all"
                        />
                        <button
                          type="button"
                          aria-label="Ẩn hoặc hiện mật khẩu"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          tabIndex={-1}
                          className="absolute right-3 text-text-muted hover:text-text-heading focus:outline-none cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showLoginPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between font-label-sm text-label-sm mt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer text-text-body select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                        />
                        <span>Ghi nhớ đăng nhập</span>
                      </label>
                      <a
                        href="#forgot-password"
                        onClick={(e) => {
                          e.preventDefault();
                          notification.info({
                            message: "Khôi phục mật khẩu",
                            description: "Vui lòng liên hệ ban quản trị hoặc kiểm tra email đã đăng ký để lấy lại mật khẩu.",
                          });
                        }}
                        className="text-primary hover:text-brand-emerald-dark font-medium transition-colors"
                      >
                        Quên mật khẩu?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full h-11 mt-1 bg-primary hover:bg-brand-emerald-dark active:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-70"
                    >
                      <span>{isLoggingIn ? "Đang xử lý..." : "Đăng nhập vào BioPrep"}</span>
                      {!isLoggingIn && (
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      )}
                    </button>
                  </form>
                )}

                {/* ================= REGISTER FORM ================= */}
                {activeTab === "register" && (
                  <form className="flex flex-col gap-space-md" onSubmit={handleRegisterSubmit}>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-text-heading font-semibold" htmlFor="reg-fullname">
                        Họ và tên học sinh
                      </label>
                      <input
                        id="reg-fullname"
                        type="text"
                        required
                        value={regFullname}
                        onChange={(e) => setRegFullname(e.target.value)}
                        placeholder="vd: Nguyễn Minh Châu"
                        className="w-full h-11 px-3.5 bg-surface-card text-text-body font-body-md text-body-md rounded-lg border border-border-hairline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-caption transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-text-heading font-semibold" htmlFor="reg-contact">
                        Email hoặc Số điện thoại xác thực
                      </label>
                      <input
                        id="reg-contact"
                        type="text"
                        required
                        value={regContact}
                        onChange={(e) => setRegContact(e.target.value)}
                        placeholder="Để nhận mã kích hoạt và báo cáo điểm"
                        className="w-full h-11 px-3.5 bg-surface-card text-text-body font-body-md text-body-md rounded-lg border border-border-hairline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-caption transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-text-heading font-semibold" htmlFor="reg-grade">
                        Mục tiêu học tập & Khối lớp
                      </label>
                      <div className="relative">
                        <select
                          id="reg-grade"
                          value={regGrade}
                          onChange={(e) => setRegGrade(e.target.value)}
                          className="w-full h-11 px-3.5 bg-surface-card text-text-body font-body-md text-body-md rounded-lg border border-border-hairline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer transition-all"
                        >
                          <option value="12-thpt">Lớp 12 • Ôn thi TN THPT Quốc gia 2025</option>
                          <option value="12-dgnl">Lớp 12 • Đánh giá năng lực ĐHQG (Hà Nội & TP.HCM)</option>
                          <option value="11">Lớp 11 • Chương trình mới (Cánh Diều / Kết Nối / Chân Trời)</option>
                          <option value="10">Lớp 10 • Nền tảng Sinh học đại cương</option>
                          <option value="hsg">Bồi dưỡng Học sinh giỏi Tỉnh / Quốc gia</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[18px]">
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-text-heading font-semibold" htmlFor="reg-pwd">
                          Mật khẩu mới
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="reg-pwd"
                            type={showRegPassword ? "text" : "password"}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Tối thiểu 6 ký tự"
                            className="w-full h-11 pl-3 pr-8 bg-surface-card text-text-body font-body-md text-body-md rounded-lg border border-border-hairline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-caption transition-all"
                          />
                          <button
                            type="button"
                            aria-label="Ẩn hoặc hiện mật khẩu"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            tabIndex={-1}
                            className="absolute right-2.5 text-text-muted hover:text-text-heading focus:outline-none cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {showRegPassword ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-text-heading font-semibold" htmlFor="reg-pwd-confirm">
                          Xác nhận mật khẩu
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="reg-pwd-confirm"
                            type={showRegConfirmPassword ? "text" : "password"}
                            required
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            className="w-full h-11 pl-3 pr-8 bg-surface-card text-text-body font-body-md text-body-md rounded-lg border border-border-hairline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-caption transition-all"
                          />
                          <button
                            type="button"
                            aria-label="Ẩn hoặc hiện mật khẩu"
                            onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                            tabIndex={-1}
                            className="absolute right-2.5 text-text-muted hover:text-text-heading focus:outline-none cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {showRegConfirmPassword ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mt-0.5">
                      <input
                        id="reg-terms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        required
                        className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                      />
                      <label className="font-body-sm text-body-sm text-text-muted leading-tight cursor-pointer" htmlFor="reg-terms">
                        Tôi đồng ý với{" "}
                        <a href="#terms" className="text-primary hover:underline">
                          Điều khoản sử dụng
                        </a>{" "}
                        và{" "}
                        <a href="#privacy" className="text-primary hover:underline">
                          Chính sách bảo mật
                        </a>{" "}
                        của BioPrep.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full h-11 mt-1 bg-primary hover:bg-brand-emerald-dark active:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-70"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>{isRegistering ? "Đang tạo tài khoản..." : "Tạo tài khoản học thử miễn phí"}</span>
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="relative my-space-lg flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full bg-border-hairline h-[1px]"></div>
                  </div>
                  <span className="relative z-10 px-3 bg-surface-card font-label-sm text-label-sm text-text-caption uppercase tracking-wider">
                    hoặc tiếp tục với
                  </span>
                </div>

                {/* Social Authentication Buttons */}
                <div className="grid grid-cols-2 gap-space-sm">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="h-11 px-3 bg-surface-card hover:bg-surface-canvas text-text-heading font-label-md text-label-md rounded-lg border border-border-hairline flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        fill="#EA4335"
                      ></path>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      notification.info({
                        message: "Apple ID",
                        description: "Phương thức đăng nhập qua Apple ID đang được cập nhật.",
                      });
                    }}
                    className="h-11 px-3 bg-surface-card hover:bg-surface-canvas text-text-heading font-label-md text-label-md rounded-lg border border-border-hairline flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current text-text-heading" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.86.96-2.95-1 .04-2.15.65-2.82 1.43-.59.67-1.11 1.77-.97 2.83 1.12.09 2.2-.55 2.83-1.31z"></path>
                    </svg>
                    <span>Apple ID</span>
                  </button>
                </div>
              </div>

              {/* Assurance & Trust Strip */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 px-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 py-1.5 px-2 text-text-muted">
                  <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                  <span className="font-body-sm text-body-sm">45.000+ sĩ tử theo học</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 py-1.5 px-2 text-text-muted">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  <span className="font-body-sm text-body-sm">Chuẩn đề BGD & ĐGNL</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 py-1.5 px-2 text-text-muted">
                  <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
                  <span className="font-body-sm text-body-sm">Bảo mật thông tin 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-card shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-t border-border-hairline py-space-md">
        <div className="max-w-7xl mx-auto px-gutter-mobile md:px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <div className="font-body-sm text-body-sm text-text-muted text-center sm:text-left">
            © 2025 BioPrep. Nền tảng luyện thi Sinh học THPT & ĐGNL. Bản quyền thuộc về BioPrep EdTech.
          </div>
          <div className="flex items-center gap-space-md font-label-sm text-label-sm">
            <a href="#terms" className="text-on-surface-variant hover:text-primary transition-colors">
              Điều khoản sử dụng
            </a>
            <span className="text-border-hairline">•</span>
            <a href="#privacy" className="text-on-surface-variant hover:text-primary transition-colors">
              Chính sách bảo mật
            </a>
            <span className="text-border-hairline">•</span>
            <a href="#contact" className="text-on-surface-variant hover:text-primary transition-colors">
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
