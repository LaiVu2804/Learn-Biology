/**
 * Module quản lý Access Token trong bộ nhớ RAM (In-Memory Storage)
 * Tuyệt đối không lưu Access Token vào localStorage/sessionStorage để phòng chống 100% tấn công XSS.
 */

// Biến private nằm trong RAM (bộ nhớ tạm của JavaScript runtime)
let inMemoryAccessToken: string | null = null;

// Quản lý bộ đếm thời gian cho cơ chế Silent Refresh chủ động
let silentRefreshTimer: any = null;

/**
 * Lấy Access Token từ bộ nhớ RAM
 */
export const getAccessToken = (): string | null => {
    return inMemoryAccessToken;
};

/**
 * Lưu Access Token vào bộ nhớ RAM
 */
export const setAccessToken = (token: string | null): void => {
    inMemoryAccessToken = token;
};

/**
 * Giải mã thời gian sống (TTL) của Access Token từ payload JWT
 * @returns Số giây còn lại trước khi token hết hạn
 */
export const getTokenRemainingSeconds = (token: string): number => {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return 0;
        const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const decodedString = decodeURIComponent(
            atob(payloadBase64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        const payload = JSON.parse(decodedString);
        if (!payload.exp) return 0;

        const currentTimeSeconds = Math.floor(Date.now() / 1000);
        const remainingSeconds = payload.exp - currentTimeSeconds;
        return remainingSeconds > 0 ? remainingSeconds : 0;
    } catch (e) {
        return 0;
    }
};

/**
 * Thiết lập cơ chế Silent Refresh chủ động (Proactive Refresh)
 * Tự động làm mới token trước khi token cũ hết hạn từ 1 đến 2 phút
 * @param token Chuỗi Access Token mới vừa nhận
 * @param onRefreshCallback Hàm gọi API làm mới token
 */
export const setupSilentRefreshTimer = (
    token: string,
    onRefreshCallback: () => Promise<any>
): void => {
    // Hủy timer cũ nếu đang chạy
    clearSilentRefreshTimer();

    const remainingSeconds = getTokenRemainingSeconds(token);
    // Dự phòng trừ hao trước khi hết hạn 90 giây (1.5 phút)
    // Nếu token còn dưới 2 phút thì kích hoạt sau 10 giây
    const bufferSeconds = 90;
    const delaySeconds = remainingSeconds > bufferSeconds ? remainingSeconds - bufferSeconds : 10;
    const delayMs = delaySeconds * 1000;

    silentRefreshTimer = setTimeout(async () => {
        try {
            await onRefreshCallback();
        } catch (error) {
            console.error("Lỗi khi tự động kích hoạt Silent Refresh:", error);
        }
    }, delayMs);
};

/**
 * Hủy bộ đếm thời gian Silent Refresh
 */
export const clearSilentRefreshTimer = (): void => {
    if (silentRefreshTimer) {
        clearTimeout(silentRefreshTimer);
        silentRefreshTimer = null;
    }
};

/**
 * Xóa sạch toàn bộ phiên đăng nhập trong bộ nhớ RAM
 */
export const clearAuthMemory = (): void => {
    inMemoryAccessToken = null;
    clearSilentRefreshTimer();
};

