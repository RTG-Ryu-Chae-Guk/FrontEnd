package com.example.myproject.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RecommentDto {
    @Schema(description = "대댓글 ID", example = "1")
    private long recommentId;

    @Schema(description = "대댓글 내용", example = "저도 그렇게 생각합니다.")
    private String content;

    @Schema(description = "대댓글 생성일자", example = "2025-04-10 15:00:00")
    private LocalDateTime createdDt;

    @Schema(description = "대댓글 수정일자", example = "2025-04-10 15:00:00")
    private LocalDateTime updatedDt;

    @Schema(description = "댓글 ID", example = "1")
    private long commentId;

    @Schema(description = "대댓글 작성자 ID", example = "euijun")
    private String userId;
}
