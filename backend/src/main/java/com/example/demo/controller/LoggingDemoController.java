package com.example.demo.controller;

import com.example.demo.service.LoggingDemoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/demo-logging")
@Slf4j
public class LoggingDemoController {

    private final LoggingDemoService loggingDemoService;

    public LoggingDemoController(LoggingDemoService loggingDemoService) {
        this.loggingDemoService = loggingDemoService;
    }

    @GetMapping("/levels")
    public ResponseEntity<Map<String, String>> testLogLevels() {
        log.info("Request nhận được tại GET /api/v1/demo-logging/levels");
        loggingDemoService.demonstrateLogLevels();
        return ResponseEntity.ok(Map.of("message", "Đã ghi log 5 cấp độ (TRACE, DEBUG, INFO, WARN, ERROR). Kiểm tra console/file log!"));
    }

    @GetMapping("/params")
    public ResponseEntity<Map<String, Object>> testParameterized(
            @RequestParam(defaultValue = "laivu") String user,
            @RequestParam(defaultValue = "1") int attempt) {
        log.info("Request nhận được tại GET /api/v1/demo-logging/params với user={}, attempt={}", user, attempt);
        loggingDemoService.demonstrateParameterizedLogging(user, attempt);
        return ResponseEntity.ok(Map.of(
                "user", user,
                "attempt", attempt,
                "message", "Đã thực hiện parameterized logging"));
    }

    @GetMapping("/exception")
    public ResponseEntity<Map<String, String>> testException() {
        log.info("Request nhận được tại GET /api/v1/demo-logging/exception");
        loggingDemoService.demonstrateExceptionLogging();
        return ResponseEntity.ok(Map.of("message", "Đã mô phỏng và log ngoại lệ với full stack trace"));
    }

    @GetMapping("/mdc")
    public ResponseEntity<Map<String, String>> testMdc() {
        log.info("Request nhận được tại GET /api/v1/demo-logging/mdc");
        loggingDemoService.demonstrateMDCLogging();
        return ResponseEntity.ok(Map.of("message", "Đã ghi log với MDC (requestId, userId)"));
    }
}
