package com.example.demo.dto;

import com.example.demo.util.constant.GenderEnum;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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

    @NotNull(message = "ID người dùng không được để trống")
    @Min(value = 1, message = "ID người dùng phải lớn hơn 0")
    private Long id;

    @NotBlank(message = "Tên không được để trống")
    private String name;

    @Min(value = 1, message = "Tuổi phải lớn hơn 0")
    private int age;

    @NotNull(message = "Giới tính không được để trống")
    private GenderEnum gender;

    private String address;

    private CompanyUser company;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyUser {
        private long id;
    }
}

