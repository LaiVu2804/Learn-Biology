# ==============================================================================
# Multi-stage Dockerfile cho Frontend React + Vite
# ==============================================================================

# Stage 1: Build source code bằng Node.js 22 Alpine
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Cài đặt dependencies sạch (clean install)
RUN npm ci

# Copy toàn bộ mã nguồn
COPY . .

# Build dự án ra thư mục dist
RUN npm run build

# Stage 2: Serve ứng dụng production bằng Nginx Alpine siêu nhẹ
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Xóa các file mặc định của nginx
RUN rm -rf ./*

# Copy build artifacts từ Stage 1
COPY --from=builder /app/dist .

# Copy cấu hình Nginx reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
