package com.example.myproject.Service;

import com.example.myproject.Dto.RecommentDto;
import com.example.myproject.Entity.Comments;
import com.example.myproject.Entity.Recomment;
import com.example.myproject.Entity.User;
import com.example.myproject.Repository.CommentsRepository;
import com.example.myproject.Repository.RecommentRepository;
import com.example.myproject.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecommentService {
    private final RecommentRepository recommentRepository;
    private final UserRepository userRepository;
    private final CommentsRepository commentsRepository;

    //대댓글 작성
    public void postRecomment(RecommentDto dto){
        Optional<User> optionalUser = userRepository.findById(dto.getUserId());
        Optional<Comments> optionalComments = commentsRepository.findByCommentId(dto.getCommentId());

        if(optionalUser.isEmpty()){
            throw new RuntimeException("작성 권한이 없습니다.");
        }
        if(optionalComments.isEmpty()){
            throw new RuntimeException("해당 댓글을 찾을 수 없습니다.");
        }

        Recomment recomment = new Recomment();
        recomment.setContent(dto.getContent());
        recomment.setUser(optionalUser.get());
        recomment.setComments(optionalComments.get());
        recommentRepository.save(recomment);
    }

    //대댓글 목록 조회
    public Page<Recomment> getRecommentByPaged(long commentId, int page){
        Optional<Comments> optionalComments = commentsRepository.findByCommentId(commentId);
        Comments comments = null;
        if(optionalComments.isEmpty()){
            throw new RuntimeException("해당 댓글을 찾을 수 없습니다.");
        } else{
            comments = optionalComments.get();
        }
        //페이지 번호는 0부터 시작 (즉, page=0이면 첫 페이지)
        PageRequest pageRequest = PageRequest.of(page, 10, Sort.by(Sort.Direction.ASC, "createdDt"));
        return recommentRepository.findByCommentsOrderByCreatedDtAsc(comments, pageRequest);
    }

    //대댓글 수정
    public void putRecomment(RecommentDto dto){
        Optional<User> optionalUser = userRepository.findById(dto.getUserId());
        Optional<Recomment> optionalRecomment = recommentRepository.findById(dto.getRecommentId());
        Recomment recomment = null;
        if(optionalUser.isEmpty()){
            throw new RuntimeException("수정 권한이 없습니다.");
        }
        if(optionalRecomment.isEmpty()){
            throw new RuntimeException("해당 댓글을 찾을 수 없습니다.");
        }
        recomment = optionalRecomment.get();
        recomment.setContent(dto.getContent());
        recommentRepository.save(recomment);
    }

    //대댓글 삭제
    public void deleteRecomment(long recommentId){
        Optional<Recomment> optionalRecomment = recommentRepository.findById(recommentId);
        if(optionalRecomment.isEmpty()){
            throw new RuntimeException("해당 댓글을 찾을 수 없습니다.");
        }
        recommentRepository.deleteById(recommentId);
    }

}
