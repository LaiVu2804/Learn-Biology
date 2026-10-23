# ==============================================================================
# Multi-stage Dockerfile cho Spring Boot (Java 21)
# ==============================================================================

# Stage 1: Build JAR bằng JDK 21
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Cài đặt bash để chạy Gradle wrapper ổn định trên Alpine
RUN apk add --no-cache bash

# Copy gradle wrapper và cấu hình dự án
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Chuẩn hóa xuống dòng Unix (CRLF -> LF) phòng trường hợp git checkout trên Windows
RUN tr -d '\r' < gradlew > gradlew_unix && mv gradlew_unix gradlew && chmod +x gradlew

# Tải trước dependencies để tận dụng Docker cache
RUN ./gradlew dependencies --no-daemon || true

# Copy mã nguồn và tiến hành build ứng dụng (bỏ qua unit test để build nhanh hơn)
COPY src src
RUN ./gradlew bootJar -x test --no-daemon

# Stage 2: Runtime image tinh gọn với Temurin JRE 21 Alpine
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo thư mục lưu file upload
RUN mkdir -p /app/upload

# Copy file jar từ stage build
COPY --from=builder /app/build/libs/*-SNAPSHOT.jar app.jar

# Mở cổng 8080 của backend
EXPOSE 8080

# Chạy ứng dụng Spring Boot
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
