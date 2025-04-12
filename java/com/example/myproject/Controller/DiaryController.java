package com.example.myproject.Controller;

import com.example.myproject.Dto.DiaryDto;
import com.example.myproject.Entity.Diary;
import com.example.myproject.Service.DiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diary")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Diary API", description = "다이어리 관련 API")
public class DiaryController {
    private final DiaryService diaryService;

    public DiaryController(DiaryService diaryService){
        this.diaryService = diaryService;
    }

    @Operation(summary = "다이어리 글 작성", description = "사용자가 다이어리 글을 작성합니다.")
    @PostMapping("/write/{userId}")
    public ResponseEntity<String> writeDiary(@PathVariable String userId, @RequestBody DiaryDto dto){
        dto.setUserId(userId);
        diaryService.writeBoard(dto);
        return ResponseEntity.ok("다이어리가 작성되었습니다.");
    }

    @Operation(summary = "다이어리 글 단일 조회", description = "작성된 게시글을 조회합니다.")
    @GetMapping("/view/{userId}/{diaryId}")
    public ResponseEntity<Diary> viewOneDiary(@PathVariable String userId, @PathVariable long diaryId){
        Diary diary = diaryService.getArticle(diaryId);
        return ResponseEntity.ok(diary);
    }

    @Operation(summary = "다이어리 목록 조회", description = "작성된 게시글들을 최근 작성일 순으로, 한 페이지 당 10개의 게시글이 보여지게끔 합니다.")
    @GetMapping("/view")
    public Page<Diary> viewAllDiary(@RequestParam(defaultValue = "0") int page){
        return diaryService.getArticlesPaged(page);
    }

    @Operation(summary = "다이어리 글 수정", description = "작성된 게시글을 수정합니다.")
    @PutMapping("/edit/{userId}/{diaryId}")
    public ResponseEntity<String> editDiary(@PathVariable String userId, @PathVariable long diaryId, @RequestBody DiaryDto dto){
        dto.setBoardId(diaryId);
        diaryService.editArticle(dto);
        return ResponseEntity.ok("다이어리가 수정되었습니다.");
    }

    @Operation(summary = "다이어리 글 삭제", description = "작성했던 게시글을 삭제합니다.")
    @DeleteMapping("/delete/{userId}/{diaryId}")
    public ResponseEntity<String> deleteDiary(@PathVariable String userId, @PathVariable long diaryId){
        diaryService.deleteArticle(diaryId);
        return ResponseEntity.ok("다이어리가 삭제되었습니다.");
    }
}
