package com.example.demo.service.impl;

import com.example.demo.dto.ReqCreateUserDTO;
import com.example.demo.dto.ReqUpdateUserDTO;
import com.example.demo.dto.ResCreateUserDTO;
import com.example.demo.dto.ResUpdateDTO;
import com.example.demo.dto.RestCreateUserDTO;
import com.example.demo.dto.RestUserDTO;
import com.example.demo.dto.ResultPaginationDTO;
import com.example.demo.entity.Company;
import com.example.demo.entity.User;
import com.example.demo.repository.CompanyRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import com.example.demo.util.SecurityUtil;
import com.example.demo.util.error.IdInvalidException;
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
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    @Override
    public User handleCreateUser(User user) {
        return this.userRepository.save(user);
    }

    @Override
    public RestCreateUserDTO handleCreateUser(ReqCreateUserDTO reqUser) throws IdInvalidException {
        // Bước 1: Kiểm tra trùng email
        if (this.isEmailExist(reqUser.getEmail())) {
            throw new IdInvalidException("Email: " + reqUser.getEmail() + " đã tồn tại, vui lòng nhập email khác !");
        }

        // Bước 2: Kiểm tra Company nếu được truyền lên
        Company company = null;
        if (reqUser.getCompany() != null) {
            Optional<Company> companyOptional = this.companyRepository.findById(reqUser.getCompany().getId());
            if (companyOptional.isEmpty()) {
                throw new IdInvalidException("Company với id = " + reqUser.getCompany().getId() + " không tồn tại");
            }
            company = companyOptional.get();
        }

        // Bước 3: Băm mật khẩu bằng BCrypt
        String hashPassword = this.passwordEncoder.encode(reqUser.getPassword());

        // Bước 4: Khởi tạo và lưu User Entity
        User user = new User();
        user.setName(reqUser.getName());
        user.setEmail(reqUser.getEmail());
        user.setPassword(hashPassword);
        user.setAge(reqUser.getAge());
        user.setGender(reqUser.getGender());
        user.setAddress(reqUser.getAddress());
        user.setCompany(company);

        User savedUser = this.userRepository.save(user);

        // Bước 5: Chuyển đổi sang RestCreateUserDTO (không lộ password/refreshToken)
        return this.convertToRestCreateUserDTO(savedUser);
    }

    @Override
    public ResUpdateDTO handleUpdateUser(ReqUpdateUserDTO reqUser) throws IdInvalidException {
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

        // Bước 3: Cập nhật Company liên kết
        if (reqUser.getCompany() != null && reqUser.getCompany().getId() > 0) {
            Optional<Company> companyOptional = this.companyRepository.findById(reqUser.getCompany().getId());
            if (companyOptional.isEmpty()) {
                throw new IdInvalidException("Company với id = " + reqUser.getCompany().getId() + " không tồn tại");
            }
            currentUser.setCompany(companyOptional.get());
        } else {
            currentUser.setCompany(null);
        }

        // Bước 4: Lưu vào DB
        User updatedUser = this.userRepository.save(currentUser);

        // Bước 5: Chuyển đổi DTO phản hồi
        return this.convertToResUpdateDTO(updatedUser);
    }

    @Override
    public User handleGetUserByUserName(String userName) {
        return this.userRepository.findByEmail(userName).orElse(null);
    }

    @Override
    public void updateUserToken(String token, String email) {
        User currentUser = this.handleGetUserByUserName(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }

    @Override
    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }

    @Override
    public User fetchUserById(long id) {
        return this.userRepository.findById(id).orElse(null);
    }

    @Override
    public ResCreateUserDTO convertToResCreateUserDTO(User user) {
        ResCreateUserDTO res = new ResCreateUserDTO();
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setAge(user.getAge());
        res.setCreatedAt(user.getCreatedAt());
        res.setCreatedBy(user.getCreatedBy());
        res.setGender(user.getGender());
        res.setAddress(user.getAddress());
        return res;
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
        if (user.getCompany() != null) {
            res.setCompany(new RestCreateUserDTO.CompanyUser(
                    user.getCompany().getId(),
                    user.getCompany().getName()
            ));
        }
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

        if (user.getCompany() != null) {
            res.setCompany(new RestUserDTO.CompanyUser(
                    user.getCompany().getId(),
                    user.getCompany().getName()
            ));
        }

        return res;
    }

    @Override
    public ResUpdateDTO convertToResUpdateDTO(User user) {
        ResUpdateDTO res = new ResUpdateDTO();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setGender(user.getGender());
        res.setAddress(user.getAddress());
        res.setAge(user.getAge());
        res.setUpdatedAt(user.getUpdatedAt());
        res.setUpdatedBy(user.getUpdatedBy());

        if (user.getCompany() != null) {
            res.setCompany(new ResUpdateDTO.CompanyUser(
                    user.getCompany().getId(),
                    user.getCompany().getName()
            ));
        }

        return res;
    }

    @Override
    public void handleDeleteUser(long id) throws IdInvalidException {
        // Bước 1 (Kiểm tra ID): Kiểm tra id hợp lệ (> 0)
        if (id <= 0) {
            throw new IdInvalidException("ID người dùng không hợp lệ");
        }

        // Bước 2 (Kiểm tra tồn tại): Tìm kiếm User theo id
        User currentUser = this.fetchUserById(id);
        if (currentUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        // Bước 3 (Xử lý liên kết dữ liệu / Cascade):
        // Ngắt liên kết công ty nếu có để đảm bảo toàn vẹn dữ liệu
        if (currentUser.getCompany() != null) {
            currentUser.setCompany(null);
            this.userRepository.save(currentUser);
        }

        // Bước 4: Xóa người dùng khỏi DB
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
