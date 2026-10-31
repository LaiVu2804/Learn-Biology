package com.example.demo.service.impl;

import com.example.demo.service.TokenRedisService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class TokenRedisServiceImpl implements TokenRedisService {

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    private static final String REFRESH_TOKEN_PREFIX = "auth:rt:";
    private static final String BLACKLIST_PREFIX = "auth:bl:";

    @Autowired
    public TokenRedisServiceImpl(StringRedisTemplate stringRedisTemplate, ObjectMapper objectMapper) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
    }

    public TokenRedisServiceImpl(StringRedisTemplate stringRedisTemplate) {
        this(stringRedisTemplate, new ObjectMapper());
    }

    /**
     * Tự động trích xuất claim 'jti' (JWT ID) từ payload của chuỗi JWT Refresh Token
     * Giúp hệ thống luôn xác định được định danh thiết bị/phiên ngay cả khi caller không truyền trực tiếp jti.
     */
    private String extractJtiFromJwt(String jwtToken) {
        if (jwtToken == null || !jwtToken.contains(".")) {
            return null;
        }
        try {
            String[] parts = jwtToken.split("\\.");
            if (parts.length >= 2) {
                byte[] decodedBytes = Base64.getUrlDecoder().decode(parts[1]);
                JsonNode payloadJson = this.objectMapper.readTree(new String(decodedBytes, StandardCharsets.UTF_8));
                if (payloadJson.hasNonNull("jti")) {
                    return payloadJson.get("jti").asText();
                }
            }
        } catch (Exception e) {
            log.trace("Không thể trích xuất claim 'jti' từ payload JWT: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Xây dựng Redis Key theo định dạng chuẩn đa thiết bị: auth:rt:{email}:{jti}
     */
    private String buildRtKey(String email, String jti) {
        if (jti != null && !jti.isBlank()) {
            return REFRESH_TOKEN_PREFIX + email + ":" + jti;
        }
        return REFRESH_TOKEN_PREFIX + email;
    }

    @Override
    public void saveRefreshToken(String email, String jti, String refreshToken, long expirySeconds) {
        if (email == null || refreshToken == null || expirySeconds <= 0) {
            return;
        }
        try {
            String resolvedJti = (jti != null && !jti.isBlank()) ? jti : extractJtiFromJwt(refreshToken);
            String key = buildRtKey(email, resolvedJti);
            this.stringRedisTemplate.opsForValue().set(key, refreshToken, expirySeconds, TimeUnit.SECONDS);
            log.debug("Đã lưu Refresh Token vào Redis cho user [{}], key [{}], TTL: {}s", email, key, expirySeconds);
        } catch (Exception e) {
            log.warn("Không thể kết nối Redis để lưu token cho user [{}]: {}", email, e.getMessage());
        }
    }

    @Override
    public void saveRefreshToken(String email, String refreshToken, long expirySeconds) {
        saveRefreshToken(email, null, refreshToken, expirySeconds);
    }

    @Override
    public boolean isRefreshTokenValid(String email, String jti, String refreshToken) {
        if (email == null || refreshToken == null) {
            return false;
        }
        try {
            String resolvedJti = (jti != null && !jti.isBlank()) ? jti : extractJtiFromJwt(refreshToken);

            // 1. Kiểm tra theo key định danh phiên/thiết bị auth:rt:{email}:{jti}
            if (resolvedJti != null && !resolvedJti.isBlank()) {
                String keyWithJti = buildRtKey(email, resolvedJti);
                String storedWithJti = this.stringRedisTemplate.opsForValue().get(keyWithJti);
                if (storedWithJti != null) {
                    return storedWithJti.equals(refreshToken);
                }
            }

            // 2. Fallback kiểm tra theo key legacy cũ auth:rt:{email} (cho các token tạo trước nâng cấp)
            String legacyKey = REFRESH_TOKEN_PREFIX + email;
            String legacyStored = this.stringRedisTemplate.opsForValue().get(legacyKey);
            return legacyStored != null && legacyStored.equals(refreshToken);
        } catch (Exception e) {
            log.warn("Không thể xác thực Refresh Token trên Redis cho user [{}]: {}", email, e.getMessage());
            return false;
        }
    }

    @Override
    public void deleteRefreshToken(String email, String jti) {
        if (email == null) {
            return;
        }

        // Nếu jti trống, fallback xóa toàn bộ token của email này
        if (jti == null || jti.isBlank()) {
            deleteRefreshToken(email);
            return;
        }

        try {
            String targetKey = buildRtKey(email, jti);
            String legacyKey = REFRESH_TOKEN_PREFIX + email;

            this.stringRedisTemplate.delete(targetKey);
            this.stringRedisTemplate.delete(legacyKey);

            log.debug("Đã xóa Refresh Token của thiết bị hiện tại. User: [{}], JTI: [{}]", email, jti);
        } catch (Exception e) {
            log.warn("Không thể xóa Refresh Token trong Redis của user [{}], JTI [{}]: {}", email, jti, e.getMessage());
        }
    }

    @Override
    public void deleteRefreshToken(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        try {
            // 1. Xóa key legacy auth:rt:{email}
            String legacyKey = REFRESH_TOKEN_PREFIX + email;
            this.stringRedisTemplate.delete(legacyKey);

            // 2. Quét không chặn (SCAN) để xóa các key phiên đa thiết bị auth:rt:{email}:*
            ScanOptions options = ScanOptions.scanOptions()
                    .match(REFRESH_TOKEN_PREFIX + email + ":*")
                    .count(100)
                    .build();

            Set<String> keysToDelete = new HashSet<>();
            try (Cursor<String> cursor = this.stringRedisTemplate.scan(options)) {
                while (cursor.hasNext()) {
                    keysToDelete.add(cursor.next());
                }
            }

            if (!keysToDelete.isEmpty()) {
                this.stringRedisTemplate.delete(keysToDelete);
                log.debug("Đã xóa {} phiên Refresh Token của user [{}] trên mọi thiết bị", keysToDelete.size(), email);
            }
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
