package com.example.demo.service;

import com.example.demo.domain.request.user.ReqCreateUserDTO;
import com.example.demo.domain.request.user.ReqUpdateUserDTO;
import com.example.demo.domain.response.ResultPaginationDTO;
import com.example.demo.domain.response.user.RestCreateUserDTO;
import com.example.demo.domain.response.user.RestUpdateUserDTO;
import com.example.demo.domain.response.user.RestUserDTO;
import com.example.demo.entity.User;
import com.example.demo.util.error.IdInvalidException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface UserService {

    boolean isEmailExist(String email);

    User handleCreateUser(User user);

    RestCreateUserDTO handleCreateUser(ReqCreateUserDTO reqUser) throws IdInvalidException;

    User handleGetUserByUserName(String userName);

    default User handleGetUserByUsername(String username) {
        return handleGetUserByUserName(username);
    }

    User getUserByRefreshTokenAndEmail(String token, String email);

    RestCreateUserDTO convertToRestCreateUserDTO(User user);

    User fetchUserById(long id);

    RestUserDTO convertToRestUserDTO(User user);

    RestUpdateUserDTO handleUpdateUser(ReqUpdateUserDTO reqUser) throws IdInvalidException;

    RestUpdateUserDTO convertToRestUpdateUserDTO(User user);

    void handleDeleteUser(long id) throws IdInvalidException;

    ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable);
}
