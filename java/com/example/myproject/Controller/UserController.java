package com.example.myproject.Controller;

import com.example.myproject.Dto.UserDto;
import com.example.myproject.Dto.UserLoginDto;
import com.example.myproject.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "User API", description = "유저 관련 API")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "유저 정보 조회", description = "ID로 유저 정보를 조회합니다.")
    @GetMapping("/{userid}")
    public UserDto getUser(
            @Parameter(name = "userid", description = "사용자 ID", required = true, example = "test123")
            @PathVariable("userid") String userid
    ) {
        return userService.getUser(userid);
    }

    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "사용자가 회원가입을 합니다.")
    public ResponseEntity<String> signup(@RequestBody UserDto dto) {
        userService.signup(dto);
        return ResponseEntity.ok("회원가입 완료!");
    }

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "사용자가 ID/PW로 로그인합니다.")
    public ResponseEntity<String> login(@RequestBody UserLoginDto dto) {
        String token = userService.login(dto);
        return ResponseEntity.ok(token);
    }

    @DeleteMapping("/deleteUser/{userid}")
    @Operation(summary = "회원탈퇴",description = "사용자가 탈퇴했습니다.")
    public ResponseEntity<String> deleteUser(@PathVariable String userid) {
        userService.delete(userid);
        return ResponseEntity.ok("탈퇴 완료!");
    }

}