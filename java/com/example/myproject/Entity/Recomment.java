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
@Table(name = "recomment")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class Recomment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recomment_id")
    private long recommentId;

    @Column(name = "content", length = 300, nullable = false)
    private String content;

    @CreationTimestamp
    @Column(name = "created_dt")
    private LocalDateTime createdDt;

    @UpdateTimestamp
    @Column(name = "updated_dt")
    private LocalDateTime updatedDt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private Comments comments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
