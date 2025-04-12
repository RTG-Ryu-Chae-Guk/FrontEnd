package com.example.myproject.Controller;

import com.example.myproject.Jwt.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /*
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        // 실제로는 DB에서 유저 확인해야 함
        if (loginDto.getUsername().equals("test") && loginDto.getPassword().equals("1234")) {
            String token = jwtUtil.createToken(loginDto.getUsername());
            return ResponseEntity.ok().body("Bearer " + token);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
    }*/
}