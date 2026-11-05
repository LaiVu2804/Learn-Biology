import React from "react";

interface UserDrawerProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleLock: (user: any) => void;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onToggleLock,
}) => {
  if (!isOpen || !user) return null;

  const isBanned = user.status === "Banned" || user.isBanned || Boolean(user.locked);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-surface-card border-l border-border-hairline shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-border-hairline flex items-center justify-between bg-surface-canvas/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
            <h2 className="font-headline-sm text-base sm:text-lg font-bold text-text-heading">
              Hồ Sơ Nhanh Người Dùng
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:bg-surface-canvas hover:text-text-heading transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
          {/* Profile summary card */}
          <div className="flex items-start gap-4 pb-5 border-b border-border-hairline">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-surface-card ${
                  isBanned ? "bg-rose-500" : "bg-emerald-500"
                }`}
              ></span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-base sm:text-lg font-bold text-text-heading truncate">
                  {user.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold border ${
                    isBanned
                      ? "bg-rose-50 text-rose-600 border-rose-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {isBanned ? "Banned" : "Active"}
                </span>
              </div>
              <span className="font-mono text-xs text-primary font-semibold mt-0.5">
                {user.userId || `BIO-HV-${user.id || "10492"}`}
              </span>
              <span className="text-xs text-text-muted mt-1 truncate">
                {user.email}
              </span>
              <span className="text-xs text-text-caption mt-0.5">
                {user.address ? `Địa chỉ: ${user.address}` : (user.school || "BioPrep Learning")}
                {user.gender ? ` • Giới tính: ${user.gender === "FEMALE" ? "Nữ" : user.gender === "MALE" ? "Nam" : user.gender}` : ""}
                {user.age ? ` • Tuổi: ${user.age}` : ""}
              </span>
            </div>
          </div>

          {/* Academic Performance KPI Grid */}
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-xs text-text-caption uppercase tracking-wider font-semibold">
              Hiệu Suất Làm Bài & Khảo Sát
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-canvas border border-border-hairline rounded-lg p-3">
                <span className="font-label-sm text-xs text-text-muted">Tổng đề đã thi</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-md text-xl font-bold text-text-heading">
                    {user.tests || "148"}
                  </span>
                  <span className="text-xs text-brand-emerald-dark font-medium">bài</span>
                </div>
              </div>
              <div className="bg-surface-canvas border border-border-hairline rounded-lg p-3">
                <span className="font-label-sm text-xs text-text-muted">Điểm trung bình (ĐTB)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-md text-xl font-bold text-primary">
                    {user.avg || "9.15"}
                  </span>
                  <span className="text-xs text-text-muted">/10.0</span>
                </div>
              </div>
              <div className="bg-surface-canvas border border-border-hairline rounded-lg p-3">
                <span className="font-label-sm text-xs text-text-muted">Tỉ lệ hoàn thành</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-md text-xl font-bold text-text-heading">98.4%</span>
                  <span className="text-xs text-brand-emerald-dark font-semibold">Top 1%</span>
                </div>
              </div>
              <div className="bg-surface-canvas border border-border-hairline rounded-lg p-3">
                <span className="font-label-sm text-xs text-text-muted">Cảnh báo giám sát</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-md text-xl font-bold text-text-heading">
                    {user.violations || "0"}
                  </span>
                  <span className="text-xs text-text-muted">lần vi phạm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Breakdown */}
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-xs text-text-caption uppercase tracking-wider font-semibold">
              Đánh giá theo Chuyên đề Sinh Học
            </span>
            <div className="bg-surface-canvas border border-border-hairline rounded-lg p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-xs">
                  <span className="text-text-heading">Cơ chế Di truyền & Biến dị (Gen, ADN)</span>
                  <span className="font-semibold text-brand-emerald-dark">94%</span>
                </div>
                <div className="w-full bg-border-hairline h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-emerald-light h-full rounded-full w-[94%]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-xs">
                  <span className="text-text-heading">Sinh thái học & Môi trường</span>
                  <span className="font-semibold text-brand-emerald-dark">89%</span>
                </div>
                <div className="w-full bg-border-hairline h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-emerald-light h-full rounded-full w-[89%]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-xs">
                  <span className="text-text-heading">Quy luật Di truyền Men-đen & Phả hệ</span>
                  <span className="font-semibold text-amber-600">78%</span>
                </div>
                <div className="w-full bg-border-hairline h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-[78%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions & Platform Access */}
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-xs text-text-caption uppercase tracking-wider font-semibold">
              Quyền truy cập tài nguyên
            </span>
            <div className="border border-border-hairline rounded-lg divide-y divide-border-hairline bg-surface-card">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                  <span className="text-xs text-text-heading font-medium">Gói VIP Ôn thi ĐGNL & Y Dược</span>
                </div>
                <span className="text-[11px] text-text-caption">Hạn: 30/07/2025</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                  <span className="text-xs text-text-heading font-medium">Phòng thi Proctored Giám sát AI</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">Bình thường</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-text-muted">help</span>
                  <span className="text-xs text-text-heading font-medium">Quyền chỉnh sửa ngân hàng đề</span>
                </div>
                <span className="text-[11px] text-text-muted">Không cấp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-border-hairline bg-surface-card flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleLock(user)}
            className={`px-3 py-2 rounded-lg border font-label-md text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isBanned
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isBanned ? "lock_open" : "lock"}
            </span>
            <span>{isBanned ? "Mở khóa tài khoản" : "Khóa tài khoản"}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-lg bg-primary hover:bg-brand-emerald-dark text-on-primary font-label-md text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            <span>Xem lịch sử bài thi chi tiết</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDrawer;

