package com.example.myproject.Entity;

import com.example.myproject.Common.FollowStatus;
import com.example.myproject.Common.FriendStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "friend")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class Friend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "friend_id")
    private long friendId;

    @Column(name = "friend_status", nullable = false)
    private FriendStatus friendStatus;

    @Column(name = "follow_status")
    private FollowStatus followStatus;

    @CreationTimestamp
    @Column(name = "created_dt")
    private LocalDateTime createdDt;

    @UpdateTimestamp
    @Column(name = "updated_dt")
    private LocalDateTime updatedDt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_user_id", nullable = false)
    private User friendUser;
}
