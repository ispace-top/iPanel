# iPanel - 您的专属 NAS 导航和监控面板

<p align="center">
  <img src="https://img.shields.io/github/v/release/ispace-top/iPanel?style=for-the-badge&logo=github" alt="最新版本">
  <img src="https://img.shields.io/docker/pulls/wapedkj/ipanel?style=for-the-badge&logo=docker" alt="Docker Pulls">
  <img src="https://img.shields.io/github/actions/workflow/status/ispace-top/iPanel/docker-publish.yml?style=for-the-badge&logo=githubactions" alt="构建状态">
</p>

<p align="center">
  一款专为 NAS 用户设计的高颜值、高度可定制化的导航主页。iPanel 使用 Node.js + TypeScript 构建，可通过 Docker 轻松部署，让您在一个清爽的界面中，集中访问所有服务，并实时监控您的设备状态。
</p>

---

## ✨ 界面预览

![界面](./img/view.png)

## 🚀 主要功能

* **🌐 集中式服务导航**: 以美观的图标网格形式，集中管理和访问您所有的 NAS 服务和常用网站。
* **💻 实时设备监控**:
    * **CPU**: 实时查看使用率、温度、核心数和风扇转速。
    * **内存**: 以进度条和百分比清晰展示内存占用。
    * **磁盘**: 以表格形式列出所有挂载点、总容量、已用空间和使用率。
    * **网络**: 实时显示上下行速率。
* **🌦️ 多城市天气预报**:
    * 主城市以详细卡片展示今日天气和未来预报。
    * 支持添加多个次要城市，以紧凑列表形式展示，主次分明。
* **🔍 强大的顶部搜索栏**:
    * 内置 Google 和百度搜索引擎，并支持添加任意自定义搜索引擎。
    * 在主页即可快速开始搜索，无需跳转。
* **🎨 高度个性化设置**:
    * **导航项**: 自由添加、修改、删除导航链接，支持从丰富的预置图标库中选择，或上传您自己的专属图标。
    * **背景**: 支持每日必应壁纸、自定义图片 URL 或上传本地图片作为背景。
    * **标题**: 自定义您的专属网站标题。
* **🔒 安全可靠**:
    * 设置菜单支持密码保护，防止他人误操作。
    * 密码经过哈希加密存储，保障您的安全。

## 🐳 通过 Docker 快速开始

我们强烈推荐使用 Docker 进行部署，这是最简单、最快捷的方式。

1.  **拉取镜像**

    从 Docker Hub 拉取最新的 iPanel 镜像：
    ```bash
    docker pull wapedkj/ipanel:latest
    ```

2.  **准备配置文件**

    在您的主机上（例如 `/docker/ipanel`）创建一个目录，用于持久化存储 iPanel 的配置。

    * 在该目录下，创建一个空的 `config.json` 文件。
    * 同样在该目录下，创建一个 `.env` 文件，并填入您的和风天气 API 密钥：
        ```
        HEWEATHER_KEY=您的和风天气WebAPI密钥
        ```
    * **重要**: 首次运行时，iPanel 会自动向 `config.json` 写入默认配置。

3.  **运行容器**

    为了让 iPanel 能够读取到您 **宿主机** 的真实硬件信息（而不是 Docker 容器的虚拟信息），我们需要在运行时将宿主的系统目录挂载到容器中。

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

    **参数说明:**
    * `-p 3000:3000`: 将您主机的 3000 端口映射到容器的 3000 端口。您可以将冒号前的 `3000` 修改为您喜欢的任意端口。
    * `-v /your/path/to/config:/app/config`: **（必需）** 持久化您的 `config.json` 和 `.env` 文件。
    * `-v /your/path/to/uploads:/app/public/uploads`: **（必需）** 持久化您上传的自定义图标和背景图。
    * `-v /proc:/proc:ro`: **（必需）** 以只读方式挂载宿主的 `/proc` 目录，用于获取 CPU、内存等实时信息。
    * `-v /sys:/sys:ro`: **（必需）** 以只读方式挂载宿主的 `/sys` 目录，用于获取 CPU 温度、风扇等硬件信息。
    * `-v /etc/os-release:/etc/os-release:ro`: **（必需）** 挂载宿主系统信息文件。
    * `--restart always`: 确保 Docker 服务或您的 NAS 重启后，iPanel 能自动恢复运行。

4.  **开始使用**

    现在，在您的浏览器中访问 `http://您的NAS的IP地址:3000`，即可开始使用您的 iPanel！

## 🛠️ 本地开发

如果您想参与贡献或进行二次开发，可以按以下步骤设置本地环境：

1.  克隆本仓库：
    ```bash
    git clone [https://github.com/ispace-top/iPanel.git](https://github.com/ispace-top/iPanel.git)
    cd YOUR_REPO
    ```
2.  安装依赖：
    ```bash
    yarn install
    # 或者 npm install
    ```
3.  创建 `.env` 文件并填入您的天气 API 密钥。
4.  启动开发服务器：
    ```bash
    yarn dev
    ```
    现在，应用将在 `http://localhost:3000` 上运行，并会在代码变动时自动重启。

## 🙌 贡献

我们欢迎任何形式的贡献！无论是提交 Bug 报告、提出功能建议还是直接贡献代码，都对这个项目非常有帮助。

* **提交 Issue**: 如果您发现了 Bug 或有好的想法，请在 [Issues](https://github.com/ispace-top/iPanel/issues) 页面提交。
* **Pull Request**: 如果您想贡献代码，请先 Fork 本仓库，在您自己的分支上进行修改，然后提交 Pull Request。

## 📜 许可证

本项目基于 [MIT License](https://github.com/ispace-top/iPanel/blob/main/LICENSE) 开源。
