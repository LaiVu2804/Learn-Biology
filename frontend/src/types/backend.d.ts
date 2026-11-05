export {};

declare global {
    /**
     * Interface Generic chuẩn hóa phản hồi từ Backend Spring Boot
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
     * Quyền hạn cụ thể (Permission)
     */
    interface IPermission {
        id: number;
        name: string;
        apiPath: string;
        method: string;
        module: string;
        createdAt?: string;
        updatedAt?: string;
    }

    /**
     * Vai trò hệ thống (Role)
     */
    interface IRole {
        id: number;
        name: string;
        description?: string;
        active?: boolean;
        permissions?: (string | IPermission)[];
        createdAt?: string;
        updatedAt?: string;
    }

    /**
     * Thông tin User trong Token & Session
     */
    interface IUser {
        id: number | string;
        email: string;
        name: string;
        role?: IRole | { id?: number | string; name?: string } | string | null;
        age?: number;
        gender?: "MALE" | "FEMALE" | "OTHER" | string;
        address?: string;
        locked?: boolean;
        createdAt?: string;
        updatedAt?: string;
    }

    /**
     * Cục User được trả về trong Login Response
     */
    interface IUserLogin {
        id: number;
        email: string;
        name: string;
        role?: IRole | { id?: number; name?: string; permissions?: string[] } | string | null;
        locked?: boolean;
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

    /**
     * Dữ liệu Thống kê Admin Toàn Sàn
     */
    interface IAdminOverview {
        totalUsers: number;
        todayNewUsers: number;
        monthlyUserGrowth: string;
        studentCount: number;
        tutorCount: number;
        adminCount: number;
        totalExamsTaken: number;
        todayExamsTaken: number;
        weeklyExamsTaken: number;
        averageScore: number;
        pendingExams: number;
        pendingOutlines: number;
        infrastructure: {
            status: string;
            pingMs: number;
            cpuUsage: string;
            ramUsage: string;
            redisUsage: string;
            kubernetesPods: string;
            postgresConn: string;
            s3Storage: string;
        };
        topicDistribution: Array<{
            name: string;
            percentage: number;
            color: string;
        }>;
        cognitiveMastery: {
            nhanBiet: number;
            thongHieu: number;
            vanDung: number;
            vanDungCao: number;
        };
        technicalLogs: Array<{
            level: "ERROR" | "WARN" | "INFO";
            code: string;
            desc: string;
            module: string;
            time: string;
        }>;
    }

    /**
     * Dữ liệu Thống kê Giảng viên Cá nhân
     */
    interface ITutorOverview {
        tutorName: string;
        tutorTitle: string;
        contributedExams: number;
        contributedExamsGrowth: string;
        officialExams: number;
        backupExams: number;
        questionBankTotal: number;
        questionApproved: number;
        questionActive: number;
        questionDraft: number;
        studentAttempts: number;
        weeklyAttempts: string;
        coverageSchools: string;
        ratingScore: number;
        ratingFeedbackCount: number;
        averageExamScore: number;
        highScorePercentage: number;
        scoreHistogram: Array<{
            range: string;
            percentage: number;
        }>;
        cognitiveDistribution: Array<{
            level: string;
            count: number;
            percentage: number;
        }>;
        aiInsight: string;
        featuredExams: Array<{
            code: string;
            title: string;
            tag: string;
            questions: number;
            attempts: number;
            avgScore: number;
            hardCorrectRate: string;
            status: string;
        }>;
    }

    /**
     * Câu hỏi trong Ngân hàng đề
     */
    interface ITutorQuestion {
        id: string;
        topic: string;
        subTopic: string;
        level: string;
        content: string;
        status: string;
        author: string;
        usedInExams: number;
        correctRate: string;
    }
}
