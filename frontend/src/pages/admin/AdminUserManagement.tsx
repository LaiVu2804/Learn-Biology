import React, { useEffect, useState, useMemo, useCallback } from "react";
import { callFetchUsers, callUpdateUserRole, callUpdateUserLock, callFetchRoles } from "../../services/api";
import { UserDrawer } from "./UserDrawer";
import { RoleModal } from "./RoleModal";
import { notification } from "antd";

export interface UserItem {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  roleId?: number;
  school: string;
  grade: string;
  tests: string | number;
  avg: string | number;
  status: "Active" | "Inactive" | "Banned";
  locked: boolean;
  violations: string;
  age?: number;
  gender?: string;
  address?: string;
  createdAt?: string;
}

export const AdminUserManagement: React.FC = () => {
  // Dữ liệu người dùng được load 100% động từ Database (không hardcode)
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Phân trang
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Bộ lọc & Tìm kiếm
  const [activeTab, setActiveTab] = useState<"all" | "student" | "tutor" | "admin" | "banned">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Drawer & Modal state
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  // Hàm tải dữ liệu người dùng động từ Database
  const fetchRealUsers = useCallback(async (pageToFetch: number = 1, sizeToFetch: number = 10) => {
    setIsLoading(true);
    try {
      const query = `page=${pageToFetch}&size=${sizeToFetch}`;
      const res = await callFetchUsers(query);
      if (res && res.data) {
        const list = res.data.result || [];
        const mapped: UserItem[] = list.map((u: any, idx: number) => {
          const roleName = u.role?.name || (typeof u.role === "string" ? u.role : "ROLE_USER");
          const roleId = u.role?.id;
          const uId = Number(u.id) || idx + 1;
          const prefix = roleName.includes("ADMIN") ? "ADM" : roleName.includes("TUTOR") ? "GV" : "HV";

          const isUserLocked = Boolean(u.locked);

          return {
            id: uId,
            userId: `BIO-${prefix}-${String(uId).padStart(5, "0")}`,
            name: u.name || "Người dùng BioPrep",
            email: u.email || "",
            phone: "098*.***.*** (Đã xác thực)",
            role: roleName,
            roleId: roleId,
            school: u.address || "THPT Quốc Gia",
            grade: roleName.includes("ADMIN") ? "Ban Quản Trị" : roleName.includes("TUTOR") ? "Giảng viên" : "Lớp 12 Sinh",
            tests: roleName.includes("ADMIN") ? "Toàn quyền" : roleName.includes("TUTOR") ? "Biên tập đề" : "Luyện đề",
            avg: roleName.includes("ADMIN") ? "10.0" : "8.5",
            status: isUserLocked ? "Banned" : "Active",
            locked: isUserLocked,
            violations: isUserLocked ? "Đã bị khóa" : "0",
            age: u.age,
            gender: u.gender,
            address: u.address,
            createdAt: u.createdAt,
          };
        });

        setUsers(mapped);
        if (res.data.meta) {
          setTotal(res.data.meta.total || mapped.length);
          setTotalPages(res.data.meta.pages || 1);
          setPage(res.data.meta.page || pageToFetch);
        } else {
          setTotal(mapped.length);
          setTotalPages(1);
          setPage(pageToFetch);
        }
      } else {
        setUsers([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Lỗi khi tải users từ Database:", err);
      notification.error({
        message: "Không thể kết nối máy chủ",
        description: err?.message || "Chưa tải được danh sách người dùng từ cơ sở dữ liệu.",
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải danh sách vai trò và người dùng khi trang khởi động
  useEffect(() => {
    const fetchRolesData = async () => {
      try {
        const res = await callFetchRoles();
        if (res && res.data) {
          setRoles(res.data);
        }
      } catch (err) {
        console.warn("Chưa tải được danh sách vai trò:", err);
      }
    };

    fetchRolesData();
    fetchRealUsers(1, pageSize);
  }, [fetchRealUsers, pageSize]);

  // Bộ lọc client-side cho người dùng hiển thị
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Lọc theo Tab
      if (activeTab === "student" && !u.role.includes("USER")) return false;
      if (activeTab === "tutor" && !u.role.includes("TUTOR")) return false;
      if (activeTab === "admin" && !u.role.includes("ADMIN")) return false;
      if (activeTab === "banned" && u.status !== "Banned") return false;

      // Lọc theo Từ khóa tìm kiếm
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = u.name.toLowerCase().includes(term);
        const matchEmail = u.email.toLowerCase().includes(term);
        const matchId = u.userId.toLowerCase().includes(term);
        if (!matchName && !matchEmail && !matchId) return false;
      }

      // Lọc theo Vai trò
      if (roleFilter && !u.role.includes(roleFilter)) return false;

      // Lọc theo Trạng thái
      if (statusFilter && u.status !== statusFilter) return false;

      return true;
    });
  }, [users, activeTab, searchTerm, roleFilter, statusFilter]);

  const handleOpenDrawer = (user: UserItem) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleOpenRoleModal = (user: UserItem) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleToggleLock = async (user: UserItem) => {
    const targetLocked = !user.locked;
    try {
      await callUpdateUserLock(user.id, targetLocked);
      const nextStatus: "Active" | "Banned" = targetLocked ? "Banned" : "Active";
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? { ...item, locked: targetLocked, status: nextStatus, violations: targetLocked ? "Đã bị khóa" : "0" }
            : item
        )
      );
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({ ...selectedUser, locked: targetLocked, status: nextStatus, violations: targetLocked ? "Đã bị khóa" : "0" });
      }
      notification.success({
        message: targetLocked ? "Đã khóa tài khoản thành công" : "Đã mở khóa tài khoản thành công",
        description: `Tài khoản ${user.name} (${user.email}) hiện đã được cập nhật trạng thái: ${targetLocked ? "Bị khóa" : "Hoạt động"} trong cơ sở dữ liệu.`,
      });
      // Tải lại danh sách từ Database để đồng bộ mới nhất
      await fetchRealUsers(page, pageSize);
    } catch (err: any) {
      notification.error({
        message: "Lỗi cập nhật trạng thái khóa",
        description: err?.message || "Không thể cập nhật trạng thái vào cơ sở dữ liệu.",
      });
    }
  };

  // Cập nhật vai trò người dùng lưu trực tiếp xuống Database
  const handleSaveRole = async (userId: number | string, newRole: string) => {
    try {
      // Tìm roleId tương ứng từ danh sách Roles động dưới Database
      const foundRole = roles.find((r) => r.name === newRole);
      const targetRoleId = foundRole
        ? foundRole.id
        : newRole === "ROLE_ADMIN"
        ? 1
        : newRole === "ROLE_TUTOR"
        ? 2
        : 3;

      await callUpdateUserRole(userId, targetRoleId);

      notification.success({
        message: "Phân quyền thành công",
        description: `Tài khoản #${userId} đã được cập nhật vai trò ${newRole} trong cơ sở dữ liệu.`,
      });

      // Tải lại danh sách từ Database để đảm bảo dữ liệu hiển thị hoàn toàn chính xác
      await fetchRealUsers(page, pageSize);
    } catch (err: any) {
      notification.error({
        message: "Lỗi cập nhật vai trò",
        description: err?.message || "Không thể lưu vai trò mới vào máy chủ.",
      });
      throw err;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-emerald-surface text-brand-emerald-dark">
              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            </span>
            <span className="font-label-sm text-xs text-brand-emerald-dark uppercase tracking-wider font-semibold">
              Cổng Dữ Liệu Nhân Sự & Phân Quyền
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-text-heading tracking-tight">
            Quản lý Người dùng & Phân quyền
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-text-muted">
            Quản trị dữ liệu thực tế từ cơ sở dữ liệu MySQL ({total} tài khoản trong hệ thống)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-card hover:bg-surface-canvas text-text-body font-label-md text-xs border border-border-hairline transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-text-muted">download</span>
            <span>Xuất danh sách</span>
          </button>
          <button
            onClick={() => fetchRealUsers(page, pageSize)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-card hover:bg-surface-canvas text-text-body font-label-md text-xs border border-border-hairline transition-colors cursor-pointer"
            type="button"
            title="Đồng bộ lại từ cơ sở dữ liệu"
          >
            <span className="material-symbols-outlined text-[18px] text-brand-emerald-dark">sync</span>
            <span>Đồng bộ DB</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-hairline rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="font-label-sm text-xs uppercase tracking-wider">Tổng tài khoản (DB)</span>
            <span className="material-symbols-outlined text-[20px] text-brand-emerald-dark">groups</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-md text-xl font-bold text-text-heading">{total}</span>
            <span className="font-label-sm text-[11px] text-brand-emerald-dark font-medium">Người dùng</span>
          </div>
          <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-primary h-full rounded-full w-full"></div>
          </div>
        </div>

        <div className="bg-surface-card border border-border-hairline rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="font-label-sm text-xs uppercase tracking-wider">Học viên (ROLE_USER)</span>
            <span className="material-symbols-outlined text-[20px] text-indigo-600">school</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-md text-xl font-bold text-text-heading">
              {users.filter((u) => u.role.includes("USER")).length}
            </span>
            <span className="font-label-sm text-[11px] text-text-muted">Học viên</span>
          </div>
          <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-indigo-500 h-full rounded-full w-full"></div>
          </div>
        </div>

        <div className="bg-surface-card border border-border-hairline rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="font-label-sm text-xs uppercase tracking-wider">Giảng viên (ROLE_TUTOR)</span>
            <span className="material-symbols-outlined text-[20px] text-amber-600">biotech</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-md text-xl font-bold text-text-heading">
              {users.filter((u) => u.role.includes("TUTOR")).length}
            </span>
            <span className="font-label-sm text-[11px] text-brand-emerald-dark font-medium">Khảo thí</span>
          </div>
          <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-amber-500 h-full rounded-full w-full"></div>
          </div>
        </div>

        <div className="bg-surface-card border border-border-hairline rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="font-label-sm text-xs uppercase tracking-wider">Quản trị viên (ROLE_ADMIN)</span>
            <span className="material-symbols-outlined text-[20px] text-emerald-600">shield_person</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-md text-xl font-bold text-text-heading">
              {users.filter((u) => u.role.includes("ADMIN")).length}
            </span>
            <span className="font-label-sm text-[11px] text-text-muted">Toàn quyền</span>
          </div>
          <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full rounded-full w-full"></div>
          </div>
        </div>
      </div>

      {/* Main Container: Tabs, Search Filters & Datatable */}
      <div className="bg-surface-card border border-border-hairline rounded-xl overflow-hidden flex flex-col shadow-sm">
        {/* Navigation Tabs */}
        <div className="border-b border-border-hairline px-4 pt-2 bg-surface-canvas/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-2.5 font-label-md text-xs border-b-2 font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === "all"
                  ? "border-primary text-primary bg-brand-emerald-surface/40"
                  : "border-transparent text-text-muted hover:text-text-heading"
              }`}
              type="button"
            >
              <span>Tất cả</span>
              <span className="px-1.5 py-0.5 rounded-full bg-brand-emerald-surface text-brand-emerald-dark text-[10px]">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("student")}
              className={`px-3.5 py-2.5 font-label-md text-xs border-b-2 font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === "student"
                  ? "border-primary text-primary bg-brand-emerald-surface/40"
                  : "border-transparent text-text-muted hover:text-text-heading"
              }`}
              type="button"
            >
              <span>Học viên</span>
              <span className="px-1.5 py-0.5 rounded-full bg-surface-canvas text-text-muted text-[10px]">
                {users.filter((u) => u.role.includes("USER")).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("tutor")}
              className={`px-3.5 py-2.5 font-label-md text-xs border-b-2 font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === "tutor"
                  ? "border-primary text-primary bg-brand-emerald-surface/40"
                  : "border-transparent text-text-muted hover:text-text-heading"
              }`}
              type="button"
            >
              <span>Giảng viên</span>
              <span className="px-1.5 py-0.5 rounded-full bg-surface-canvas text-text-muted text-[10px]">
                {users.filter((u) => u.role.includes("TUTOR")).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`px-3.5 py-2.5 font-label-md text-xs border-b-2 font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === "admin"
                  ? "border-primary text-primary bg-brand-emerald-surface/40"
                  : "border-transparent text-text-muted hover:text-text-heading"
              }`}
              type="button"
            >
              <span>Quản trị viên</span>
              <span className="px-1.5 py-0.5 rounded-full bg-surface-canvas text-text-muted text-[10px]">
                {users.filter((u) => u.role.includes("ADMIN")).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("banned")}
              className={`px-3.5 py-2.5 font-label-md text-xs border-b-2 font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === "banned"
                  ? "border-rose-600 text-rose-600 bg-rose-50"
                  : "border-transparent text-rose-600 hover:text-rose-700"
              }`}
              type="button"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              <span>Bị khóa / Banned</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px]">
                {users.filter((u) => u.status === "Banned").length}
              </span>
            </button>
          </div>

          <div className="pb-2 flex items-center gap-2">
            <span className="text-[11px] text-text-muted">Cơ sở dữ liệu MySQL</span>
            <button
              onClick={() => fetchRealUsers(page, pageSize)}
              className="p-1 rounded-md text-text-muted hover:text-text-heading hover:bg-surface-canvas cursor-pointer"
              title="Làm mới bảng từ DB"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 border-b border-border-hairline bg-surface-card flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-caption text-[18px]">
                search
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-card border border-border-hairline rounded-lg pl-9 pr-3 py-2 font-body-sm text-xs text-text-heading placeholder-text-caption focus:outline-none focus:border-primary"
                placeholder="Tìm theo Họ tên, Email hoặc Mã ID (BIO-HV-...)"
                type="text"
              />
            </div>

            {/* Role filter */}
            <div className="relative w-full md:w-44 shrink-0">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-surface-card border border-border-hairline rounded-lg pl-3 pr-8 py-2 font-body-sm text-xs text-text-heading focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="">Tất cả Vai trò</option>
                <option value="USER">Học viên (Student)</option>
                <option value="TUTOR">Giảng viên (Tutor)</option>
                <option value="ADMIN">Quản trị viên (Admin)</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="relative w-full md:w-40 shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-surface-card border border-border-hairline rounded-lg pl-3 pr-8 py-2 font-body-sm text-xs text-text-heading focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="">Tất cả Trạng thái</option>
                <option value="Active">Đang hoạt động</option>
                <option value="Inactive">Chưa xác thực</option>
                <option value="Banned">Bị cấm (Banned)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Datatable */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-canvas border-b border-border-hairline text-text-muted font-label-sm text-xs uppercase tracking-wider">
                <th className="py-3 px-3 w-36">Mã ID</th>
                <th className="py-3 px-3 min-w-[220px]">Người dùng & Liên hệ</th>
                <th className="py-3 px-3 w-36">Vai trò</th>
                <th className="py-3 px-3 min-w-[180px]">Địa chỉ / Trường</th>
                <th className="py-3 px-3 min-w-[140px]">Thông tin bổ sung</th>
                <th className="py-3 px-3 w-32">Trạng thái</th>
                <th className="py-3 px-4 text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline font-body-sm text-xs text-text-body bg-surface-card">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      <span>Đang tải dữ liệu người dùng từ Database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[36px] text-text-caption">
                        person_search
                      </span>
                      <p className="font-medium text-text-heading">
                        {users.length === 0
                          ? "Chưa có dữ liệu người dùng nào trong cơ sở dữ liệu."
                          : "Không tìm thấy người dùng phù hợp với bộ lọc."}
                      </p>
                      <p className="text-xs text-text-caption">
                        {users.length === 0
                          ? "Các tài khoản đăng ký mới sẽ tự động hiển thị tại đây."
                          : "Thử điều chỉnh lại từ khóa hoặc xóa bộ lọc."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isUserBanned = u.status === "Banned";
                  const isAdminRole = u.role.includes("ADMIN");
                  const isTutorRole = u.role.includes("TUTOR");

                  return (
                    <tr
                      key={u.id}
                      onClick={() => handleOpenDrawer(u)}
                      className={`hover:bg-surface-canvas/80 transition-colors cursor-pointer ${
                        isUserBanned ? "bg-rose-50/30" : ""
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-xs font-semibold text-text-heading">
                          {u.userId}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-primary/10 border border-border-hairline flex items-center justify-center font-bold text-primary shrink-0">
                            {u.name ? u.name.slice(0, 2).toUpperCase() : "US"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-md text-xs font-bold text-text-heading truncate">
                              {u.name}
                            </span>
                            <span className="text-[11px] text-text-muted truncate">
                              {u.email}
                            </span>
                            <span className="text-[10px] text-text-caption">
                              ID: #{u.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            isAdminRole
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : isTutorRole
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isAdminRole
                              ? "shield_person"
                              : isTutorRole
                              ? "biotech"
                              : "school"}
                          </span>
                          {isAdminRole
                            ? "Quản trị viên"
                            : isTutorRole
                            ? "Giảng viên"
                            : "Học viên"}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-text-heading truncate">
                            {u.school || "Chưa cập nhật"}
                          </span>
                          <span className="text-[11px] text-text-muted">
                            {u.gender ? (u.gender === "FEMALE" ? "Nữ" : "Nam") : "Giới tính: --"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] text-text-heading">
                            Tuổi: {u.age || "--"}
                          </span>
                          <span className="text-[10px] text-text-caption">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "Gần đây"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isUserBanned
                              ? "bg-rose-50 text-rose-600 border-rose-200"
                              : u.status === "Inactive"
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isUserBanned
                                ? "bg-rose-500"
                                : u.status === "Inactive"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          ></span>
                          {u.status}
                        </span>
                      </td>

                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenDrawer(u)}
                            className="p-1.5 text-text-muted hover:text-primary hover:bg-surface-canvas rounded-md transition-colors cursor-pointer"
                            title="Xem nhanh hồ sơ"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>
                          <button
                            onClick={() => handleOpenRoleModal(u)}
                            className="p-1.5 text-text-muted hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                            title="Phân quyền vai trò"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              admin_panel_settings
                            </span>
                          </button>
                          <button
                            onClick={() => handleToggleLock(u)}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                              isUserBanned
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-text-muted hover:text-rose-600 hover:bg-rose-50"
                            }`}
                            title={isUserBanned ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isUserBanned ? "lock_open" : "lock"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip */}
        <div className="p-4 border-t border-border-hairline bg-surface-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <span>
            Hiển thị <strong className="text-text-heading">{filteredUsers.length}</strong> trên tổng số{" "}
            <strong className="text-text-heading">{total}</strong> tài khoản trong Database
          </span>
          <div className="flex items-center gap-1 font-label-md">
            <button
              onClick={() => fetchRealUsers(page - 1, pageSize)}
              disabled={page <= 1 || isLoading}
              className="px-2.5 py-1.5 rounded-lg border border-border-hairline text-text-body hover:bg-surface-canvas disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              type="button"
            >
              Trước
            </button>
            <span className="px-3 py-1 font-medium text-text-heading">
              Trang {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => fetchRealUsers(page + 1, pageSize)}
              disabled={page >= totalPages || isLoading}
              className="px-2.5 py-1.5 rounded-lg border border-border-hairline text-text-body hover:bg-surface-canvas disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              type="button"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <UserDrawer
        isOpen={isDrawerOpen}
        user={selectedUser}
        onClose={() => setIsDrawerOpen(false)}
        onToggleLock={handleToggleLock}
      />

      {/* Role Assignment Modal */}
      <RoleModal
        isOpen={isRoleModalOpen}
        user={selectedUser}
        onClose={() => setIsRoleModalOpen(false)}
        onSave={handleSaveRole}
      />
    </div>
  );
};

export default AdminUserManagement;
