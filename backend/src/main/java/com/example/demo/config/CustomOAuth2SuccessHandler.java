package com.example.demo.config;

import com.example.demo.domain.response.user.RestLoginDTO;
import com.example.demo.entity.User;
import com.example.demo.service.TokenRedisService;
import com.example.demo.service.UserService;
import com.example.demo.util.SecurityUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final SecurityUtil securityUtil;
    private final PasswordEncoder passwordEncoder;
    private final TokenRedisService tokenRedisService;

    @Value("${laivu.jwt.refresh-token-validity-in-seconds:864000}")
    private long refreshTokenExpiration;

    @Value("${laivu.oauth2.frontend-redirect-url:http://localhost:3000/oauth2/redirect}")
    private String frontendRedirectUrl;

    public CustomOAuth2SuccessHandler(
            UserService userService,
            SecurityUtil securityUtil,
            PasswordEncoder passwordEncoder,
            TokenRedisService tokenRedisService) {
        this.userService = userService;
        this.securityUtil = securityUtil;
        this.passwordEncoder = passwordEncoder;
        this.tokenRedisService = tokenRedisService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            if (name == null || name.isBlank()) {
                name = email;
            }

            // 1. Kiểm tra User đã có trong DB chưa, nếu chưa có thì tạo mới
            User currentUserDB = this.userService.handleGetUserByUserName(email);
            if (currentUserDB == null) {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                // Băm mật khẩu ngẫu nhiên vì người dùng xác thực qua Google
                newUser.setPassword(this.passwordEncoder.encode(UUID.randomUUID().toString()));
                currentUserDB = this.userService.handleCreateUser(newUser);
            }

            // 2. Tạo đối tượng phản hồi User
            RestLoginDTO res = new RestLoginDTO();
            RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin(
                    currentUserDB.getId(),
                    currentUserDB.getEmail(),
                    currentUserDB.getName(),
                    null
            );
            res.setUser(userLogin);

            // 3. Tạo cặp JWT Token (Access Token & Refresh Token)
            String refreshToken = this.securityUtil.createRefreshToken(email, res);

            // 4. Lưu Refresh Token vào Redis
            this.tokenRedisService.saveRefreshToken(email, refreshToken, this.refreshTokenExpiration);
            // this.userService.updateUserToken(refreshToken, email);

            // 5. Gán HttpOnly Cookie an toàn cho Refresh Token (chống XSS & CSRF)
            ResponseCookie resCookie = ResponseCookie
                    .from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(this.refreshTokenExpiration)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, resCookie.toString());

            // 6. Chuyển hướng về URL sạch 100% của Frontend (Không đính kèm Token lên URL)
            response.sendRedirect(this.frontendRedirectUrl);
        } else {
            response.sendRedirect(this.frontendRedirectUrl + "?error=oauth2_failed");
        }
    }
}

