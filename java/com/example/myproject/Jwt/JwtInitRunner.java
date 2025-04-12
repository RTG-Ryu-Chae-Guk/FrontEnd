package com.example.myproject.Jwt;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class JwtInitRunner implements CommandLineRunner {

    private final JwtUtil jwtUtil;

    public JwtInitRunner(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void run(String... args) {
        // 임시 username 으로 토큰 생성
        String username = "testuser";
        String token = jwtUtil.createToken(username);

        System.out.println("개발용 임시 JWT 토큰 생성 완료:");
        System.out.println("Bearer " + token);
    }
}