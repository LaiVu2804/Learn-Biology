package com.example.demo.service;

public interface TokenRedisService {

    /**
     * Lưu trữ Refresh Token vào Redis với thời hạn sống (TTL)
     *
     * @param email         Email/Username của người dùng
     * @param refreshToken  Chuỗi Refresh Token JWT
     * @param expirySeconds Thời gian hiệu lực tính bằng giây
     */
    void saveRefreshToken(String email, String refreshToken, long expirySeconds);

    /**
     * Lấy Refresh Token hiện tại của người dùng từ Redis
     *
     * @param email Email/Username của người dùng
     * @return Chuỗi Refresh Token hoặc null nếu không tồn tại / đã hết hạn
     */
    String getRefreshToken(String email);

    /**
     * Xóa Refresh Token của người dùng khỏi Redis (khi Logout hoặc Revoke)
     *
     * @param email Email/Username của người dùng
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

