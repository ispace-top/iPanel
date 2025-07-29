# --- Stage 1: Build ---
# 使用一个 Node image 来构建应用
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 和 yarn.lock 文件
COPY package*.json yarn.lock ./

# 使用 yarn install --frozen-lockfile 更适合 CI/CD 环境
# 基础镜像已包含 yarn，无需再次安装
RUN yarn install --frozen-lockfile

# 复制所有源代码
COPY . .

# 将 TypeScript 编译为 JavaScript
RUN npm run build

# --- Stage 2: Production ---
# 使用一个轻量的 Node image 来运行应用
FROM node:20-alpine

WORKDIR /app

# 仅复制生产环境需要的依赖
COPY package*.json yarn.lock ./
# 基础镜像已包含 yarn，无需再次安装
RUN yarn install --production --frozen-lockfile

# 复制编译后的 JavaScript 代码
COPY --from=builder /app/dist ./dist

# 复制前端静态文件
COPY --from=builder /app/public ./public

# 复制配置文件占位符
COPY config.json ./

# 暴露应用运行的端口
EXPOSE 3000

# 运行应用的命令
# 注意：这里我们仍然可以使用 npm start，因为它只是 package.json 中定义的一个脚本别名
CMD ["npm", "start"]
