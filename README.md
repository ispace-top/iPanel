# iPanel - 您的专属 NAS 智能控制中心

<p align="center">
  <img src="https://img.shields.io/github/v/release/ispace-top/iPanel?style=for-the-badge&logo=github" alt="最新版本">
  <img src="https://img.shields.io/docker/pulls/wapedkj/ipanel?style=for-the-badge&logo=docker" alt="Docker Pulls">
  <img src="https://img.shields.io/github/actions/workflow/status/ispace-top/iPanel/docker-publish.yml?style=for-the-badge&logo=githubactions" alt="构建状态">
  <img src="https://img.shields.io/github/last-commit/ispace-top/iPanel?style=for-the-badge&logo=git" alt="最后提交">
  <img src="https://img.shields.io/github/languages/top/ispace-top/iPanel?style=for-the-badge&logo=typescript" alt="主要语言">
</p>

<p align="center">
  ✨ <b>重新定义您的 NAS 体验：</b> iPanel 是一款专为 NAS 用户精心打造的、功能强大的、高度可定制化的智能导航与监控面板。它将您的所有服务、实时设备状态和个性化工具汇聚于一处，以极致美学和卓越性能，为您呈现一个前所未有的集中式控制体验。
</p>

---

## ✨ 核心功能概览

iPanel 不仅仅是一个导航页，更是您 NAS 的智能管家。

*   <b>🌐 集中式服务导航</b>:
    *   以直观、美观的图标网格形式，集中管理和快速访问您所有的 NAS 服务、Docker 容器、虚拟机以及常用网站（需要部署对应服务然后在导航中配置链接）。
    *   支持自定义名称、URL 和图标，让您的数字生活一目了然。
    *   新增图标选择器，内置丰富图标库，并支持上传自定义图标，打造独一无二的专属面板。

*   <b>💻 实时设备性能监控</b>:
    *   <b>CPU</b>: 实时追踪 CPU 使用率、温度、核心负载及风扇转速，确保设备运行在最佳状态。
    *   <b>内存</b>: 精准展示内存占用情况，通过直观的进度条和百分比，助您洞察资源分配。
    *   <b>磁盘</b>: 以清晰的表格形式列出所有挂载点、总容量、已用空间和使用率，硬盘健康状况尽在掌握。
    *   <b>网络</b>: 实时监测上下行速率，掌握网络流量动态。
    *   <b>重要提示</b>: 在 Docker 容器中运行时，部分硬件信息（如 CPU 温度、风扇转速）和网络限速功能可能无法准确反映宿主机状态，详情请参阅 [部署方式](#部署与使用) 部分。

*   <b>🌦️ 智能多城市天气预报</b>:
    *   主城市以详细卡片展示今日天气概况及未来3天预报，助您轻松规划。
    *   支持添加多个次要城市，以紧凑列表形式展示，通过精美图标和强调色，主次分明，一览无余。
    *   <b>新增：</b> 单城市模式下，自动扩展显示未来7天详细天气预报，信息更全面。

*   <b>⚡ 智能网络限速与QoS管理</b>:
    *   <b>简单限速</b>: 支持对指定网络接口进行快速限速，使用高级的CAKE算法或HTB+fq_codel进行带宽控制。
    *   <b>智能QoS</b>: 提供多层次的流量优先级管理，自动识别并优化不同应用的网络使用：
        - 最高优先级：SSH、DNS、ICMP等关键系统流量
        - 高优先级：Web浏览、在线游戏等交互性应用
        - 中等优先级：邮件、即时通讯等普通应用
        - 低优先级：PT下载、P2P文件共享等大流量应用
    *   <b>自适应调整</b>: 实时监控网络延迟和使用情况，当检测到高延迟时自动降低低优先级流量带宽。
    *   <b>预设模板</b>: 提供家庭宽带、高带宽服务器、低带宽ADSL、游戏优化等多种场景的预配置模板。

*   <b>🔍 强大且可定制的顶部搜索栏</b>:
    *   内置主流搜索引擎（如 Google、百度），并支持无限添加您偏爱的自定义搜索引擎。
    *   在主页即可快速启动搜索，无需切换页面，极大提升效率。

*   <b>🎨 极致个性化与主题定制</b>:
    *   <b>背景</b>: 随心所欲定制您的面板背景，支持每日必应壁纸、自定义图片 URL，或上传您本地的珍藏图片。
    *   <b>标题</b>: 轻松自定义您的专属网站标题，彰显个性。
    *   <b>安全</b>: 设置菜单支持密码保护，保障您的配置安全，防止未经授权的访问和修改。

<p align="center">
  <img src="./img/view.png" alt="iPanel 界面预览" style="max-width: 100%;">
</p>

---

## 🎯 主要应用场景

iPanel的网络限速和QoS功能特别适用于以下场景：

### 🏠 家庭网络优化
- **PT下载管理**: 在进行PT下载时，自动限制P2P流量优先级，确保正常网页浏览和视频流畅播放
- **多设备共享**: 家庭多人同时使用网络时，智能分配带宽，避免某台设备占用过多带宽影响其他设备
- **游戏延迟优化**: 为在线游戏提供专用的高优先级通道，显著降低游戏延迟和丢包

### 🖥️ NAS服务器管理
- **服务分级**: 为SSH管理、Web界面访问等关键服务保证最高优先级
- **下载任务调节**: 自动调节Transmission、qBittorrent等下载工具的网络使用
- **媒体流服务**: 为Plex、Jellyfin等媒体服务器保证流畅的流媒体体验

### ⚡ 带宽受限环境
- **ADSL/低带宽优化**: 在有限带宽下最大化利用网络资源
- **移动热点管理**: 使用手机热点时精确控制流量使用，避免超出套餐限制
- **网络拥塞处理**: 网络高峰期自动调整策略，维持基础服务的可用性

---

## 🚀 技术架构概览

iPanel 采用现代化的前后端分离架构，确保了高性能、高可维护性和卓越的用户体验。

### 前端 (Frontend)

*   <b>技术栈</b>: 纯 HTML、CSS (Tailwind CSS) 和原生 JavaScript (ES Modules)。
*   <b>设计理念</b>: 遵循简洁、直观的 UI/UX 原则，融合玻璃拟物（Glassmorphism）设计风格，提供流畅的交互体验。
*   <b>模块化</b>: 代码高度模块化，每个功能（如日期时间、天气、搜索、系统信息、导航）都封装为独立的组件，易于理解和扩展。
*   <b>API 交互</b>: 通过异步 JavaScript (Fetch API) 与后端 API 进行高效通信，实时获取和更新数据。

### 后端 (Backend)

*   <b>技术栈</b>: Node.js (Express.js 框架) 和 TypeScript。
*   <b>核心服务</b>: 提供 RESTful API 接口，负责：
    *   <b>配置管理</b>: 持久化和读取用户配置（导航项、天气城市、背景设置等）。
    *   <b>系统信息</b>: 调用系统命令（如 `cat /proc/cpuinfo`, `free -m`, `df -h`, `ip -s link show` 等）获取实时的 CPU、内存、磁盘和网络数据。
    *   <b>天气服务</b>: 集成第三方天气 API (和风天气)，提供当前天气和多日预报。
    *   <b>网络控制</b>: 实现网络限速（基于 `tc` 命令）和智能 QoS 策略管理，支持CAKE算法和HTB+fq_codel回退方案。
    *   <b>文件上传</b>: 处理用户上传的自定义图标和背景图片。
*   <b>安全性</b>: 敏感配置（如密码）经过哈希加密存储，确保数据安全。

### 数据流 (Data Flow)

1.  <b>初始化</b>: 前端应用启动时，通过 API 请求从后端获取初始配置和系统数据。
2.  <b>用户交互</b>: 用户在前端进行操作（如修改设置、点击按钮），前端将数据通过 API 发送给后端。
3.  <b>后端处理</b>: 后端接收请求，处理业务逻辑（如保存配置、执行系统命令、调用外部 API），并将结果返回给前端。
4.  <b>实时更新</b>: 对于系统监控数据，前端会定时向后端发起请求，获取最新数据并更新界面。

---

## 📦 部署与使用

iPanel 提供了灵活的部署方式，您可以根据需求选择最适合您的方式。

### 前提条件

*   <b>Node.js</b>: 推荐 v18 或更高版本 (对于直接部署和本地开发)。
*   <b>Yarn 或 npm</b>: 用于管理项目依赖。
*   <b>Docker</b>: 如果您选择 Docker 部署方式。
*   <b>和风天气 API 密钥</b>: 用于获取天气信息。

### 部署选项 1: 通过 Docker 快速开始 (推荐用于快速体验)

我们强烈推荐使用 Docker 进行部署，这是最简单、最快捷的方式。

1.  <b>拉取镜像</b>

    从 Docker Hub 拉取最新的 iPanel 镜像：
    ```bash
    docker pull wapedkj/ipanel:latest
    ```

2.  <b>准备配置文件</b>

    在您的主机上（例如 `/docker/ipanel`）创建一个目录，用于持久化存储 iPanel 的配置。

    *   在该目录下，创建一个空的 `config.json` 文件。
    *   同样在该目录下，创建一个 `.env` 文件，并填入您的和风天气 API 密钥：
        ```
        HEWEATHER_KEY=您的和风天气WebAPI密钥
        ```
    *   <b>重要</b>: 首次运行时，iPanel 会自动向 `config.json` 写入默认配置。

3.  <b>运行容器</b>

    <b>重要提示：</b>
    在 Docker 容器中运行 iPanel 时，由于容器的隔离性，以下功能会受到限制：
    *   <b>硬件信息获取：</b> 容器内获取到的 CPU、内存、磁盘等信息是容器自身的资源视图，而非宿主机的真实硬件信息。
    *   <b>网络限速设置：</b> 容器内的网络限速命令仅对容器自身的虚拟网络接口有效，无法对宿主机的物理网络进行全局限速。

    <b>如果您需要获取宿主机的真实硬件信息或对宿主机进行网络限速，强烈建议选择 [直接部署](#部署选项-2-直接部署-推荐用于完整功能)。</b>

    为了让 iPanel 能够读取到您 <b>宿主机</b> 的部分真实硬件信息（而不是 Docker 容器的虚拟信息），我们需要在运行时将宿主的系统目录挂载到容器中。

    执行以下命令来启动 iPanel 容器：
    ```bash
    docker run -d \
      --name ipanel \
      -p 3000:3000 \
      -v /your/path/to/config:/app/config \
      -v /your/path/to/uploads:/app/public/uploads \
      -v /proc:/proc:ro \
      -v /sys:/sys:ro \
      -v /etc/os-release:/etc/os-release:ro \
      --restart always \
      wapedkj/ipanel:latest
    ```

    <b>参数说明:</b>
    *   `-p 3000:3000`: 将您主机的 3000 端口映射到容器的 3000 端口。您可以将冒号前的 `3000` 修改为您喜欢的任意端口。
    *   `-v /your/path/to/config:/app/config`: <b>（必需）</b> 持久化您的 `config.json` 和 `.env` 文件。
    *   `-v /your/path/to/uploads:/app/public/uploads`: <b>（必需）</b> 持久化您上传的自定义图标和背景图。
    *   `-v /proc:/proc:ro`: <b>（必需）</b> 以只读方式挂载宿主的 `/proc` 目录，用于获取 CPU、内存等实时信息。
    *   `-v /sys:/sys:ro`: <b>（必需）</b> 以只读方式挂载宿主的 `/sys` 目录，用于获取 CPU 温度、风扇等硬件信息。
    *   `-v /etc/os-release:/etc/os-release:ro`: <b>（必需）</b> 挂载宿主系统信息文件。
    *   `--restart always`: 确保 Docker 服务或您的 NAS 重启后，iPanel 能自动恢复运行。

4.  <b>开始使用</b>

    现在，在您的浏览器中访问 `http://您的NAS的IP地址:3000`，即可开始使用您的 iPanel！

### 部署选项 2: 直接部署 (推荐用于完整功能)

如果您需要 iPanel 完整地获取宿主机的硬件信息，并对宿主机网络进行限速控制，建议直接在宿主机上部署。

1.  <b>克隆仓库</b>
    ```bash
    git clone https://github.com/ispace-top/iPanel.git
    cd iPanel
    ```

2.  <b>安装依赖</b>
    ```bash
    yarn install # 或者 npm install
    ```

3.  <b>配置环境变量</b>
    *   在项目根目录创建 `.env` 文件，并填入您的和风天气 API 密钥：
        ```
        HEWEATHER_KEY=您的和风天气WebAPI密钥
        ```

4.  <b>构建项目</b>
    ```bash
    yarn build # 或者 npm run build
    ```
    这会将 TypeScript 代码编译为 JavaScript，并生成 `dist` 目录。

5.  <b>运行应用</b>

    您可以直接使用 Node.js 运行，但为了保证应用的稳定性和后台运行，强烈推荐使用 PM2。

    *   <b>使用 PM2 (推荐)</b>
        ```bash
        # 如果未安装 PM2
        npm install -g pm2

        # 启动 iPanel
        pm2 start dist/index.js --name ipanel

        # 设置开机自启
        pm2 startup
        pm2 save
        ```
        PM2 会自动管理应用的重启和日志。

    *   <b>直接使用 Node.js (不推荐用于生产环境)</b>
        ```bash
        node dist/index.js
        ```
        应用将在 `http://localhost:9257` 运行。

6.  <b>开始使用</b>

    在您的浏览器中访问 `http://您的宿主机IP地址:9257`，即可开始使用您的 iPanel！

---

## 🛠️ 本地开发

如果您想参与贡献或进行二次开发，可以按以下步骤设置本地环境：

1.  <b>克隆本仓库</b>：
    ```bash
    git clone https://github.com/ispace-top/iPanel.git
    cd iPanel
    ```
2.  <b>安装依赖</b>：
    ```bash
    yarn install # 或者 npm install
    ```
3.  <b>创建 `.env` 文件</b>并填入您的天气 API 密钥。
4.  <b>启动开发服务器</b>：
    ```bash
    yarn dev # 或者 npm run dev
    ```
    现在，应用将在 `http://localhost:3000` 上运行，并会在代码变动时自动重启。

---

## 🤝 贡献

我们欢迎任何形式的贡献！无论是提交 Bug 报告、提出功能建议还是直接贡献代码，都对这个项目非常有帮助。

*   <b>提交 Issue</b>: 如果您发现了 Bug 或有好的想法，请在 [Issues](https://github.com/ispace-top/iPanel/issues) 页面提交。
*   <b>Pull Request</b>: 如果您想贡献代码，请先 Fork 本仓库，在您自己的分支上进行修改，然后提交 Pull Request。

---

## 📜 许可证

本项目基于 [MIT License](https://github.com/ispace-top/iPanel/blob/main/LICENSE) 开源。