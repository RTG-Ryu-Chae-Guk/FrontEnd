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
@Table(name = "diary")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long boardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)  // FK로 user_id 컬럼 생성됨
    private User user;

    @Column(name = "title", length = 45, nullable = false)
    private String title;

    @Column(name = "content", length = 2000, nullable = false)
    private String content;

    @CreationTimestamp //자동생성
    @Column(name = "created_dt")
    private LocalDateTime createdDt;

    @UpdateTimestamp //업데이트 자동생성
    @Column(name = "updated_dt")
    private LocalDateTime updatedDt;
}
