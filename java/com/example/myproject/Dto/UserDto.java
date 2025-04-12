package com.example.myproject.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {

    @Schema(description = "사용자 ID", example = "dongguk123")
    private String userId;

    @Schema(description = "사용자 비밀번호", example = "22ehdrnr")
    private String userPw;

    @Schema(description = "이름", example = "이동국")
    private String userName;

    @Schema(description = "닉네임", example = "동국이")
    private String nickname;

    @Schema(description = "전화번호", example = "01012345678")
    private String phone;

    @Schema(description = "생성일", example = "2025-04-05T15:00:00")
    private String createdDt;

    @Schema(description = "수정일", example = "2025-04-05T15:00:00")
    private String updatedDt;
}