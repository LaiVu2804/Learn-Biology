package com.example.demo.service;

/**
 * Service quản lý vòng đời Refresh Token và Blacklist Access Token trên Redis.
 * Cấu trúc Key đa thiết bị chuẩn: auth:rt:{email}:{jti}
 * Giúp mỗi thiết bị (Điện thoại, Laptop, Tablet...) duy trì phiên độc lập,
 * không ghi đè và không làm văng phiên của nhau khi cùng đăng nhập một tài khoản.
 */
public interface TokenRedisService {

    /**
     * Lưu trữ Refresh Token vào Redis với thời hạn sống (TTL)
     * Key được định danh theo: auth:rt:{email}:{jti}
     *
     * @param email         Email/Username của người dùng
     * @param jti           Định danh JWT ID của Refresh Token
     * @param refreshToken  Chuỗi Refresh Token JWT
     * @param expirySeconds Thời gian hiệu lực tính bằng giây
     */
    void saveRefreshToken(String email, String jti, String refreshToken, long expirySeconds);

    /**
     * Overload lưu Refresh Token tự động trích xuất JTI từ token
     *
     * @param email         Email/Username của người dùng
     * @param refreshToken  Chuỗi Refresh Token JWT
     * @param expirySeconds Thời gian hiệu lực tính bằng giây
     */
    void saveRefreshToken(String email, String refreshToken, long expirySeconds);

    /**
     * Kiểm tra Refresh Token có thực sự hợp lệ và đang tồn tại trong Redis hay không.
     * Key kiểm tra: auth:rt:{email}:{jti}
     * Ngăn chặn 100% việc dùng lại token đã logout/hết hạn.
     *
     * @param email        Email/Username của người dùng
     * @param jti          Định danh JWT ID của token (nếu null sẽ tự trích xuất từ token)
     * @param refreshToken Chuỗi Refresh Token gửi lên
     * @return true nếu token tồn tại và trùng khớp trong Redis, false nếu đã bị hủy/hết hạn
     */
    boolean isRefreshTokenValid(String email, String jti, String refreshToken);

    /**
     * Xóa Refresh Token của một phiên/thiết bị cụ thể khỏi Redis (khi Logout thiết bị đó).
     * Chỉ xóa key auth:rt:{email}:{jti} của thiết bị hiện tại, không làm ảnh hưởng các thiết bị khác.
     *
     * @param email Email của người dùng
     * @param jti   Định danh duy nhất của token trên thiết bị
     */
    void deleteRefreshToken(String email, String jti);

    /**
     * Xóa toàn bộ Refresh Token của người dùng khỏi Redis (khi Logout mà không có JTI hoặc Logout toàn bộ phiên).
     *
     * @param email Email của người dùng
     */
    void deleteRefreshToken(String email);

    /**
     * Đưa định danh Access Token (JTI) vào Blacklist để vô hiệu hóa tức thì
     *
     * @param jti              Mã định danh duy nhất của JWT (claim 'jti')
     * @param remainingSeconds Số giây còn lại trước khi Access Token hết hạn
     */
    void blacklistToken(String jti, long remainingSeconds);

    /**
     * Kiểm tra xem Access Token (JTI) có nằm trong danh sách đen (Blacklist) hay không
     *
     * @param jti Mã định danh duy nhất của JWT
     * @return true nếu token đã bị thu hồi / đăng xuất, false nếu hợp lệ
     */
    boolean isTokenBlacklisted(String jti);
}