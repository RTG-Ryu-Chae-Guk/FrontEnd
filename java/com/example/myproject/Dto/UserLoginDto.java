package com.example.myproject.Dto;

import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
public class UserLoginDto {

    @Schema(description = "사용자 ID", example = "dongguk123")
    private String userId;

    @Schema(description = "비밀번호", example = "1234")
    private String userPw;
}