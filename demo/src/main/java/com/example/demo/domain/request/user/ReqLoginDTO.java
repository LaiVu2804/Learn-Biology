package com.example.demo.domain.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqLoginDTO {

    @NotBlank(message = "Username/Email không được để trống")
    private String username;

    @NotBlank(message = "Password không được để trống")
    private String password;
}

