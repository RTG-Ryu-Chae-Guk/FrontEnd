package com.example.myproject.Dto;

import com.example.myproject.Common.FollowStatus;
import com.example.myproject.Common.FriendStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FriendDto {
    @Schema(description = "친구목록ID", example = "1")
    private long friendId;

    @Schema(description = "친구 요청 처리 상태", example = "요청")
    private FriendStatus friendStatus;

    @Schema(description = "팔로잉 상태", example = "FRIEND")
    private FollowStatus followStatus;

    @Schema(description = "친구 관계 생성일자", example = "2025-04-07 15:40:47")
    private LocalDateTime createdDt;

    @Schema(description = "친구 관계 수정일자", example = "2025-04-07 15:40:47")
    private LocalDateTime updatedDt;

    @Schema(description = "사용자 유저 ID", example = "euijun")
    private String userId;

    @Schema(description = "친구 유저 ID", example = "dongguk")
    private String friendUserId;
}
