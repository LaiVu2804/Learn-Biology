package com.example.demo.domain.request.user;

import com.example.demo.util.constant.GenderEnum;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqUpdateUserDTO {

    @NotNull(message = "ID không được để trống")
    private Long id;

    private String name;

    private int age;

    private GenderEnum gender;

    private String address;

}

