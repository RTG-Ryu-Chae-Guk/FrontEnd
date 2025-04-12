package com.example.myproject.Controller;

import com.example.myproject.Service.SmsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sms")
@Tag(name = "SMS 인증 API", description = "휴대폰 문자 인증 관련 API")
public class SmsController {

    private final SmsService smsService;

    @PostMapping("/send")
    @Operation(summary = "인증번호 문자 발송", description = "사용자의 휴대폰 번호로 인증번호를 전송합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "문자 전송 성공"),
            @ApiResponse(responseCode = "400", description = "요청 파라미터 오류"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<String> sendSms(
            @Parameter(description = "수신할 사용자 휴대폰 번호", example = "01012345678")
            @RequestParam String phoneNumber
    ) {
        try {
            SingleMessageSentResponse response = smsService.sendOne(phoneNumber);
            return ResponseEntity.ok("인증번호 전송 완료");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    @Operation(summary = "인증번호 재전송", description = "인증번호를 다시 전송합니다. (최소 60초 간격 제한)")
    public ResponseEntity<String> resendSms(
            @Parameter(description = "수신할 사용자 휴대폰 번호", example = "01012345678")
            @RequestParam String phoneNumber
    ) {
        try {
            SingleMessageSentResponse response = smsService.resend(phoneNumber);
            return ResponseEntity.ok("인증번호 재전송 완료");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    @Operation(summary = "인증번호 확인", description = "사용자가 입력한 인증번호를 검증합니다.")
    public ResponseEntity<String> verifyCode(
            @RequestParam String phoneNumber,
            @RequestParam String code
    ) {
        boolean isValid = smsService.verifyCode(phoneNumber, code);
        if (isValid) {
            return ResponseEntity.ok("인증 성공!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패: 잘못된 번호 또는 만료됨");
        }
    }
}
