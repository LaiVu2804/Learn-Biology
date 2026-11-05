package com.example.demo.service;

import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.entity.Role;
import com.example.demo.util.error.IdInvalidException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface RoleService {

    boolean existsByName(String name);

    Role handleCreateRole(Role role) throws IdInvalidException;

    Role handleUpdateRole(Role role) throws IdInvalidException;

    Role fetchById(long id);

    void handleDeleteRole(long id) throws IdInvalidException;

    ResultPaginationDTO fetchAll(Specification<Role> spec, Pageable pageable);

    List<Role> getAllRoles();
}

