package com.example.demo.controller;

import com.example.demo.domain.request.user.ReqCreateUserDTO;
import com.example.demo.domain.request.user.ReqUpdateUserDTO;
import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.domain.response.user.RestCreateUserDTO;
import com.example.demo.domain.response.user.RestUpdateUserDTO;
import com.example.demo.domain.response.user.RestUserDTO;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import com.example.demo.util.annotation.ApiMessage;
import com.example.demo.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    @ApiMessage("Create a new user success")
    public ResponseEntity<RestCreateUserDTO> createNewUser(@Valid @RequestBody ReqCreateUserDTO reqUser)
            throws IdInvalidException {
        RestCreateUserDTO newUser = this.userService.handleCreateUser(reqUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @GetMapping("/users/{id}")
    @ApiMessage("Fetch user by id success")
    public ResponseEntity<RestUserDTO> getUserById(@PathVariable("id") long id) throws IdInvalidException {
        // Bước 1: Kiểm tra tính hợp lệ của ID
        if (id <= 0) {
            throw new IdInvalidException("ID người dùng không hợp lệ");
        }

        // Bước 2: Truy vấn User từ database (hoặc Redis Cache)
        User currentUser = this.userService.fetchUserById(id);

        // Bước 3: Kiểm tra sự tồn tại của người dùng
        if (currentUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        // Bước 4: Ánh xạ User sang RestUserDTO và trả về HTTP 200 OK
        return ResponseEntity.ok(this.userService.convertToRestUserDTO(currentUser));
    }

    @PutMapping("/users")
    @ApiMessage("Update user success !")
    public ResponseEntity<RestUpdateUserDTO> updateUser(@Valid @RequestBody ReqUpdateUserDTO reqUser)
            throws IdInvalidException {
        RestUpdateUserDTO updatedUser = this.userService.handleUpdateUser(reqUser);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    @ApiMessage("Delete a user success")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") long id) throws IdInvalidException {
        this.userService.handleDeleteUser(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/users")
    @ApiMessage("Fetch all users with pagination success")
    public ResponseEntity<ResultPaginationDTO> getAllUser(
            @Filter Specification<User> spec,
            Pageable pageable) {
        return ResponseEntity.ok(this.userService.fetchAllUser(spec, pageable));
    }
}
