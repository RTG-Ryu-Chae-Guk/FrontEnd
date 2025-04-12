package com.example.myproject.Service;

import com.example.myproject.Dto.DiaryDto;
import com.example.myproject.Entity.Diary;
import com.example.myproject.Entity.User;
import com.example.myproject.Jwt.JwtUtil;
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
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    //다이어리 작성
    public void writeBoard(DiaryDto dto){
        //userId로 유저 조회
        Optional<User> _user = userRepository.findById(dto.getUserId());
        if(_user.isEmpty()){
            throw new RuntimeException("해당 유저가 없습니다.");
        }

        Diary diary = new Diary();
        diary.setTitle(dto.getTitle());
        diary.setContent(dto.getContent());
        diary.setUser(_user.get());

        diaryRepository.save(diary);
    }

    //다이어리 단일 조회
    public Diary getArticle(long boardId){
        Optional<Diary> optionalDiary = diaryRepository.findByBoardId(boardId);
        Diary diary = null;
        if(optionalDiary.isPresent()){
            diary = optionalDiary.get();
        } else {
            throw new RuntimeException("해당 게시글을 찾을 수 없습니다.");
        }
        return diary;
    }

    //다이어리 목록 조회 (게시글 10개에 1페이지)
    public Page<Diary> getArticlesPaged(int page){
        //페이지 번호는 0부터 시작 (즉, page=0이면 첫 페이지)
        PageRequest pageRequest = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdDt"));
        return diaryRepository.findAllByOrderByCreatedDtDesc(pageRequest);
    }


    //다이어리 수정
    public void editArticle(DiaryDto dto){
        Optional<Diary> optionalDiary = diaryRepository.findByBoardId(dto.getBoardId());
        Diary diary = null;
        if(optionalDiary.isEmpty()){
            throw new RuntimeException("해당 게시글을 찾을 수 없습니다.");
        } else{
            diary = optionalDiary.get();
        }
        diary.setTitle(dto.getTitle());
        diary.setContent(dto.getContent());
        diaryRepository.save(diary);
    }

    //다이어리 삭제
    public void deleteArticle(long boardId){
        Optional<Diary> optionalDiary = diaryRepository.findByBoardId(boardId);

        if(optionalDiary.isPresent()) {
            diaryRepository.deleteById(boardId);
        } else{
            throw new RuntimeException("해당 게시글을 찾을 수 없습니다.");
        }
    }
}
