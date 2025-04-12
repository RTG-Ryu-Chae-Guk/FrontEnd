package com.example.myproject.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class DiaryDto {

    @Schema(description = "글 ID", example = "1")
    private Long boardId;

    @Schema(description = "글 작성자 ID", example = "euijun")
    private String userId;

    @Schema(description = "글 제목", example = "오늘은 250407")
    private String title;

    @Schema(description = "글 내용", example = "오늘은 25년 4월 7일 월요일이다. 시간은 오후 3시40분 나른하다.")
    private String content;

    @Schema(description = "글 작성일자", example = "2025-04-07 15:40:47")
    private LocalDateTime createdDt;

    @Schema(description = "글 수정일자", example = "2025-04-07 15:40:47")
    private LocalDateTime updatedDt;
}
