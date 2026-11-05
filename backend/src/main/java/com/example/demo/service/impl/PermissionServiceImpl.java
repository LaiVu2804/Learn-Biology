package com.example.demo.service.impl;

import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.entity.Permission;
import com.example.demo.repository.PermissionRepository;
import com.example.demo.service.PermissionService;
import com.example.demo.util.SecurityUtil;
import com.example.demo.util.error.IdInvalidException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionServiceImpl(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Override
    public boolean isPermissionExist(Permission p) {
        return this.permissionRepository.existsByApiPathAndMethod(p.getApiPath(), p.getMethod());
    }

    @Override
    public Permission handleCreate(Permission p) throws IdInvalidException {
        if (this.isPermissionExist(p)) {
            throw new IdInvalidException("Permission với path " + p.getApiPath() + " và method " + p.getMethod() + " đã tồn tại!");
        }
        return this.permissionRepository.save(p);
    }

    @Override
    public Permission handleUpdate(Permission p) throws IdInvalidException {
        Permission currentPermission = this.fetchById(p.getId());
        if (currentPermission == null) {
            throw new IdInvalidException("Permission với id = " + p.getId() + " không tồn tại!");
        }

        currentPermission.setName(p.getName());
        currentPermission.setApiPath(p.getApiPath());
        currentPermission.setMethod(p.getMethod());
        currentPermission.setModule(p.getModule());
        currentPermission.setUpdatedAt(Instant.now());
        currentPermission.setUpdatedBy(SecurityUtil.getCurrentUserLogin().orElse("system"));

        return this.permissionRepository.save(currentPermission);
    }

    @Override
    public Permission fetchById(long id) {
        return this.permissionRepository.findById(id).orElse(null);
    }

    @Override
    public void handleDelete(long id) throws IdInvalidException {
        Permission p = this.fetchById(id);
        if (p == null) {
            throw new IdInvalidException("Permission với id = " + id + " không tồn tại!");
        }
        // Gỡ bỏ quan hệ nhiều-nhiều trước khi xóa
        if (p.getRoles() != null) {
            p.getRoles().forEach(role -> role.getPermissions().remove(p));
        }
        this.permissionRepository.delete(p);
    }

    @Override
    public ResultPaginationDTO fetchAll(Specification<Permission> spec, Pageable pageable) {
        Page<Permission> pPerm = this.permissionRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pPerm.getTotalPages());
        meta.setTotal(pPerm.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pPerm.getContent());
        return rs;
    }

    @Override
    public List<Permission> getAllPermissions() {
        return this.permissionRepository.findAll();
    }
}

