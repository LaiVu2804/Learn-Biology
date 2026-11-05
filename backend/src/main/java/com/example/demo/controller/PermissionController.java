package com.example.demo.controller;

import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.entity.Permission;
import com.example.demo.service.PermissionService;
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
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @PostMapping("/permissions")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Create a new permission")
    public ResponseEntity<Permission> createPermission(@Valid @RequestBody Permission permission) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.permissionService.handleCreate(permission));
    }

    @PutMapping("/permissions")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Update a permission")
    public ResponseEntity<Permission> updatePermission(@Valid @RequestBody Permission permission) throws IdInvalidException {
        return ResponseEntity.ok(this.permissionService.handleUpdate(permission));
    }

    @GetMapping("/permissions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Fetch permission by id")
    public ResponseEntity<Permission> getPermissionById(@PathVariable("id") long id) throws IdInvalidException {
        Permission p = this.permissionService.fetchById(id);
        if (p == null) {
            throw new IdInvalidException("Permission với id = " + id + " không tồn tại!");
        }
        return ResponseEntity.ok(p);
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Fetch all permissions with pagination")
    public ResponseEntity<ResultPaginationDTO> getAllPermissions(
            @Filter Specification<Permission> spec,
            Pageable pageable) {
        return ResponseEntity.ok(this.permissionService.fetchAll(spec, pageable));
    }

    @GetMapping("/permissions/all")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Fetch all permissions list")
    public ResponseEntity<List<Permission>> getAllPermissionsList() {
        return ResponseEntity.ok(this.permissionService.getAllPermissions());
    }

    @DeleteMapping("/permissions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Delete a permission")
    public ResponseEntity<Void> deletePermission(@PathVariable("id") long id) throws IdInvalidException {
        this.permissionService.handleDelete(id);
        return ResponseEntity.ok(null);
    }
}

