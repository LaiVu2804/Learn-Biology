package com.example.demo.controller;

import com.example.demo.domain.request.user.ReqLoginDTO;
import com.example.demo.domain.response.user.RestCreateUserDTO;
import com.example.demo.domain.response.user.RestLoginDTO;
import com.example.demo.entity.Permission;
import com.example.demo.entity.User;
import com.example.demo.service.TokenRedisService;
import com.example.demo.service.UserService;
import com.example.demo.util.SecurityUtil;
import com.example.demo.util.annotation.ApiMessage;
import com.example.demo.util.error.IdInvalidException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final TokenRedisService tokenRedisService;

    @Value("${laivu.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthController(
            UserService userService,
            PasswordEncoder passwordEncoder,
            AuthenticationManagerBuilder authenticationManagerBuilder,
            SecurityUtil securityUtil,
            TokenRedisService tokenRedisService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.tokenRedisService = tokenRedisService;
    }

    private RestLoginDTO.Role mapToRoleDTO(User user) {
        if (user == null || user.getRole() == null) {
            return null;
        }
        List<String> permissionNames = new ArrayList<>();
        if (user.getRole().getPermissions() != null) {
            for (Permission p : user.getRole().getPermissions()) {
                permissionNames.add(p.getName());
            }
        }
        return new RestLoginDTO.Role(
                user.getRole().getId(),
                user.getRole().getName(),
                permissionNames
        );
    }

    @PostMapping("/login")
    public ResponseEntity<RestLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDTO) {
        // Kiểm tra tài khoản nếu đang bị khóa
        User preCheckUser = this.userService.handleGetUserByUserName(loginDTO.getUsername());
        if (preCheckUser != null && preCheckUser.isLocked()) {
            throw new LockedException("tài khoản này hiện tại đang bị khóa");
        }

        // 1. Tạo đối tượng UsernamePasswordAuthenticationToken nạp thông tin đăng nhập
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());

        // 2. Thực thi xác thực qua AuthenticationManager
        Authentication authentication = this.authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // Nạp thông tin xác thực vào SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Khởi tạo dữ liệu trả về cho client
        RestLoginDTO res = new RestLoginDTO();
        User currentUserDB = this.userService.handleGetUserByUserName(loginDTO.getUsername());
        if (currentUserDB != null) {
            RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin(
                    currentUserDB.getId(),
                    currentUserDB.getEmail(),
                    currentUserDB.getName(),
                    mapToRoleDTO(currentUserDB)
            );
            res.setUser(userLogin);
        }

        // 4. Tạo cặp JWT Token (HMAC-SHA-512)
        String accessToken = this.securityUtil.createAccessToken(authentication.getName(), res);
        res.setAccessToken(accessToken);

        String refreshToken = this.securityUtil.createRefreshToken(loginDTO.getUsername(), res);

        // Trích xuất JTI của Refresh Token để lưu định danh phiên vào Redis
        String refreshJti = null;
        try {
            Jwt decodedRt = this.securityUtil.checkValueRefreshToken(refreshToken);
            refreshJti = decodedRt.getId();
        } catch (Exception ignored) {}

        // 5. Lưu trữ Refresh Token vào Redis với thời hạn TTL
        this.tokenRedisService.saveRefreshToken(loginDTO.getUsername(), refreshJti, refreshToken, this.refreshTokenExpiration);

        // 6. Cấu hình HttpOnly Cookie cho Refresh Token
        ResponseCookie resCookie = ResponseCookie
                .from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Lax")
                .maxAge(this.refreshTokenExpiration)
                .build();

        // 7. Trả về HTTP 200 OK
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookie.toString())
                .body(res);
    }

    @GetMapping("/account")
    @ApiMessage("Get current user account")
    public ResponseEntity<RestLoginDTO.UserGetAccount> getAccount() {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUserDB = this.userService.handleGetUserByUserName(email);
        RestLoginDTO.UserGetAccount userGetAccount = new RestLoginDTO.UserGetAccount();
        if (currentUserDB != null) {
            RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin(
                    currentUserDB.getId(),
                    currentUserDB.getEmail(),
                    currentUserDB.getName(),
                    mapToRoleDTO(currentUserDB)
            );
            userGetAccount.setUser(userLogin);
        }
        return ResponseEntity.ok(userGetAccount);
    }

    @GetMapping("/refresh")
    @ApiMessage("Get User by refresh token")
    public ResponseEntity<RestLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "") String refreshToken) throws IdInvalidException {
        if (refreshToken.isEmpty()) {
            throw new IdInvalidException("Bạn không có refresh token ở cookie, vui lòng đăng nhập lại!");
        }

        Jwt decodedToken;
        try {
            decodedToken = this.securityUtil.checkValueRefreshToken(refreshToken);
        } catch (Exception e) {
            throw new IdInvalidException("Refresh Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại!");
        }
        String email = decodedToken.getSubject();
        String jti = decodedToken.getId();

        boolean isValid = this.tokenRedisService.isRefreshTokenValid(email, jti, refreshToken);
        if (!isValid) {
            throw new IdInvalidException("Phiên đăng nhập đã hết hạn hoặc token đã bị thu hồi/đăng xuất. Vui lòng đăng nhập lại!");
        }

        User currentUser = this.userService.handleGetUserByUserName(email);
        if (currentUser == null) {
            throw new IdInvalidException("Tài khoản người dùng không tồn tại!");
        }
        if (currentUser.isLocked()) {
            throw new IdInvalidException("tài khoản này hiện tại đang bị khóa");
        }

        // Cấp phát Token mới (Refresh Token Rotation)
        RestLoginDTO res = new RestLoginDTO();
        RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin(
                currentUser.getId(),
                currentUser.getEmail(),
                currentUser.getName(),
                mapToRoleDTO(currentUser)
        );
        res.setUser(userLogin);

        String newAccessToken = this.securityUtil.createAccessToken(email, res);
        res.setAccessToken(newAccessToken);

        String newRefreshToken = this.securityUtil.createRefreshToken(email, res);

        String newRefreshJti = null;
        try {
            Jwt newDecodedRt = this.securityUtil.checkValueRefreshToken(newRefreshToken);
            newRefreshJti = newDecodedRt.getId();
        } catch (Exception ignored) {}

        this.tokenRedisService.deleteRefreshToken(email, jti);
        this.tokenRedisService.saveRefreshToken(email, newRefreshJti, newRefreshToken, this.refreshTokenExpiration);

        ResponseCookie resCookie = ResponseCookie
                .from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Lax")
                .maxAge(this.refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookie.toString())
                .body(res);
    }

    @PostMapping("/refresh")
    @ApiMessage("Get User by refresh token")
    public ResponseEntity<RestLoginDTO> postRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "") String refreshToken) throws IdInvalidException {
        return this.getRefreshToken(refreshToken);
    }

    @PostMapping("/register")
    public ResponseEntity<RestCreateUserDTO> register(@Valid @RequestBody User reqUser) throws IdInvalidException {
        boolean isEmailExist = this.userService.isEmailExist(reqUser.getEmail());
        if (isEmailExist) {
            throw new IdInvalidException("Email " + reqUser.getEmail() + " đã tồn tại, vui lòng sử dụng email khác");
        }

        String hashPassword = this.passwordEncoder.encode(reqUser.getPassword());
        reqUser.setPassword(hashPassword);

        User createdUser = this.userService.handleCreateUser(reqUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToRestCreateUserDTO(createdUser));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refresh_token", defaultValue = "") String refreshToken,
            @RequestHeader(name = "Authorization", defaultValue = "") String authHeader) throws IdInvalidException {

        String bearerToken = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            bearerToken = authHeader.substring(7).trim();
        }

        if (bearerToken != null && !bearerToken.isEmpty()) {
            try {
                Jwt decodedJwt = this.securityUtil.checkValueRefreshToken(bearerToken);
                String jti = decodedJwt.getId();
                Instant expiresAt = decodedJwt.getExpiresAt();
                if (jti != null && expiresAt != null) {
                    long remainingSeconds = Duration.between(Instant.now(), expiresAt).getSeconds();
                    if (remainingSeconds > 0) {
                        this.tokenRedisService.blacklistToken(jti, remainingSeconds);
                    }
                }
            } catch (Exception ignored) {}
        }

        if (refreshToken != null && !refreshToken.isEmpty()) {
            try {
                Jwt decodedRt = this.securityUtil.checkValueRefreshToken(refreshToken);
                String email = decodedRt.getSubject();
                String jti = decodedRt.getId();
                this.tokenRedisService.deleteRefreshToken(email, jti);
            } catch (Exception ignored) {
                SecurityUtil.getCurrentUserLogin().ifPresent(this.tokenRedisService::deleteRefreshToken);
            }
        } else {
            SecurityUtil.getCurrentUserLogin().ifPresent(this.tokenRedisService::deleteRefreshToken);
        }

        ResponseCookie deleteSpringCookie = ResponseCookie
                .from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString())
                .body(null);
    }

    @GetMapping("/google-user")
    public ResponseEntity<Object> getGoogleUser(Authentication authentication) {
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
                return ResponseEntity.ok(oauth2User.getAttributes());
            }
            return ResponseEntity.ok(authentication.getName());
        }
        return ResponseEntity.ok("Chưa có thông tin đăng nhập Google");
    }
}
