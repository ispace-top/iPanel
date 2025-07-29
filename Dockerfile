# --- Stage 1: Build ---
# 使用一个 Node image 来构建应用
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
# 使用 npm ci 更适合 CI/CD 环境，它会确保使用 package-lock.json 中的确切版本
RUN npm ci

# 复制所有源代码
COPY . .

# 将 TypeScript 编译为 JavaScript
RUN npm run build

# --- Stage 2: Production ---
# 使用一个轻量的 Node image 来运行应用
FROM node:20-alpine

WORKDIR /app

# 从构建阶段复制生产环境需要的 node_modules
COPY --from=builder /app/node_modules ./node_modules
# 复制 package.json
COPY package.json ./

# 复制编译后的 JavaScript 代码
COPY --from=builder /app/dist ./dist

# 复制前端静态文件
COPY --from=builder /app/public ./public

# 复制配置文件
COPY config.json ./

# 暴露应用运行的端口
EXPOSE 3000

# 运行应用的命令
CMD ["npm", "start"]
