package com.example.demo.service.impl;

import com.example.demo.domain.request.user.ReqCreateUserDTO;
import com.example.demo.domain.request.user.ReqUpdateUserDTO;
import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.domain.response.user.RestCreateUserDTO;
import com.example.demo.domain.response.user.RestUpdateUserDTO;
import com.example.demo.domain.response.user.RestUserDTO;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import com.example.demo.util.SecurityUtil;
import com.example.demo.util.error.IdInvalidException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    @Override
    @CacheEvict(value = {"users_email", "users_id"}, allEntries = true)
    public User handleCreateUser(User user) {
        if (user.getRole() == null) {
            Optional<Role> defaultRole = this.roleRepository.findByName("ROLE_USER");
            defaultRole.ifPresent(user::setRole);
        }
        return this.userRepository.save(user);
    }

    @Override
    @CacheEvict(value = {"users_email", "users_id"}, allEntries = true)
    public RestCreateUserDTO handleCreateUser(ReqCreateUserDTO reqUser) throws IdInvalidException {
        // Bước 1: Kiểm tra trùng email
        if (this.isEmailExist(reqUser.getEmail())) {
            throw new IdInvalidException("Email: " + reqUser.getEmail() + " đã tồn tại, vui lòng nhập email khác !");
        }

        // Bước 2: Băm mật khẩu bằng BCrypt
        String hashPassword = this.passwordEncoder.encode(reqUser.getPassword());

        // Bước 3: Khởi tạo và lưu User Entity
        User user = new User();
        user.setName(reqUser.getName());
        user.setEmail(reqUser.getEmail());
        user.setPassword(hashPassword);
        user.setAge(reqUser.getAge());
        user.setGender(reqUser.getGender());
        user.setAddress(reqUser.getAddress());

        if (reqUser.getRoleId() != null && reqUser.getRoleId() > 0) {
            Role role = this.roleRepository.findById(reqUser.getRoleId()).orElse(null);
            user.setRole(role);
        } else {
            Optional<Role> defaultRole = this.roleRepository.findByName("ROLE_USER");
            defaultRole.ifPresent(user::setRole);
        }

        User savedUser = this.userRepository.save(user);

        // Bước 4: Chuyển đổi sang RestCreateUserDTO (không lộ password)
        return this.convertToRestCreateUserDTO(savedUser);
    }

    @Override
    @CacheEvict(value = {"users_email", "users_id"}, allEntries = true)
    public RestUpdateUserDTO handleUpdateUser(ReqUpdateUserDTO reqUser) throws IdInvalidException {
        // Bước 1: Tìm User gốc trong DB
        User currentUser = this.fetchUserById(reqUser.getId());
        if (currentUser == null) {
            throw new IdInvalidException("User với id = " + reqUser.getId() + " không tồn tại");
        }

        // Bước 2: Cập nhật các trường được phép
        if (reqUser.getName() != null) {
            currentUser.setName(reqUser.getName());
        }
        if (reqUser.getAge() > 0) {
            currentUser.setAge(reqUser.getAge());
        }
        if (reqUser.getGender() != null) {
            currentUser.setGender(reqUser.getGender());
        }
        if (reqUser.getAddress() != null) {
            currentUser.setAddress(reqUser.getAddress());
        }
        if (reqUser.getRoleId() != null && reqUser.getRoleId() > 0) {
            Role role = this.roleRepository.findById(reqUser.getRoleId()).orElse(null);
            currentUser.setRole(role);
        }
        if (reqUser.getLocked() != null) {
            currentUser.setLocked(reqUser.getLocked());
        }

        currentUser.setUpdatedAt(Instant.now());
        currentUser.setUpdatedBy(SecurityUtil.getCurrentUserLogin().orElse(""));

        // Bước 3: Lưu vào DB
        User updatedUser = this.userRepository.save(currentUser);

        // Bước 4: Chuyển đổi DTO phản hồi
        return this.convertToRestUpdateUserDTO(updatedUser);
    }

    @Override
    @Cacheable(value = "users_email", key = "#userName", unless = "#result == null")
    public User handleGetUserByUserName(String userName) {
        return this.userRepository.findByEmail(userName).orElse(null);
    }

    @Override
    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.handleGetUserByUserName(email);
    }

    @Override
    @Cacheable(value = "users_id", key = "#id", unless = "#result == null")
    public User fetchUserById(long id) {
        return this.userRepository.findById(id).orElse(null);
    }

    @Override
    public RestCreateUserDTO convertToRestCreateUserDTO(User user) {
        RestCreateUserDTO res = new RestCreateUserDTO();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setGender(user.getGender());
        res.setAddress(user.getAddress());
        res.setAge(user.getAge());
        res.setCreatedAt(user.getCreatedAt());
        res.setCompany(null);
        return res;
    }

    @Override
    public RestUpdateUserDTO convertToRestUpdateUserDTO(User user) {
        RestUpdateUserDTO res = new RestUpdateUserDTO();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setGender(user.getGender());
        res.setAddress(user.getAddress());
        res.setAge(user.getAge());
        res.setUpdatedAt(user.getUpdatedAt());
        res.setUpdatedBy(user.getUpdatedBy());
        res.setCompany(null);
        return res;
    }

    @Override
    public RestUserDTO convertToRestUserDTO(User user) {
        RestUserDTO res = new RestUserDTO();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setGender(user.getGender());
        res.setAddress(user.getAddress());
        res.setAge(user.getAge());
        res.setLocked(user.isLocked());
        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedAt(user.getUpdatedAt());
        res.setCompany(null);
        if (user.getRole() != null) {
            res.setRole(new RestUserDTO.RoleUser(user.getRole().getId(), user.getRole().getName()));
        } else {
            res.setRole(null);
        }
        return res;
    }

    @Override
    @CacheEvict(value = {"users_email", "users_id"}, allEntries = true)
    public void handleDeleteUser(long id) throws IdInvalidException {
        if (id <= 0) {
            throw new IdInvalidException("ID người dùng không hợp lệ");
        }

        User currentUser = this.fetchUserById(id);
        if (currentUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        this.userRepository.deleteById(id);
    }

    @Override
    public ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(spec, pageable);

        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());

        List<RestUserDTO> listUser = pageUser.getContent()
                .stream()
                .map(this::convertToRestUserDTO)
                .collect(Collectors.toList());

        ResultPaginationDTO rs = new ResultPaginationDTO();
        rs.setMeta(meta);
        rs.setResult(listUser);

        return rs;
    }

    @Override
    @CacheEvict(value = {"users_email", "users_id"}, allEntries = true)
    public User updateUserRole(long userId, long roleId) throws IdInvalidException {
        User user = this.fetchUserById(userId);
        if (user == null) {
            throw new IdInvalidException("Người dùng với id = " + userId + " không tồn tại!");
        }
        Role role = this.roleRepository.findById(roleId).orElse(null);
        if (role == null) {
            throw new IdInvalidException("Vai trò với id = " + roleId + " không tồn tại!");
        }
        user.setRole(role);
        user.setUpdatedAt(Instant.now());
        user.setUpdatedBy(SecurityUtil.getCurrentUserLogin().orElse("system"));
        return this.userRepository.save(user);
    }

    @Override
    @CacheEvict(value = {"users_email", "users_id"}, allEntries = true)
    public User updateUserLock(long userId, Boolean locked) throws IdInvalidException {
        User user = this.fetchUserById(userId);
        if (user == null) {
            throw new IdInvalidException("Người dùng với id = " + userId + " không tồn tại!");
        }
        if (locked != null) {
            user.setLocked(locked);
        } else {
            user.setLocked(!user.isLocked());
        }
        user.setUpdatedAt(Instant.now());
        user.setUpdatedBy(SecurityUtil.getCurrentUserLogin().orElse("system"));
        return this.userRepository.save(user);
    }
}
