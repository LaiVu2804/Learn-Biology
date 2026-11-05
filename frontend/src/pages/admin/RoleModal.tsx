import React, { useState } from "react";
import { notification } from "antd";

interface RoleModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: number | string, newRole: string) => Promise<void>;
}

export const RoleModal: React.FC<RoleModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !user) return null;

  const currentRoleName = user.role?.name || user.role || "ROLE_USER";
  const [selectedRole, setSelectedRole] = useState<string>(
    currentRoleName.includes("ADMIN")
      ? "ROLE_ADMIN"
      : currentRoleName.includes("TUTOR") || currentRoleName.includes("TEACHER")
      ? "ROLE_TUTOR"
      : "ROLE_USER"
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSaveRole = async () => {
    setIsSubmitting(true);
    try {
      await onSave(user.id, selectedRole);
      notification.success({
        message: "Cập nhật phân quyền thành công",
        description: `Tài khoản ${user.name} đã được cấp vai trò ${selectedRole}.`,
      });
      onClose();
    } catch {
      notification.error({
        message: "Lỗi cập nhật",
        description: "Không thể lưu vai trò mới vào hệ thống.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-card border border-border-hairline rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-border-hairline flex items-center justify-between bg-surface-canvas/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              admin_panel_settings
            </span>
            <h3 className="font-headline-sm text-base sm:text-lg font-bold text-text-heading">
              Điều Chỉnh Vai Trò & Phân Quyền
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-heading p-1 rounded-md transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-5">
          {/* User Capsule */}
          <div className="p-3 bg-surface-canvas border border-border-hairline rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-emerald-surface text-brand-emerald-dark flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-sm font-bold text-text-heading">
                {user.name}
              </span>
              <span className="font-body-sm text-xs text-text-muted truncate">
                {user.email}
              </span>
            </div>
          </div>

          {/* Primary Role Radios */}
          <div className="flex flex-col gap-2.5">
            <label className="font-label-md text-xs font-semibold text-text-heading uppercase tracking-wider">
              Chọn vai trò chính (Primary Role):
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Student */}
              <label
                onClick={() => setSelectedRole("ROLE_USER")}
                className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                  selectedRole === "ROLE_USER"
                    ? "border-primary bg-brand-emerald-surface/40 shadow-sm"
                    : "border-border-hairline hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="role_radio"
                    checked={selectedRole === "ROLE_USER"}
                    onChange={() => setSelectedRole("ROLE_USER")}
                    className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-label-md text-sm text-text-heading font-semibold block">
                      Học viên (Student / ROLE_USER)
                    </span>
                    <span className="font-body-sm text-xs text-text-muted">
                      Luyện đề, thi thử trực tuyến, tra cứu đáp án và phả hệ
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-emerald-surface text-brand-emerald-dark">
                  Mặc định
                </span>
              </label>

              {/* Option 2: Tutor / Teacher */}
              <label
                onClick={() => setSelectedRole("ROLE_TUTOR")}
                className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                  selectedRole === "ROLE_TUTOR"
                    ? "border-primary bg-brand-emerald-surface/40 shadow-sm"
                    : "border-border-hairline hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="role_radio"
                    checked={selectedRole === "ROLE_TUTOR"}
                    onChange={() => setSelectedRole("ROLE_TUTOR")}
                    className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-label-md text-sm text-text-heading font-semibold block">
                      Giảng viên / Soạn đề (Tutor / ROLE_TUTOR)
                    </span>
                    <span className="font-body-sm text-xs text-text-muted">
                      Soạn câu hỏi Sinh học, quản lý đề thi, theo dõi phổ điểm học sinh
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                  Khảo thí
                </span>
              </label>

              {/* Option 3: SuperAdmin */}
              <label
                onClick={() => setSelectedRole("ROLE_ADMIN")}
                className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                  selectedRole === "ROLE_ADMIN"
                    ? "border-primary bg-brand-emerald-surface/40 shadow-sm"
                    : "border-border-hairline hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="role_radio"
                    checked={selectedRole === "ROLE_ADMIN"}
                    onChange={() => setSelectedRole("ROLE_ADMIN")}
                    className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-label-md text-sm text-text-heading font-semibold block">
                      Quản trị viên (SuperAdmin / ROLE_ADMIN)
                    </span>
                    <span className="font-body-sm text-xs text-text-muted">
                      Toàn quyền quản trị người dùng, phân quyền, duyệt nội dung và hệ thống
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
                  Toàn quyền
                </span>
              </label>
            </div>
          </div>

          {/* Group Topic Assignment */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-border-hairline">
            <label className="font-label-md text-xs font-semibold text-text-heading">
              Chỉ định nhóm chuyên đề phụ trách:
            </label>
            <select className="w-full bg-surface-canvas border border-border-hairline rounded-lg px-3 py-2 font-body-sm text-xs text-text-heading focus:outline-none focus:border-primary">
              <option>Lớp 12 - Ôn thi THPT Quốc Gia (Chuẩn 2025)</option>
              <option>Lớp 12 - Luyện thi Khối Y Dược Trọng Điểm</option>
              <option>Lớp 11 - Sinh học Cơ thể & Sinh lý học</option>
              <option>Đội tuyển Học sinh Giỏi Quốc gia môn Sinh</option>
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-surface-canvas/60 border-t border-border-hairline flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border-hairline rounded-lg font-label-md text-xs text-text-body hover:bg-surface-card transition-colors cursor-pointer"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSaveRole}
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary hover:bg-brand-emerald-dark text-on-primary font-label-md text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            type="button"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu phân quyền"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;

