package com.example.demo.service.impl;

import com.example.demo.domain.request.user.ReqCreateUserDTO;
import com.example.demo.domain.request.user.ReqUpdateUserDTO;
import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.domain.response.user.RestCreateUserDTO;
import com.example.demo.domain.response.user.RestUpdateUserDTO;
import com.example.demo.domain.response.user.RestUserDTO;
import com.example.demo.entity.User;
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
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    @Override
    @CacheEvict(value = {"users_email", "users_id"}, allEntries = true)
    public User handleCreateUser(User user) {
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
        currentUser.setName(reqUser.getName());
        currentUser.setAge(reqUser.getAge());
        currentUser.setGender(reqUser.getGender());
        currentUser.setAddress(reqUser.getAddress());
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
        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedAt(user.getUpdatedAt());
        res.setCompany(null);
        res.setRole(null);
        return res;
    }

    @Override
    @CacheEvict(value = {"users_email", "users_id"}, allEntries = true)
    public void handleDeleteUser(long id) throws IdInvalidException {
        // Bước 1: Kiểm tra id hợp lệ (> 0)
        if (id <= 0) {
            throw new IdInvalidException("ID người dùng không hợp lệ");
        }

        // Bước 2: Tìm kiếm User theo id
        User currentUser = this.fetchUserById(id);
        if (currentUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        // Bước 3: Xóa người dùng khỏi DB
        this.userRepository.deleteById(id);
    }

    @Override
    public ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable) {
        // Bước 1 (Truy vấn phân trang): Gọi userRepository.findAll(spec, pageable) -> nhận về Page<User>
        Page<User> pageUser = this.userRepository.findAll(spec, pageable);

        // Bước 2 (Xây dựng Metadata phân trang):
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());

        // Bước 3 (Chuyển đổi danh sách dữ liệu): Map toàn bộ list User entity sang List<RestUserDTO>
        List<RestUserDTO> listUser = pageUser.getContent()
                .stream()
                .map(this::convertToRestUserDTO)
                .collect(Collectors.toList());

        // Bước 4 (Đóng gói ResultPaginationDTO): Gán Meta và List<RestUserDTO> vào DTO kết quả
        ResultPaginationDTO rs = new ResultPaginationDTO();
        rs.setMeta(meta);
        rs.setResult(listUser);

        return rs;
    }
}
