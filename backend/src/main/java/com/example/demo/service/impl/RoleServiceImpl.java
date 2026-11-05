package com.example.demo.service.impl;

import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.repository.PermissionRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.service.RoleService;
import com.example.demo.util.SecurityUtil;
import com.example.demo.util.error.IdInvalidException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleServiceImpl(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public boolean existsByName(String name) {
        return this.roleRepository.existsByName(name);
    }

    @Override
    public Role handleCreateRole(Role role) throws IdInvalidException {
        if (this.existsByName(role.getName())) {
            throw new IdInvalidException("Vai trò " + role.getName() + " đã tồn tại!");
        }

        if (role.getPermissions() != null) {
            List<Long> reqPermissions = role.getPermissions()
                    .stream()
                    .map(Permission::getId)
                    .collect(Collectors.toList());
            List<Permission> dbPermissions = this.permissionRepository.findByIdIn(reqPermissions);
            role.setPermissions(dbPermissions);
        }

        return this.roleRepository.save(role);
    }

    @Override
    public Role handleUpdateRole(Role role) throws IdInvalidException {
        Role currentRole = this.fetchById(role.getId());
        if (currentRole == null) {
            throw new IdInvalidException("Role với id = " + role.getId() + " không tồn tại!");
        }

        if (role.getPermissions() != null) {
            List<Long> reqPermissions = role.getPermissions()
                    .stream()
                    .map(Permission::getId)
                    .collect(Collectors.toList());
            List<Permission> dbPermissions = this.permissionRepository.findByIdIn(reqPermissions);
            currentRole.setPermissions(dbPermissions);
        }

        currentRole.setName(role.getName());
        currentRole.setDescription(role.getDescription());
        currentRole.setActive(role.isActive());
        currentRole.setUpdatedAt(Instant.now());
        currentRole.setUpdatedBy(SecurityUtil.getCurrentUserLogin().orElse("system"));

        return this.roleRepository.save(currentRole);
    }

    @Override
    public Role fetchById(long id) {
        return this.roleRepository.findById(id).orElse(null);
    }

    @Override
    public void handleDeleteRole(long id) throws IdInvalidException {
        Role role = this.fetchById(id);
        if (role == null) {
            throw new IdInvalidException("Role với id = " + id + " không tồn tại!");
        }
        this.roleRepository.delete(role);
    }

    @Override
    public ResultPaginationDTO fetchAll(Specification<Role> spec, Pageable pageable) {
        Page<Role> pRole = this.roleRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pRole.getTotalPages());
        meta.setTotal(pRole.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pRole.getContent());
        return rs;
    }

    @Override
    public List<Role> getAllRoles() {
        return this.roleRepository.findAll();
    }
}

