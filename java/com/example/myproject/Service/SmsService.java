package com.example.myproject.Service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SmsService {

    private final RedisTemplate<String, String> redisTemplate;
    private final Random random = new Random();

    private DefaultMessageService messageService;

    @Value("${coolsms.api.key}")
    private String apiKey;

    @Value("${coolsms.api.secret}")
    private String apiSecret;

    @PostConstruct
    public void init() {
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
    }

    public SingleMessageSentResponse sendOne(String toPhoneNumber) {
        String lockKey = "sms:lock:" + toPhoneNumber;
        if (redisTemplate.hasKey(lockKey)) {
            throw new RuntimeException("잠시 후 다시 요청해주세요. (최소 60초 간격)");
        }
        return sendVerificationCode(toPhoneNumber, lockKey);
    }

    public SingleMessageSentResponse resend(String toPhoneNumber) {
        String lockKey = "sms:lock:" + toPhoneNumber;
        if (redisTemplate.hasKey(lockKey)) {
            throw new RuntimeException("잠시 후 다시 요청해주세요. (최소 60초 간격)");
        }
        return sendVerificationCode(toPhoneNumber, lockKey);
    }

    private SingleMessageSentResponse sendVerificationCode(String toPhoneNumber, String lockKey) {
        // 인증번호 생성 (4자리 숫자)
        StringBuilder resultNum = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            resultNum.append(random.nextInt(10));
        }
        String code = resultNum.toString();

        // Redis 저장 (TTL 3분) + 쿨타임 60초 설정
        redisTemplate.opsForValue().set("sms:code:" + toPhoneNumber, code, Duration.ofMinutes(3));
        redisTemplate.opsForValue().set(lockKey, "locked", Duration.ofSeconds(60));

        // 문자 전송
        Message message = new Message();
        message.setFrom("01076294088");
        message.setTo(toPhoneNumber);
        message.setText("[Diary App]\n인증번호: " + code);

        return messageService.sendOne(new SingleMessageSendingRequest(message));
    }

    public boolean verifyCode(String phoneNumber, String code) {
        String key = "sms:code:" + phoneNumber;
        String savedCode = redisTemplate.opsForValue().get(key);
        return code.equals(savedCode);
    }
}
