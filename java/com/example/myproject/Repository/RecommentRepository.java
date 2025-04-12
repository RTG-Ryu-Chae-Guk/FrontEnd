package com.example.myproject.Repository;

import com.example.myproject.Entity.Comments;
import com.example.myproject.Entity.Recomment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommentRepository extends JpaRepository<Recomment, Long> {
    Page<Recomment> findByCommentsOrderByCreatedDtAsc(Comments comments, Pageable pageable);
}
