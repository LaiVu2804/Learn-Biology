import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import AdminDashboard from "./AdminDashboard";
import AdminUserManagement from "./AdminUserManagement";
import { notification } from "antd";

export const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "users">("dashboard");

  const handleLogout = async () => {
    try {
      await logout();
      notification.success({ message: "Đã đăng xuất khỏi cổng Admin" });
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-body font-body-md antialiased flex">
      {/* ASIDE / SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-card border-r border-border-hairline z-50 flex flex-col justify-between overflow-y-auto select-none">
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-4 border-b border-border-hairline flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-2.5 min-w-0">
              <img
                src="/bioprep-logo.png"
                alt="BioPrep Logo"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-base font-bold text-text-heading tracking-tight truncate">
                  BioPrep
                </span>
                <span className="font-label-sm text-[10px] text-text-caption uppercase tracking-wider font-semibold">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* System Live Status */}
          <div className="px-4 py-2 border-b border-border-subtle bg-surface-canvas">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-emerald-light inline-block"></span>
                <span className="font-label-sm text-xs font-semibold text-brand-emerald-dark">
                  Live - Stable
                </span>
              </div>
              <span className="font-label-sm text-[11px] text-text-muted">99.98%</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="px-4 pt-4 pb-2">
            <span className="font-label-sm text-[11px] text-text-caption uppercase tracking-wider font-semibold">
              Menu Quản Trị
            </span>
          </div>

          <nav className="px-2 flex flex-col gap-1">
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left w-full cursor-pointer ${activeMenu === "dashboard"
                ? "bg-brand-emerald-surface text-brand-emerald-dark font-semibold border-l-4 border-primary"
                : "text-text-body hover:bg-surface-canvas hover:text-text-heading"
                }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-text-muted">
                dashboard
              </span>
              <span className="font-label-md text-xs truncate">Tổng quan & Dashboard</span>
            </button>

            <button
              onClick={() => setActiveMenu("users")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left w-full cursor-pointer ${activeMenu === "users"
                ? "bg-brand-emerald-surface text-brand-emerald-dark font-semibold border-l-4 border-primary"
                : "text-text-body hover:bg-surface-canvas hover:text-text-heading"
                }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-text-muted">
                group
              </span>
              <span className="font-label-md text-xs truncate">Quản lý người dùng</span>
            </button>

            <Link
              to="/tutor"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-text-body hover:bg-surface-canvas hover:text-text-heading"
            >
              <span className="material-symbols-outlined text-[20px] text-text-muted">
                biotech
              </span>
              <span className="font-label-md text-xs truncate">Cổng Giảng viên (Tutor)</span>
            </Link>

            <Link
              to="/home"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-text-body hover:bg-surface-canvas hover:text-text-heading"
            >
              <span className="material-symbols-outlined text-[20px] text-text-muted">
                menu_book
              </span>
              <span className="font-label-md text-xs truncate">Luyện thi Sinh học</span>
            </Link>
          </nav>
        </div>

        {/* Server Status & User Capsule */}
        <div className="flex flex-col border-t border-border-hairline p-3 gap-3 bg-surface-card">
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs font-semibold text-text-heading truncate">
                  {user?.name}
                </span>
                <span className="font-label-sm text-[10px] text-amber-600 font-semibold uppercase tracking-wider">
                  SuperAdmin
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Đăng xuất"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-surface-card/95 backdrop-blur border-b border-border-hairline z-40 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="flex items-center gap-1.5 text-xs text-text-muted shrink-0">
              <span className="text-text-caption">Admin Portal</span>
              <span>/</span>
              <span className="text-text-heading font-medium">
                {activeMenu === "dashboard" ? "Dashboard & Toàn Sàn" : "Quản lý Người Dùng"}
              </span>
            </div>

            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-caption text-[18px]">
                search
              </span>
              <input
                className="w-full bg-surface-card border border-border-hairline rounded-lg pl-9 pr-3 py-1.5 text-xs text-text-heading placeholder-text-caption focus:outline-none focus:border-primary"
                placeholder="Tìm kiếm người dùng, đề thi, chuyên đề Sinh học..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 bg-brand-emerald-surface border border-outline-variant/30 px-3 py-1 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-brand-emerald-light"></span>
              <span className="font-label-sm text-brand-emerald-dark font-semibold">
                Hệ thống: Bình thường
              </span>
            </div>

            <button
              onClick={() => {
                notification.info({
                  message: "Tạo thông báo toàn trường",
                  description: "Hệ thống sẽ gửi push notification tới tất cả thí sinh làm bài thi trực tuyến.",
                });
              }}
              className="flex items-center gap-1 bg-primary hover:bg-brand-emerald-dark text-on-primary px-3 py-1.5 rounded-lg font-label-md text-xs font-semibold transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Tạo thông báo</span>
            </button>

            <div className="relative">
              <button
                className="relative p-2 rounded-lg text-text-muted hover:bg-surface-canvas hover:text-text-heading transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  5
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Main Body */}
        <main className="w-full pt-16 bg-surface-canvas flex-1 pb-12">
          {activeMenu === "dashboard" ? <AdminDashboard /> : <AdminUserManagement />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;

