package com.example.demo.service;

import com.example.demo.dto.ReqCreateUserDTO;
import com.example.demo.dto.ReqUpdateUserDTO;
import com.example.demo.dto.ResCreateUserDTO;
import com.example.demo.dto.ResUpdateDTO;
import com.example.demo.dto.RestCreateUserDTO;
import com.example.demo.dto.RestUserDTO;
import com.example.demo.dto.ResultPaginationDTO;
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

    void updateUserToken(String token, String email);

    User getUserByRefreshTokenAndEmail(String token, String email);

    ResCreateUserDTO convertToResCreateUserDTO(User user);

    RestCreateUserDTO convertToRestCreateUserDTO(User user);

    User fetchUserById(long id);

    RestUserDTO convertToRestUserDTO(User user);

    ResUpdateDTO handleUpdateUser(ReqUpdateUserDTO reqUser) throws IdInvalidException;

    ResUpdateDTO convertToResUpdateDTO(User user);

    void handleDeleteUser(long id) throws IdInvalidException;

    ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable);
}
