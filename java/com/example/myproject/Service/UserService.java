package com.example.myproject.Service;

import com.example.myproject.Dto.UserDto;
import com.example.myproject.Dto.UserLoginDto;
import com.example.myproject.Entity.User;
import com.example.myproject.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.myproject.Jwt.JwtUtil;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public void signup(UserDto dto) {
        if (userRepository.existsByUserId(dto.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        User user = new User();
        user.setUserId(dto.getUserId());
        user.setUserPw(dto.getUserPw());
        user.setUserName(dto.getUserName());
        user.setPhone(dto.getPhone());
        user.setNickname(dto.getNickname());
        user.setCreatedDt(LocalDateTime.now());
        user.setUpdatedDt(LocalDateTime.now());

        userRepository.save(user);
    }

    public UserDto getUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("해당 유저가 없습니다."));
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setUserPw(user.getUserPw());
        dto.setUserName(user.getUserName());
        dto.setPhone(user.getPhone());
        dto.setNickname(user.getNickname());
        return dto;
    }

    public String login(UserLoginDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        if (!user.getUserPw().equals(dto.getUserPw())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return jwtUtil.createToken(user.getUserId());
    }

    public void delete(String userId) {
        userRepository.deleteById(userId);
    }
}