export {};

declare global {
    /**
     * Interface Generic chuẩn hóa phản hồi từ Backend Spring Boot
     * Tương ứng với class RestResponse<T> ở Backend:
     * {
     *   statusCode: number;
     *   error?: string;
     *   message: string | string[];
     *   data?: T;
     * }
     */
    interface IBackendRes<T> {
        statusCode: number | string;
        error?: string;
        message: string | string[];
        data?: T;
    }

    /**
     * Generic phân trang (Pagination)
     */
    interface IModelPaginate<T> {
        meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: T[];
    }

    /**
     * Thông tin User trong Token & Session
     */
    interface IUser {
        id: number | string;
        email: string;
        name: string;
        role?: {
            id?: number | string;
            name?: string;
        } | string | null;
        age?: number;
        gender?: "MALE" | "FEMALE" | "OTHER" | string;
        address?: string;
    }

    /**
     * Cục User được trả về trong Login Response
     */
    interface IUserLogin {
        id: number;
        email: string;
        name: string;
        role?: {
            id?: number;
            name?: string;
        } | string | null;
    }

    /**
     * Dữ liệu trả về khi gọi POST /api/v1/auth/login
     */
    interface ILoginResponse {
        access_token: string;
        user: IUserLogin;
    }

    /**
     * Dữ liệu gửi lên khi đăng ký tài khoản mới (POST /api/v1/auth/register)
     */
    interface IRegisterReq {
        name: string;
        email: string;
        password: string;
        age?: number;
        gender?: "MALE" | "FEMALE" | "OTHER" | string;
        address?: string;
    }

    /**
     * Dữ liệu nhận về sau khi đăng ký (ResCreateUserDTO)
     */
    interface IRegisterRes {
        id: number;
        name: string;
        email: string;
        age?: number;
        gender?: string;
        address?: string;
        createdAt?: string;
    }

    /**
     * Dữ liệu trả về khi fetch thông tin tài khoản hiện tại (/api/v1/auth/account)
     */
    interface IGetAccount {
        user: IUserLogin;
    }
}

