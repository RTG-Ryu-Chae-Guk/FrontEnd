package com.example.myproject.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private long commentId;

    @Column(name = "content", length = 300, nullable = false)
    private String content;

    @CreationTimestamp //자동생성
    @Column(name = "created_dt")
    private LocalDateTime createdDt;

    @UpdateTimestamp //업데이트 자동생성
    @Column(name = "updated_dt")
    private LocalDateTime updatedDt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false) // FK로 board_id 컬럼 생성됨
    private Diary diary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)  // FK로 user_id 컬럼 생성됨
    private User user;
}
