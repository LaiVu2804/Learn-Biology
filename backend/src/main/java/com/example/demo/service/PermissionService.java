package com.example.demo.service;

import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.entity.Permission;
import com.example.demo.util.error.IdInvalidException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface PermissionService {

    boolean isPermissionExist(Permission p);

    Permission handleCreate(Permission p) throws IdInvalidException;

    Permission handleUpdate(Permission p) throws IdInvalidException;

    Permission fetchById(long id);

    void handleDelete(long id) throws IdInvalidException;

    ResultPaginationDTO fetchAll(Specification<Permission> spec, Pageable pageable);

    List<Permission> getAllPermissions();
}

