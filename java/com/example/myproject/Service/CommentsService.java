package com.example.myproject.Service;

import com.example.myproject.Dto.CommentsDto;
import com.example.myproject.Entity.Comments;
import com.example.myproject.Entity.Diary;
import com.example.myproject.Entity.User;
import com.example.myproject.Repository.CommentsRepository;
import com.example.myproject.Repository.DiaryRepository;
import com.example.myproject.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentsService {
    private final CommentsRepository commentsRepository;
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    //댓글 작성
    public void writeReply(CommentsDto dto){
        Optional<User> optionalUser = userRepository.findById(dto.getUserId());
        Optional<Diary> optionalDiary = diaryRepository.findByBoardId(dto.getDiaryId());

        if(optionalUser.isEmpty()){
            throw new RuntimeException("댓글 작성 권한이 없습니다.");
        }
        if(optionalDiary.isEmpty()){
            throw new RuntimeException("해당 게시글은 존재하지 않아 댓글을 작성할 수 없습니다.");
        }

        Comments comments = new Comments();
        comments.setContent(dto.getContent());
        comments.setUser(optionalUser.get());
        comments.setDiary(optionalDiary.get());
        commentsRepository.save(comments);
    }

    //댓글 목록 조회
    public Page<Comments> getReplyByPaged(long diaryId, int page){
        Optional<Diary> optionalDiary = diaryRepository.findByBoardId(diaryId);
        Diary diary = null;
        if(optionalDiary.isEmpty()){
            throw new RuntimeException("해당 게시글을 찾을 수 없습니다.");
        } else{
            diary = optionalDiary.get();
        }
        //페이지 번호는 0부터 시작 (즉, page=0이면 첫 페이지)
        PageRequest pageRequest = PageRequest.of(page, 10, Sort.by(Sort.Direction.ASC, "createdDt"));
        return commentsRepository.findByDiaryOrderByCreatedDtAsc(diary, pageRequest);
    }

    //댓글 수정
    public void editReply(CommentsDto dto){
        Optional<Comments> optionalComments = commentsRepository.findByCommentId(dto.getCommentId());
        Optional<User> optionalUser = userRepository.findById(dto.getUserId());
        Comments comments = null;
        if(optionalUser.isEmpty()){
            throw new RuntimeException("수정 권한이 없습니다.");
        }
        if(optionalComments.isEmpty()){
            throw new RuntimeException("해당 댓글을 찾을 수 없습니다.");
        }

        comments = optionalComments.get();
        if(comments.getUser() != optionalUser.get()){
            throw new RuntimeException("수정 권한이 없습니다.");
        }
        comments.setContent(dto.getContent());
        commentsRepository.save(comments);
    }

    //댓글 삭제
    public void deleteReply(long commentId){
        Optional<Comments> optionalComments = commentsRepository.findByCommentId(commentId);
        if(optionalComments.isEmpty()){
            throw new RuntimeException("해당 댓글을 찾을 수 없습니다.");
        }
        commentsRepository.deleteById(commentId);
    }
}
