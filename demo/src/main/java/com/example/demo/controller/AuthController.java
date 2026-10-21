package com.example.demo.controller;

import com.example.demo.dto.ReqLoginDTO;
import com.example.demo.dto.ResCreateUserDTO;
import com.example.demo.dto.RestLoginDTO;
import com.example.demo.entity.User;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;

    @Value("${laivu.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthController(
            UserService userService,
            PasswordEncoder passwordEncoder,
            AuthenticationManagerBuilder authenticationManagerBuilder,
            SecurityUtil securityUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<RestLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDTO) {
        // 1. Tạo đối tượng UsernamePasswordAuthenticationToken nạp thông tin đăng nhập
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());

        // 2. Thực thi xác thực qua AuthenticationManager (tự động gọi UserDetailsCustom và so khớp mật khẩu BCrypt)
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
                    null
            );
            res.setUser(userLogin);
        }

        // 4. Tạo cặp JWT Token (HMAC-SHA-512)
        String accessToken = this.securityUtil.createAccessToken(authentication.getName(), res);
        res.setAccessToken(accessToken);

        String refreshToken = this.securityUtil.createRefreshToken(loginDTO.getUsername(), res);

        // 5. Lưu trữ Refresh Token vào Database
        this.userService.updateUserToken(refreshToken, loginDTO.getUsername());

        // 6. Cấu hình HttpOnly Cookie cho Refresh Token
        ResponseCookie resCookie = ResponseCookie
                .from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Lax")
                .maxAge(this.refreshTokenExpiration)
                .build();

        // 7. Trả về HTTP 200 OK với header Set-Cookie chứa cookie và body là resLoginDTO
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookie.toString())
                .body(res);
    }

    @GetMapping("/refresh")
    @ApiMessage("Get User by refresh token")
    public ResponseEntity<RestLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "") String refreshToken) throws IdInvalidException {
        // 1. Đọc Cookie: Nếu rỗng, ném lỗi yêu cầu đăng nhập lại
        if (refreshToken.isEmpty()) {
            throw new IdInvalidException("Bạn không có refresh token ở cookie, vui lòng đăng nhập lại!");
        }

        // 2. Kiểm tra tính hợp lệ về mặt mật mã học (NimbusJwtDecoder kiểm tra chữ ký HS512 và expiry time)
        Jwt decodedToken;
        try {
            decodedToken = this.securityUtil.checkValueRefreshToken(refreshToken);
        } catch (Exception e) {
            throw new IdInvalidException("Refresh Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại");
        }
        String email = decodedToken.getSubject();

        // 3. Kiểm tra tính hợp lệ với Database
        User currentUser = this.userService.getUserByRefreshTokenAndEmail(refreshToken, email);
        if (currentUser == null) {
            throw new IdInvalidException("Token không hợp lệ hoặc đã hết hạn");
        }

        // 4. Cấp phát Token mới (Refresh Token Rotation)
        RestLoginDTO res = new RestLoginDTO();
        RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin(
                currentUser.getId(),
                currentUser.getEmail(),
                currentUser.getName(),
                null
        );
        res.setUser(userLogin);

        String newAccessToken = this.securityUtil.createAccessToken(email, res);
        res.setAccessToken(newAccessToken);

        String newRefreshToken = this.securityUtil.createRefreshToken(email, res);

        // Cập nhật Refresh Token mới vào Database
        this.userService.updateUserToken(newRefreshToken, email);

        // 5. Ghi đè Cookie
        ResponseCookie resCookie = ResponseCookie
                .from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Lax")
                .maxAge(this.refreshTokenExpiration)
                .build();

        // 6. Response: Trả về HTTP 200 OK cùng RestLoginDTO chứa access_token mới
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
    public ResponseEntity<ResCreateUserDTO> register(@Valid @RequestBody User reqUser) throws IdInvalidException {
        // 1. Kiểm tra email đã tồn tại hay chưa
        boolean isEmailExist = this.userService.isEmailExist(reqUser.getEmail());
        if (isEmailExist) {
            throw new IdInvalidException("Email " + reqUser.getEmail() + " đã tồn tại, vui lòng sử dụng email khác");
        }

        // 2. Mã hóa mật khẩu bằng BCrypt
        String hashPassword = this.passwordEncoder.encode(reqUser.getPassword());
        reqUser.setPassword(hashPassword);

        // 3. Lưu người dùng vào cơ sở dữ liệu
        User createdUser = this.userService.handleCreateUser(reqUser);

        // 4. Trả về status 201 CREATED kèm DTO an toàn không chứa mật khẩu thô
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateUserDTO(createdUser));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() throws IdInvalidException {
        // 1. Lấy email/username của user hiện tại đang đăng nhập từ SecurityContext (được giải mã từ Access Token)
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new IdInvalidException("Access Token không hợp lệ hoặc đã hết hạn!");
        }

        // 2. Xóa Refresh Token của người dùng trong cơ sở dữ liệu
        this.userService.updateUserToken(null, email);

        // 3. Xóa Cookie refresh_token ở trình duyệt bằng cách đặt Max-Age = 0
        ResponseCookie deleteSpringCookie = ResponseCookie
                .from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        // 4. Trả về phản hồi thành công kèm header xóa Cookie
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString())
                .body(null);
    }

    /**
     * Endpoint test thông tin người dùng đăng nhập bằng Google (OAuth2)
     */
    @GetMapping("/google-user")
    public ResponseEntity<Object> getGoogleUser(Authentication authentication) {
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
                // Trả về Attributes dạng Map<String, Object> để tránh lỗi Jackson serialization của DefaultOidcUser
                return ResponseEntity.ok(oauth2User.getAttributes());
            }
            return ResponseEntity.ok(authentication.getName());
        }
        return ResponseEntity.ok("Chưa có thông tin đăng nhập Google");
    }
}
