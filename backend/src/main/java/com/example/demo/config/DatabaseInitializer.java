package com.example.demo.config;

import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.PermissionRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    public DatabaseInitializer(
            PermissionRepository permissionRepository,
            RoleRepository roleRepository,
            UserRepository userRepository) {
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println(">>> [BioPrep] Khởi tạo hệ thống Phân quyền Role & Permission...");

        // 1. Khởi tạo danh sách Quyền hạn (Permissions)
        List<Permission> allPermissions = new ArrayList<>();

        // USERS Module
        allPermissions.add(getOrCreatePermission("USERS_CREATE", "/api/v1/users", "POST", "USERS"));
        allPermissions.add(getOrCreatePermission("USERS_UPDATE", "/api/v1/users", "PUT", "USERS"));
        allPermissions.add(getOrCreatePermission("USERS_DELETE", "/api/v1/users/{id}", "DELETE", "USERS"));
        allPermissions.add(getOrCreatePermission("USERS_VIEW", "/api/v1/users", "GET", "USERS"));

        // ROLES Module
        allPermissions.add(getOrCreatePermission("ROLES_CREATE", "/api/v1/roles", "POST", "ROLES"));
        allPermissions.add(getOrCreatePermission("ROLES_UPDATE", "/api/v1/roles", "PUT", "ROLES"));
        allPermissions.add(getOrCreatePermission("ROLES_DELETE", "/api/v1/roles/{id}", "DELETE", "ROLES"));
        allPermissions.add(getOrCreatePermission("ROLES_VIEW", "/api/v1/roles", "GET", "ROLES"));

        // PERMISSIONS Module
        allPermissions.add(getOrCreatePermission("PERMISSIONS_CREATE", "/api/v1/permissions", "POST", "PERMISSIONS"));
        allPermissions.add(getOrCreatePermission("PERMISSIONS_UPDATE", "/api/v1/permissions", "PUT", "PERMISSIONS"));
        allPermissions.add(getOrCreatePermission("PERMISSIONS_DELETE", "/api/v1/permissions/{id}", "DELETE", "PERMISSIONS"));
        allPermissions.add(getOrCreatePermission("PERMISSIONS_VIEW", "/api/v1/permissions", "GET", "PERMISSIONS"));

        // EXAMS Module
        Permission examCreate = getOrCreatePermission("EXAMS_CREATE", "/api/v1/exams", "POST", "EXAMS");
        Permission examUpdate = getOrCreatePermission("EXAMS_UPDATE", "/api/v1/exams", "PUT", "EXAMS");
        Permission examDelete = getOrCreatePermission("EXAMS_DELETE", "/api/v1/exams/{id}", "DELETE", "EXAMS");
        Permission examView = getOrCreatePermission("EXAMS_VIEW", "/api/v1/exams", "GET", "EXAMS");
        allPermissions.add(examCreate);
        allPermissions.add(examUpdate);
        allPermissions.add(examDelete);
        allPermissions.add(examView);

        // QUESTIONS Module
        Permission qCreate = getOrCreatePermission("QUESTIONS_CREATE", "/api/v1/questions", "POST", "QUESTIONS");
        Permission qUpdate = getOrCreatePermission("QUESTIONS_UPDATE", "/api/v1/questions", "PUT", "QUESTIONS");
        Permission qDelete = getOrCreatePermission("QUESTIONS_DELETE", "/api/v1/questions/{id}", "DELETE", "QUESTIONS");
        Permission qView = getOrCreatePermission("QUESTIONS_VIEW", "/api/v1/questions", "GET", "QUESTIONS");
        allPermissions.add(qCreate);
        allPermissions.add(qUpdate);
        allPermissions.add(qDelete);
        allPermissions.add(qView);

        // SYSTEM Module
        Permission dashAdmin = getOrCreatePermission("DASHBOARD_ADMIN_VIEW", "/api/v1/admin/dashboard", "GET", "SYSTEM");
        Permission dashTutor = getOrCreatePermission("DASHBOARD_TUTOR_VIEW", "/api/v1/tutor/dashboard", "GET", "SYSTEM");
        allPermissions.add(dashAdmin);
        allPermissions.add(dashTutor);

        // 2. Khởi tạo Vai trò (Roles)
        // ROLE_ADMIN: Sở hữu toàn bộ quyền hạn trong hệ thống
        Role adminRole = this.roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> {
            Role r = new Role();
            r.setName("ROLE_ADMIN");
            r.setDescription("Quản trị viên toàn hệ thống BioPrep - Toàn quyền cấu hình & kiểm duyệt");
            r.setActive(true);
            return r;
        });
        adminRole.setPermissions(allPermissions);
        adminRole = this.roleRepository.save(adminRole);

        // ROLE_TUTOR: Giảng viên / Tác giả Khảo thí - Quản lý câu hỏi, biên soạn đề và phân tích kết quả học viên
        Role tutorRole = this.roleRepository.findByName("ROLE_TUTOR").orElseGet(() -> {
            Role r = new Role();
            r.setName("ROLE_TUTOR");
            r.setDescription("Giảng viên / Tác giả Khảo thí - Biên soạn ngân hàng câu hỏi & tổ chức đề thi");
            r.setActive(true);
            return r;
        });
        List<Permission> tutorPermissions = List.of(
                dashTutor,
                examCreate, examUpdate, examDelete, examView,
                qCreate, qUpdate, qDelete, qView
        );
        tutorRole.setPermissions(new ArrayList<>(tutorPermissions));
        tutorRole = this.roleRepository.save(tutorRole);

        // ROLE_USER: Học viên - Luyện thi và làm bài trắc nghiệm Sinh học
        Role userRole = this.roleRepository.findByName("ROLE_USER").orElseGet(() -> {
            Role r = new Role();
            r.setName("ROLE_USER");
            r.setDescription("Học viên BioPrep - Luyện đề, thi trực tuyến và tra cứu đáp án");
            r.setActive(true);
            return r;
        });
        List<Permission> userPermissions = List.of(examView, qView);
        userRole.setPermissions(new ArrayList<>(userPermissions));
        userRole = this.roleRepository.save(userRole);

        // 3. Gán Role mặc định cho các tài khoản hiện có nếu chưa có role
        List<User> existingUsers = this.userRepository.findAll();
        for (User u : existingUsers) {
            if (u.getRole() == null) {
                if (u.getEmail() != null && u.getEmail().toLowerCase().contains("admin")) {
                    u.setRole(adminRole);
                } else if (u.getEmail() != null && (u.getEmail().toLowerCase().contains("tutor") || u.getEmail().toLowerCase().contains("teacher"))) {
                    u.setRole(tutorRole);
                } else {
                    u.setRole(userRole);
                }
                this.userRepository.save(u);
            }
        }

        System.out.println(">>> [BioPrep] Hoàn tất nạp dữ liệu vai trò và quyền hạn thành công!");
    }

    private Permission getOrCreatePermission(String name, String apiPath, String method, String module) {
        return this.permissionRepository.findByName(name).orElseGet(() -> {
            Permission p = new Permission(name, apiPath, method, module);
            return this.permissionRepository.save(p);
        });
    }
}

