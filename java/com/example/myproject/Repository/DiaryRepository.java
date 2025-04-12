package com.example.myproject.Repository;


import com.example.myproject.Entity.Diary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    Optional<Diary> findByBoardId(Long boardId);
    Page<Diary> findAllByOrderByCreatedDtDesc(Pageable pageable);
}
