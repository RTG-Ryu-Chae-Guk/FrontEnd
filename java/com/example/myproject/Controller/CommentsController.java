package com.example.myproject.Controller;

import com.example.myproject.Dto.CommentsDto;
import com.example.myproject.Entity.Comments;
import com.example.myproject.Service.CommentsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diary/comments")
@Tag(name = "Comments API", description = "댓글 관련 API")
public class CommentsController {
    private final CommentsService commentsService;

    public CommentsController(CommentsService commentsService){
        this.commentsService = commentsService;
    }

    @Operation(summary = "댓글 작성 기능", description = "사용자가 게시글에 댓글을 작성합니다.")
    @PostMapping("/write/{diaryId}")
    public ResponseEntity<String> writeComment(@PathVariable long diaryId, @RequestBody CommentsDto dto){
        dto.setDiaryId(diaryId);
        commentsService.writeReply(dto);
        return ResponseEntity.ok("댓글이 작성되었습니다.");
    }

    @Operation(summary = "댓글 수정 기능", description = "사용자가 작성한 댓글을 수정합니다.")
    @PutMapping("/edit/{diaryId}/{commentId}")
    public ResponseEntity<String> editComment(@PathVariable long diaryId, @PathVariable long commentId,
                                              @RequestBody CommentsDto dto){
        dto.setCommentId(commentId);
        commentsService.editReply(dto);
        return ResponseEntity.ok("댓글이 수정되었습니다.");
    }

    @Operation(summary = "댓글 삭제 기능", description = "사용자가 작성한 댓글을 삭제합니다.")
    @DeleteMapping("/delete/{diaryId}/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable long diaryId, @PathVariable long commentId){
        commentsService.deleteReply(commentId);
        return ResponseEntity.ok("댓글이 삭제되었습니다.");
    }

    @Operation(summary = "댓글 조회 기능", description = "사용자가 댓글을 생성일자 순으로 한 페이지당 10개씩 볼 수 있습니다.")
    @GetMapping("/view/{diaryId}")
    public Page<Comments> viewComments(@PathVariable long diaryId, @RequestParam(defaultValue = "0") int page){
        return commentsService.getReplyByPaged(diaryId, page);
    }
}
