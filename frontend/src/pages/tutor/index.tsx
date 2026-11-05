import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import TutorDashboard from "./TutorDashboard";
import TutorQuestionBank from "./TutorQuestionBank";
import { notification } from "antd";

export const TutorPage: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "questions">("dashboard");

  const handleLogout = async () => {
    try {
      await logout();
      notification.success({ message: "Đã đăng xuất khỏi cổng Giảng viên" });
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-body font-body-md antialiased flex">
      {/* ASIDE / SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-card border-r border-border-hairline z-50 flex flex-col justify-between overflow-y-auto select-none">
        <div className="flex flex-col flex-1">
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-border-hairline bg-surface-card">
            <Link to="/home" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">biotech</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-base font-bold text-text-heading tracking-tight">
                    BioPrep
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-brand-emerald-surface text-brand-emerald-dark border border-brand-emerald-light/40 font-label-sm text-[10px] font-bold">
                    PRO
                  </span>
                </div>
                <span className="font-label-sm text-[11px] text-text-muted">
                  Cổng Khảo thí & Biên soạn
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-4">
            <div className="px-3 pb-2">
              <span className="font-label-sm text-[11px] font-semibold text-text-caption uppercase tracking-wider">
                Phân hệ Giảng dạy
              </span>
            </div>

            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setActiveMenu("dashboard")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left w-full cursor-pointer ${
                  activeMenu === "dashboard"
                    ? "bg-brand-emerald-surface text-brand-emerald-dark font-semibold border-r-4 border-primary"
                    : "text-text-body hover:bg-surface-canvas hover:text-text-heading"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] text-text-muted">
                  space_dashboard
                </span>
                <span className="font-label-md text-xs">Tổng quan & Thống kê</span>
              </button>

              <button
                onClick={() => setActiveMenu("questions")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left w-full cursor-pointer ${
                  activeMenu === "questions"
                    ? "bg-brand-emerald-surface text-brand-emerald-dark font-semibold border-r-4 border-primary"
                    : "text-text-body hover:bg-surface-canvas hover:text-text-heading"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] text-text-muted">
                  strikethrough_s
                </span>
                <span className="font-label-md text-xs">Ngân hàng câu hỏi Sinh học</span>
              </button>

              <Link
                to="/home"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-body hover:bg-surface-canvas hover:text-text-heading transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-text-muted">
                  assignment
                </span>
                <span className="font-label-md text-xs">Cấu hình & Tạo đề thi</span>
              </Link>

              <Link
                to="/exam"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-body hover:bg-surface-canvas hover:text-text-heading transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-text-muted">
                  timer
                </span>
                <span className="font-label-md text-xs">Phòng thi trực tuyến</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    admin_panel_settings
                  </span>
                  <span className="font-label-md text-xs font-semibold">Chuyển sang Admin Portal</span>
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Contribution Score Widget */}
        <div className="p-4 border-t border-border-hairline bg-surface-card">
          <div className="bg-surface-canvas border border-border-hairline rounded-xl p-4 flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs font-semibold text-text-muted uppercase tracking-wider">
                Hồ sơ Đóng góp
              </span>
              <span className="flex items-center gap-0.5 text-amber-600 font-label-sm text-xs font-bold">
                <span className="material-symbols-outlined text-[15px] fill-current">star</span>
                4.9
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex flex-col">
                <span className="font-headline-sm text-lg font-bold text-text-heading">428</span>
                <span className="text-[11px] text-text-muted">Câu hỏi duyệt</span>
              </div>
              <div className="flex flex-col border-l border-border-hairline pl-3">
                <span className="font-headline-sm text-lg font-bold text-text-heading">18</span>
                <span className="text-[11px] text-text-muted">Đề chuẩn ĐGNL</span>
              </div>
            </div>

            <div className="w-full bg-border-subtle rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full w-[86%]"></div>
            </div>

            <div className="flex items-center justify-between text-text-caption font-label-sm text-[11px]">
              <span>Chỉ tiêu học kỳ 2</span>
              <span className="font-medium text-primary">86%</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="pl-72 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface-card/95 backdrop-blur border-b border-border-hairline z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald-surface text-brand-emerald-dark border border-brand-emerald-light/40">
              <span className="w-2 h-2 rounded-full bg-brand-emerald-dark animate-pulse"></span>
              <span className="font-label-sm text-[11px] font-bold tracking-wide uppercase">
                Giảng viên / Tác giả Khảo thí
              </span>
            </div>

            <div className="relative flex items-center w-80">
              <span className="material-symbols-outlined absolute left-3 text-text-caption text-[18px]">
                search
              </span>
              <input
                className="w-full h-9 pl-9 pr-4 bg-surface-canvas border border-border-hairline rounded-lg font-body-sm text-xs text-text-heading placeholder-text-caption focus:outline-none focus:border-primary transition-all"
                placeholder="Tìm kiếm câu hỏi, ma trận đề, mã đề thi..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-canvas border border-border-hairline text-xs text-text-muted">
              <span className="w-2 h-2 rounded-full bg-brand-emerald-light"></span>
              <span>
                Máy chủ Khảo thí: <strong className="text-text-heading font-semibold">Ổn định (14ms)</strong>
              </span>
            </div>

            <button
              onClick={() => setActiveMenu("questions")}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-primary hover:bg-brand-emerald-dark text-on-primary font-label-md text-xs font-semibold transition-colors border border-brand-emerald-dark cursor-pointer shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Tạo câu hỏi</span>
            </button>

            <button
              className="relative p-2 rounded-lg text-text-muted hover:bg-surface-canvas hover:text-text-heading transition-colors border border-border-hairline cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-bold">
                3
              </span>
            </button>

            <div className="h-6 w-px bg-border-hairline"></div>

            <div className="flex items-center gap-2.5 pl-1">
              <div className="flex flex-col text-right">
                <span className="font-label-md text-xs font-bold text-text-heading leading-tight">
                  {user?.name || "ThS. Nguyễn Mai Linh"}
                </span>
                <span className="font-label-sm text-[11px] text-text-muted leading-tight">
                  Tổ Sinh • THPT Chuyên LHP
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "GV"}
              </div>
              <button
                onClick={handleLogout}
                className="p-1 rounded-lg text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Đăng xuất"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Main Body */}
        <main className="w-full pt-16 bg-surface-canvas flex-1 pb-12">
          {activeMenu === "dashboard" ? (
            <TutorDashboard onNavigateToQuestions={() => setActiveMenu("questions")} />
          ) : (
            <TutorQuestionBank />
          )}
        </main>
      </div>
    </div>
  );
};

export default TutorPage;

