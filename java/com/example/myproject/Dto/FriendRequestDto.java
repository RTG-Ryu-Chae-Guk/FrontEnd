package com.example.myproject.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestDto {
    @Schema(description = "친구목록ID", example = "1")
    private long friendId;

    @Schema(description = "사용자 유저 ID", example = "euijun")
    private String userId;

    @Schema(description = "친구 유저 ID", example = "june")
    private String friendUserId;
}
