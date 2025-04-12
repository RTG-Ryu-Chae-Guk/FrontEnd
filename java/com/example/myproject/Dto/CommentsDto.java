package com.example.myproject.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommentsDto {
    @Schema(description = "댓글 ID", example = "1")
    private long commentId;

    @Schema(description = "댓글 내용", example = "댓글 남겨요.")
    private String content;

    @Schema(description = "댓글 생성일자", example = "2025-04-09 17:05:15")
    private LocalDateTime createdDt;

    @Schema(description = "댓글 수정일자", example = "2025-04-09 17:05:17")
    private LocalDateTime updatedDt;

    @Schema(description = "(게시)글 ID", example = "1")
    private long diaryId;

    @Schema(description = "댓글 작성자", example = "euijun")
    private String userId;
}
