package com.example.demo.service;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class LoggingDemoService {
    private static final Logger manualLogger = LoggerFactory.getLogger(LoggingDemoService.class);

    /**
     * 1. Minh họa 5 mức độ log (Log Levels) theo chuẩn SLF4J / Logback:
     * TRACE < DEBUG < INFO < WARN < ERROR
     */
    public void demonstrateLogLevels() {
        log.info("========== BẮT ĐẦU MINH HỌA 5 CẤP ĐỘ LOG ==========");

        // Mức 1: TRACE - Rất chi tiết, thường dùng theo dõi từng bước thuật toán, rẽ nhánh vòng lặp
        log.trace("[TRACE] Đây là log mức TRACE - Rất chi tiết, thường chỉ bật khi deep debug");

        // Mức 2: DEBUG - Dành cho môi trường phát triển (Dev), hiển thị trạng thái dữ liệu, biến nội bộ
        log.debug("[DEBUG] Đây là log mức DEBUG - Chứa dữ liệu chi tiết phục vụ lập trình viên");

        // Mức 3: INFO - Cấp độ mặc định trong Spring Boot, ghi lại các sự kiện thông thường trong ứng dụng
        log.info("[INFO] Đây là log mức INFO - Mặc định Spring Boot hiển thị mức này trở lên");

        // Mức 4: WARN - Cảnh báo các tình huống bất thường nhưng chưa làm sập ứng dụng (fallback, deprecated API)
        log.warn("[WARN] Đây là log mức WARN - Cảnh báo có dấu hiệu bất thường nhưng chưa gián đoạn luồng");

        // Mức 5: ERROR - Lỗi nghiêm trọng cần ghi nhận để điều tra xử lý (Exception, mất kết nối DB)
        log.error("[ERROR] Đây là log mức ERROR - Ghi nhận sự cố ngoại lệ cần khắc phục ngay");

        log.info("========== KẾT THÚC MINH HỌA 5 CẤP ĐỘ LOG ==========");
    }

    /**
     * 2. Minh họa Parameterized Logging (Placeholder {})
     * Baeldung nhấn mạnh: Dùng {} giúp tránh chi phí nối chuỗi String khi log level không được bật.
     */
    public void demonstrateParameterizedLogging(String username, int attemptCount) {
        // TỐT: Chỉ format chuỗi khi level INFO được bật (tiết kiệm CPU và Garbage Collector)
        log.info("Người dùng '{}' vừa thử đăng nhập lần thứ {}.", username, attemptCount);

        // KHÔNG NÊN: Nối chuỗi bằng toán tử '+' sẽ luôn tạo chuỗi mới trong bộ nhớ dù log không được in
        // log.debug("User " + username + " attempt: " + attemptCount);
    }

    /**
     * 3. Minh họa Log Exception đúng chuẩn với Stack Trace
     */
    public void demonstrateExceptionLogging() {
        try {
            int result = 10 / 0;
            log.info("Kết quả: {}", result);
        } catch (ArithmeticException ex) {
            // ĐÚNG CHUẨN: Truyền Exception vào tham số cuối cùng để Logback in đầy đủ Stack Trace
            log.error("Bắt được ngoại lệ chia cho 0: {}", ex.getMessage(), ex);
        }
    }

    /**
     * 4. Minh họa Mapped Diagnostic Context (MDC)
     * Kỹ thuật gán ID ngữ cảnh (RequestId, SessionId, UserId) vào ThreadLocal để theo dõi vết log
     */
    public void demonstrateMDCLogging() {
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        try {
            // Gán dữ liệu vào MDC context
            MDC.put("requestId", requestId);
            MDC.put("userId", "user_1024");

            log.info("Bắt đầu xử lý nghiệp vụ với MDC context.");
            log.debug("Đang truy vấn dữ liệu sinh học cho học sinh...");
            log.info("Hoàn tất tác vụ thành công.");
        } finally {
            // Luôn luôn dọn dẹp MDC trong finally để tránh memory leak và rò rỉ dữ liệu giữa các thread
            MDC.remove("requestId");
            MDC.remove("userId");
            // Hoặc MDC.clear();
        }
    }

    /**
     * 5. Minh họa so sánh Logger thủ công vs Lombok @Slf4j
     */
    public void demonstrateManualLoggerVsLombok() {
        manualLogger.info("Log từ manualLogger (LoggerFactory.getLogger)");
        log.info("Log từ Lombok @Slf4j (ngắn gọn, tối ưu)");
    }
}
