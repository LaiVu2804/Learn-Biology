import axios from "../config/axios-customize";

/**
 * Gọi API Đăng nhập
 * Endpoint: POST /api/v1/auth/login
 */
export const callLogin = (username: string, password: string): Promise<IBackendRes<ILoginResponse>> => {
    return axios.post<any, IBackendRes<ILoginResponse>>("/api/v1/auth/login", {
        username,
        password,
    });
};

/**
 * Gọi API Đăng ký tài khoản
 * Endpoint: POST /api/v1/auth/register
 */
export const callRegister = (data: IRegisterReq): Promise<IBackendRes<IRegisterRes>> => {
    return axios.post<any, IBackendRes<IRegisterRes>>("/api/v1/auth/register", data);
};

/**
 * Gọi API Đăng xuất (Logout)
 * Endpoint: POST /api/v1/auth/logout
 */
export const callLogout = (): Promise<IBackendRes<null>> => {
    return axios.post<any, IBackendRes<null>>("/api/v1/auth/logout");
};

/**
 * Gọi API Refresh Token
 * Endpoint: POST /api/v1/auth/refresh
 */
let refreshTokenPromise: Promise<IBackendRes<ILoginResponse>> | null = null;

export const callRefreshToken = (): Promise<IBackendRes<ILoginResponse>> => {
    if (refreshTokenPromise) {
        return refreshTokenPromise;
    }
    refreshTokenPromise = axios
        .post<any, IBackendRes<ILoginResponse>>("/api/v1/auth/refresh")
        .finally(() => {
            refreshTokenPromise = null;
        });
    return refreshTokenPromise;
};

/**
 * Lấy thông tin tài khoản hiện tại từ Session/Token
 * Endpoint: GET /api/v1/auth/account
 */
export const callFetchAccount = (): Promise<IBackendRes<IGetAccount>> => {
    return axios.get<any, IBackendRes<IGetAccount>>("/api/v1/auth/account");
};

/**
 * Lấy thông tin chi tiết một User theo ID
 * Endpoint: GET /api/v1/users/{id}
 */
export const callFetchUserById = (id: number | string): Promise<IBackendRes<IUser>> => {
    return axios.get<any, IBackendRes<IUser>>(`/api/v1/users/${id}`);
};

/**
 * Lấy danh sách người dùng có phân trang
 * Endpoint: GET /api/v1/users
 */
export const callFetchUsers = (query: string = ""): Promise<IBackendRes<IModelPaginate<IUser>>> => {
    return axios.get<any, IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
};

/**
 * Cập nhật vai trò người dùng (Admin)
 * Endpoint: PUT /api/v1/users/{id}/role
 */
export const callUpdateUserRole = (userId: number | string, roleId: number | string): Promise<IBackendRes<IUser>> => {
    return axios.put<any, IBackendRes<IUser>>(`/api/v1/users/${userId}/role`, { roleId });
};

/**
 * Khóa hoặc Mở khóa tài khoản người dùng (Admin)
 * Endpoint: PUT /api/v1/users/{id}/lock
 */
export const callUpdateUserLock = (userId: number | string, locked?: boolean): Promise<IBackendRes<IUser>> => {
    return axios.put<any, IBackendRes<IUser>>(`/api/v1/users/${userId}/lock`, { locked });
};

/**
 * Xóa người dùng (Admin)
 * Endpoint: DELETE /api/v1/users/{id}
 */
export const callDeleteUser = (id: number | string): Promise<IBackendRes<null>> => {
    return axios.delete<any, IBackendRes<null>>(`/api/v1/users/${id}`);
};

/**
 * Lấy danh sách vai trò (Roles)
 * Endpoint: GET /api/v1/roles/all
 */
export const callFetchRoles = (): Promise<IBackendRes<IRole[]>> => {
    return axios.get<any, IBackendRes<IRole[]>>("/api/v1/roles/all");
};

/**
 * Lấy danh sách quyền hạn (Permissions)
 * Endpoint: GET /api/v1/permissions/all
 */
export const callFetchPermissions = (): Promise<IBackendRes<IPermission[]>> => {
    return axios.get<any, IBackendRes<IPermission[]>>("/api/v1/permissions/all");
};

/**
 * Tạo vai trò mới
 * Endpoint: POST /api/v1/roles
 */
export const callCreateRole = (role: Partial<IRole>): Promise<IBackendRes<IRole>> => {
    return axios.post<any, IBackendRes<IRole>>("/api/v1/roles", role);
};

/**
 * Cập nhật vai trò
 * Endpoint: PUT /api/v1/roles
 */
export const callUpdateRole = (role: Partial<IRole>): Promise<IBackendRes<IRole>> => {
    return axios.put<any, IBackendRes<IRole>>("/api/v1/roles", role);
};
