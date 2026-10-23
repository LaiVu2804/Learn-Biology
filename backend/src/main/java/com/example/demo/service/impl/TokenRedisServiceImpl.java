package com.example.demo.service.impl;

import com.example.demo.service.TokenRedisService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class TokenRedisServiceImpl implements TokenRedisService {

    private final StringRedisTemplate stringRedisTemplate;

    private static final String REFRESH_TOKEN_PREFIX = "auth:rt:";
    private static final String BLACKLIST_PREFIX = "auth:bl:";

    public TokenRedisServiceImpl(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public void saveRefreshToken(String email, String refreshToken, long expirySeconds) {
        if (email == null || refreshToken == null || expirySeconds <= 0) {
            return;
        }
        try {
            String key = REFRESH_TOKEN_PREFIX + email;
            this.stringRedisTemplate.opsForValue().set(key, refreshToken, expirySeconds, TimeUnit.SECONDS);
            log.debug("Đã lưu Refresh Token vào Redis cho user [{}], TTL: {}s", email, expirySeconds);
        } catch (Exception e) {
            log.warn("Không thể kết nối Redis để lưu token cho user [{}] (đã lưu DB dự phòng): {}", email, e.getMessage());
        }
    }

    @Override
    public String getRefreshToken(String email) {
        if (email == null) {
            return null;
        }
        try {
            String key = REFRESH_TOKEN_PREFIX + email;
            return this.stringRedisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.warn("Không thể đọc Refresh Token từ Redis cho user [{}] (sẽ fallback đọc từ DB): {}", email, e.getMessage());
            return null;
        }
    }

    @Override
    public void deleteRefreshToken(String email) {
        if (email == null) {
            return;
        }
        try {
            String key = REFRESH_TOKEN_PREFIX + email;
            this.stringRedisTemplate.delete(key);
            log.debug("Đã xóa Refresh Token trong Redis của user [{}]", email);
        } catch (Exception e) {
            log.warn("Không thể xóa Refresh Token trong Redis của user [{}]: {}", email, e.getMessage());
        }
    }

    @Override
    public void blacklistToken(String jti, long remainingSeconds) {
        if (jti == null || remainingSeconds <= 0) {
            return;
        }
        try {
            String key = BLACKLIST_PREFIX + jti;
            this.stringRedisTemplate.opsForValue().set(key, "revoked", remainingSeconds, TimeUnit.SECONDS);
            log.info("Đã đưa token JTI [{}] vào Blacklist Redis, TTL: {}s", jti, remainingSeconds);
        } catch (Exception e) {
            log.warn("Không thể đưa JTI [{}] vào Blacklist Redis do mất kết nối: {}", jti, e.getMessage());
        }
    }

    @Override
    public boolean isTokenBlacklisted(String jti) {
        if (jti == null || jti.isBlank()) {
            return false;
        }
        try {
            String key = BLACKLIST_PREFIX + jti;
            Boolean hasKey = this.stringRedisTemplate.hasKey(key);
            return Boolean.TRUE.equals(hasKey);
        } catch (Exception e) {
            log.warn("Không thể kiểm tra Blacklist trên Redis cho JTI [{}]: {}. Tiếp tục cho phép request.", jti, e.getMessage());
            return false;
        }
    }
}
