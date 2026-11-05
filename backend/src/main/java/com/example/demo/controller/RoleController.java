package com.example.demo.controller;

import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.entity.Role;
import com.example.demo.service.RoleService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Create a new role")
    public ResponseEntity<Role> createRole(@Valid @RequestBody Role role) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.handleCreateRole(role));
    }

    @PutMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Update a role")
    public ResponseEntity<Role> updateRole(@Valid @RequestBody Role role) throws IdInvalidException {
        return ResponseEntity.ok(this.roleService.handleUpdateRole(role));
    }

    @GetMapping("/roles/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @ApiMessage("Fetch role by id")
    public ResponseEntity<Role> getRoleById(@PathVariable("id") long id) throws IdInvalidException {
        Role role = this.roleService.fetchById(id);
        if (role == null) {
            throw new IdInvalidException("Role với id = " + id + " không tồn tại!");
        }
        return ResponseEntity.ok(role);
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @ApiMessage("Fetch all roles with pagination")
    public ResponseEntity<ResultPaginationDTO> getAllRoles(
            @Filter Specification<Role> spec,
            Pageable pageable) {
        return ResponseEntity.ok(this.roleService.fetchAll(spec, pageable));
    }

    @GetMapping("/roles/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @ApiMessage("Fetch all roles list")
    public ResponseEntity<List<Role>> getAllRolesList() {
        return ResponseEntity.ok(this.roleService.getAllRoles());
    }

    @DeleteMapping("/roles/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Delete a role")
    public ResponseEntity<Void> deleteRole(@PathVariable("id") long id) throws IdInvalidException {
        this.roleService.handleDeleteRole(id);
        return ResponseEntity.ok(null);
    }
}

