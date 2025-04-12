package com.example.myproject.Repository;

import com.example.myproject.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.myproject.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUserId(String userId);
}