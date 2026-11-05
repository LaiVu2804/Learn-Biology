package com.example.demo.controller;

import com.example.demo.domain.request.user.ReqCreateUserDTO;
import com.example.demo.domain.request.user.ReqUpdateUserDTO;
import com.example.demo.domain.request.user.ReqUpdateUserLockDTO;
import com.example.demo.domain.request.user.ReqUpdateUserRoleDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Create a new user success")
    public ResponseEntity<RestCreateUserDTO> createNewUser(@Valid @RequestBody ReqCreateUserDTO reqUser)
            throws IdInvalidException {
        RestCreateUserDTO newUser = this.userService.handleCreateUser(reqUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @GetMapping("/users/{id}")
    @ApiMessage("Fetch user by id success")
    public ResponseEntity<RestUserDTO> getUserById(@PathVariable("id") long id) throws IdInvalidException {
        if (id <= 0) {
            throw new IdInvalidException("ID người dùng không hợp lệ");
        }

        User currentUser = this.userService.fetchUserById(id);
        if (currentUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        return ResponseEntity.ok(this.userService.convertToRestUserDTO(currentUser));
    }

    @PutMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Update user success !")
    public ResponseEntity<RestUpdateUserDTO> updateUser(@Valid @RequestBody ReqUpdateUserDTO reqUser)
            throws IdInvalidException {
        RestUpdateUserDTO updatedUser = this.userService.handleUpdateUser(reqUser);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Update user role success")
    public ResponseEntity<RestUserDTO> updateUserRole(
            @PathVariable("id") long id,
            @RequestBody ReqUpdateUserRoleDTO req) throws IdInvalidException {
        User updated = this.userService.updateUserRole(id, req.getRoleId());
        return ResponseEntity.ok(this.userService.convertToRestUserDTO(updated));
    }

    @PutMapping("/users/{id}/lock")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Update user lock status success")
    public ResponseEntity<RestUserDTO> updateUserLock(
            @PathVariable("id") long id,
            @RequestBody(required = false) ReqUpdateUserLockDTO req) throws IdInvalidException {
        Boolean locked = req != null ? req.getLocked() : null;
        User updated = this.userService.updateUserLock(id, locked);
        return ResponseEntity.ok(this.userService.convertToRestUserDTO(updated));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Delete a user success")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") long id) throws IdInvalidException {
        this.userService.handleDeleteUser(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @ApiMessage("Fetch all users with pagination success")
    public ResponseEntity<ResultPaginationDTO> getAllUser(
            @Filter Specification<User> spec,
            Pageable pageable) {
        return ResponseEntity.ok(this.userService.fetchAllUser(spec, pageable));
    }
}
