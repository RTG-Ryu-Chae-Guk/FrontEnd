package com.example.myproject.Repository;

import com.example.myproject.Entity.Friend;
import com.example.myproject.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    Page<Friend> findByUserOrderByCreatedDtDesc(User user, Pageable pageable);
    //수정
    //Page<Friend> findByUserOrderByCreateDtDESC(User user, Pageable pageable);인데
    //@Column(name = "created_dt")
    //private LocalDateTime createdDt;라서
    //바꿈
}
