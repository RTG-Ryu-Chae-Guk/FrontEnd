package com.example.myproject.Repository;

import com.example.myproject.Entity.Comments;
import com.example.myproject.Entity.Diary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentsRepository extends JpaRepository<Comments, Long> {
    Optional<Comments> findByCommentId(Long commentId);
    Page<Comments> findByDiaryOrderByCreatedDtAsc(Diary diary, Pageable pageable);
}
