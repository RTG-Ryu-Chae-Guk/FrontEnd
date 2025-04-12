package com.example.myproject.Common;

public enum FriendStatus {
    //알림용
    REQUESTED("요청"),
    ACCEPTED("친구 수락"),
    REJECTED("거절");

    private final String description;

    FriendStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
