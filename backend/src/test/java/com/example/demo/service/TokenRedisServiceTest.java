package com.example.demo.service;

import com.example.demo.service.impl.TokenRedisServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenRedisServiceTest {

    @Mock
    private StringRedisTemplate stringRedisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    private TokenRedisServiceImpl tokenRedisService;

    @BeforeEach
    void setUp() {
        tokenRedisService = new TokenRedisServiceImpl(stringRedisTemplate);
    }

    @Test
    @DisplayName("Lưu Refresh Token kèm JTI vào Redis với TTL chuẩn")
    void testSaveRefreshTokenWithJti() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);

        String email = "user@example.com";
        String jti = "uuid-123";
        String refreshToken = "sample-refresh-token";
        long ttl = 604800L;

        tokenRedisService.saveRefreshToken(email, jti, refreshToken, ttl);

        verify(valueOperations, times(1)).set(
                eq("auth:rt:user@example.com:uuid-123"),
                eq(refreshToken),
                eq(ttl),
                eq(TimeUnit.SECONDS)
        );
    }

    @Test
    @DisplayName("Tự động trích xuất JTI từ payload JWT khi lưu token không truyền JTI trực tiếp")
    void testSaveRefreshToken_AutoExtractJti() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);

        String email = "user@example.com";
        // Token JWT mẫu chứa claim jti = "auto-jti-999" trong payload
        String jwtTokenWithJti = "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRvLWp0aS05OTkiLCJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0.fakesig";
        long ttl = 604800L;

        tokenRedisService.saveRefreshToken(email, jwtTokenWithJti, ttl);

        verify(valueOperations, times(1)).set(
                eq("auth:rt:user@example.com:auto-jti-999"),
                eq(jwtTokenWithJti),
                eq(ttl),
                eq(TimeUnit.SECONDS)
        );
    }

    @Test
    @DisplayName("Kiểm tra Refresh Token hợp lệ khi khớp key JTI")
    void testIsRefreshTokenValid_Success() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("auth:rt:user@example.com:uuid-123")).thenReturn("sample-refresh-token");

        boolean isValid = tokenRedisService.isRefreshTokenValid("user@example.com", "uuid-123", "sample-refresh-token");

        assertTrue(isValid);
    }

    @Test
    @DisplayName("Từ chối Refresh Token khi token không tồn tại trong Redis (đã Logout hoặc hết hạn)")
    void testIsRefreshTokenValid_NullInRedis() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("auth:rt:user@example.com:uuid-123")).thenReturn(null);
        when(valueOperations.get("auth:rt:user@example.com")).thenReturn(null);

        boolean isValid = tokenRedisService.isRefreshTokenValid("user@example.com", "uuid-123", "sample-refresh-token");

        assertFalse(isValid, "Khi key trong Redis là null, token phải bị từ chối ngay lập tức để chống Bypass Logout");
    }

    @Test
    @DisplayName("Từ chối Refresh Token khi token bị giả mạo hoặc không trùng khớp với Redis")
    void testIsRefreshTokenValid_MismatchedToken() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("auth:rt:user@example.com:uuid-123")).thenReturn("original-token");

        boolean isValid = tokenRedisService.isRefreshTokenValid("user@example.com", "uuid-123", "forged-token");

        assertFalse(isValid);
    }

    @Test
    @DisplayName("Xóa Refresh Token khi người dùng Logout thiết bị cụ thể")
    void testDeleteRefreshToken() {
        tokenRedisService.deleteRefreshToken("user@example.com", "uuid-123");

        verify(stringRedisTemplate, times(1)).delete("auth:rt:user@example.com:uuid-123");
        verify(stringRedisTemplate, times(1)).delete("auth:rt:user@example.com");
    }

    @Test
    @DisplayName("Đưa Access Token (JTI) vào Blacklist Redis với TTL còn lại")
    void testBlacklistToken() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);

        tokenRedisService.blacklistToken("access-jti-456", 300L);

        verify(valueOperations, times(1)).set(
                eq("auth:bl:access-jti-456"),
                eq("revoked"),
                eq(300L),
                eq(TimeUnit.SECONDS)
        );
    }

    @Test
    @DisplayName("Kiểm tra Token đã nằm trong Blacklist")
    void testIsTokenBlacklisted_True() {
        when(stringRedisTemplate.hasKey("auth:bl:access-jti-456")).thenReturn(true);

        boolean isBlacklisted = tokenRedisService.isTokenBlacklisted("access-jti-456");

        assertTrue(isBlacklisted);
    }

    @Test
    @DisplayName("Kiểm tra Token chưa bị Blacklist")
    void testIsTokenBlacklisted_False() {
        when(stringRedisTemplate.hasKey("auth:bl:valid-jti-789")).thenReturn(false);

        boolean isBlacklisted = tokenRedisService.isTokenBlacklisted("valid-jti-789");

        assertFalse(isBlacklisted);
    }
}
