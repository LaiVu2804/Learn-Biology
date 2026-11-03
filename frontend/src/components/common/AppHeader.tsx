import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import { useAuth } from "../../context/auth.context";

interface AppHeaderProps {
  selectedGrade?: string;
  onGradeChange?: (grade: "12" | "11" | "10") => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  selectedGrade = "12",
  onGradeChange,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      notification.success({
        message: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn trong buổi học tiếp theo!",
        duration: 3,
      });
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  const currentTab = location.pathname;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-card border-b border-border-hairline shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 lg:gap-6">
        {/* Brand Logo & System info */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/home" className="flex items-center gap-2.5 group select-none">
            <img
              src="/bioprep-logo.png"
              alt="BioPrep Logo"
              className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-text-heading tracking-tight font-bold group-hover:text-primary transition-colors">
                  BioPrep
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-label-sm font-semibold uppercase tracking-wider bg-brand-emerald-surface text-brand-emerald-dark border border-outline-variant/30">
                  Edu THPT
                </span>
              </div>
              <span className="hidden sm:inline-block font-label-sm text-[11px] text-text-muted leading-none">
                Hệ thống chuyên sâu Sinh học
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Grade Filter Buttons */}
        <div className="hidden xl:flex items-center bg-surface-canvas p-1 rounded-lg border border-border-hairline">
          {(["12", "11", "10"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGradeChange && onGradeChange(g)}
              className={`px-2.5 py-1 text-xs font-label-sm rounded-md transition-all cursor-pointer ${
                selectedGrade === g
                  ? "bg-surface-card text-primary font-bold shadow-sm border border-border-hairline"
                  : "text-text-muted hover:text-text-heading"
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 h-full">
          <Link
            to="/home"
            className={`px-3 py-2 rounded-lg font-label-md text-label-md transition-colors whitespace-nowrap ${
              currentTab === "/home" || currentTab === "/dashboard"
                ? "bg-brand-emerald-surface text-brand-emerald-dark font-semibold border-b-2 border-primary"
                : "text-text-muted hover:text-text-heading hover:bg-surface-canvas"
            }`}
          >
            Cấu hình đề thi
          </Link>
          <Link
            to="/exam"
            className={`px-3 py-2 rounded-lg font-label-md text-label-md transition-colors whitespace-nowrap ${
              currentTab === "/exam"
                ? "bg-brand-emerald-surface text-brand-emerald-dark font-semibold border-b-2 border-primary"
                : "text-text-muted hover:text-text-heading hover:bg-surface-canvas"
            }`}
          >
            Phòng thi ảo
          </Link>
          <Link
            to="/"
            className="px-3 py-2 rounded-lg font-label-md text-label-md text-text-muted hover:text-text-heading hover:bg-surface-canvas transition-colors whitespace-nowrap"
          >
            Landing Page
          </Link>
        </nav>

        {/* Search, Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Quick Search Input */}
          <div className="relative hidden md:block w-44 xl:w-52">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-text-caption text-[18px]">
              search
            </span>
            <input
              type="search"
              placeholder="Tìm bài học, mã đề..."
              className="w-full pl-8 pr-3 py-1.5 bg-surface-canvas text-body font-body-sm text-body-sm rounded-lg border border-border-hairline focus:border-primary focus:outline-none transition-colors placeholder:text-text-caption"
            />
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            aria-label="Thông báo"
            onClick={() => {
              notification.info({
                message: "Thông báo học tập",
                description: "Đề Khảo sát Chuyên ĐH Sư Phạm Hà Nội 2025 (Lần 2) đã được mở tại Phòng thi ảo!",
              });
            }}
            className="relative p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-surface-canvas transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-card"></span>
          </button>

          <div className="h-6 w-px bg-border-hairline hidden sm:block"></div>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="font-label-md text-label-md text-text-heading font-semibold leading-tight">
                {user?.name || "Học viên BioPrep"}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 mt-0.5 rounded-full font-label-sm text-[10px] bg-accent-amber-surface text-tertiary font-medium border border-tertiary-fixed-dim/40">
                Mục tiêu 9.5+ Y Hà Nội
              </span>
            </div>
            <div
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold text-xs"
              title={user?.email || ""}
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "HV"}
            </div>
            <button
              onClick={handleLogout}
              title="Đăng xuất khỏi tài khoản"
              className="p-1.5 rounded-lg text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

