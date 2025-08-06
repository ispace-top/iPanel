# 智能QoS网络优化解决方案

## 问题分析

你遇到的PT/PCDN业务导致网络延迟增加的问题，本质上是**带宽争抢**和**队列阻塞**问题：

1. **上传带宽饱和**: PT/PCDN会持续使用所有可用的上传带宽
2. **缓冲区膨胀**: 路由器和ISP设备的缓冲区被大量数据包填满
3. **交互性流量受阻**: SSH、Web浏览、游戏等需要低延迟的流量被阻塞在队列后面

## 解决方案优势

我实现的智能QoS解决方案提供了以下优化策略：

### 1. 分层带宽管理
```
总带宽 (例如: 20Mbps上传)
├── 高优先级 (30%): SSH, DNS, ICMP, Web浏览
├── 中等优先级 (30%): 普通应用, HTTPS
├── 低优先级 (30%): PT/PCDN大流量应用  
└── 默认 (10%): 其他未分类流量
```

### 2. 智能流量分类
- **端口识别**: 自动识别PT软件常用端口 (6881-6889, 51413等)
- **进程监控**: 监控qBittorrent、Transmission等进程
- **协议优先级**: ICMP、DNS等协议获得最高优先级

### 3. 自适应调整
- **延迟监控**: 持续监测网络延迟
- **动态限速**: 延迟过高时自动降低PT流量
- **智能恢复**: 延迟恢复后自动恢复正常分配

## 使用方法

### 1. 基础配置 (推荐大多数用户)

```typescript
// 家庭宽带场景 (100M下载/20M上传)
const qosConfig = {
    interface: 'eth0',              // 你的网络接口
    totalUpload: '18mbit',          // 预留2M缓冲
    totalDownload: '95mbit',        // 预留5M缓冲  
    highPriorityUpload: '6mbit',    // 交互性应用保留
    normalLatencyThreshold: 50,     // 50ms延迟阈值
    enableAdaptive: true,           // 启用自适应
    ptPorts: [6881, 6882, 6883, 51413, 8999], // PT端口
    pcdnProcesses: ['qbittorrent', 'transmission']
};
```

### 2. API使用示例

```javascript
// 启动智能QoS
fetch('/api/network/smart-qos/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(qosConfig)
});

// 获取状态
fetch('/api/network/smart-qos/status')
    .then(res => res.json())
    .then(data => console.log(data));

// 获取网络接口列表
fetch('/api/network/interfaces')
    .then(res => res.json())  
    .then(interfaces => console.log(interfaces));
```

### 3. 自动配置推荐

```javascript
// 获取推荐配置
const networkInfo = {
    downloadSpeed: 100,           // Mbps
    uploadSpeed: 20,              // Mbps 
    latency: 30,                  // ms
    connectionType: 'fiber',      // fiber/adsl/cable/wireless
    usage: 'home'                 // home/office/server/gaming
};

fetch('/api/network/qos-recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(networkInfo)
});
```

## 预定义模板

### 家庭宽带优化 (homeBroadband)
- 适合: 100Mbps下载/20Mbps上传
- 特点: 平衡PT下载和日常使用
- 延迟阈值: 50ms

### 高带宽场景 (highBandwidth)  
- 适合: 1000Mbps对等连接
- 特点: 更多带宽给高优先级应用
- 延迟阈值: 30ms

### 游戏优化 (gaming)
- 适合: 需要极低延迟的场景
- 特点: 50%带宽给高优先级
- 延迟阈值: 30ms

### 低带宽场景 (lowBandwidth)
- 适合: ADSL等低速连接
- 特点: 严格限制大流量应用
- 延迟阈值: 100ms

## 技术原理

### 1. HTB (Hierarchical Token Bucket)
- 创建分层的带宽控制结构
- 支持带宽借用和突发流量
- 精确的速率控制

### 2. SFQ (Stochastic Fair Queuing)
- 公平队列调度算法
- 防止单个连接垄断带宽
- 改善多连接环境下的公平性

### 3. 流量分类 (tc filter)
- 基于端口的精确分类
- 协议优先级识别
- 支持动态规则调整

## 监控和调优

### 实时状态监控
```bash
# 查看QoS规则
tc qdisc show dev eth0

# 查看流量统计  
tc -s class show dev eth0

# 监控延迟
ping -c 10 8.8.8.8
```

### 效果验证
1. **延迟测试**: 在PT运行时ping网关，延迟应保持在阈值内
2. **Web浏览**: 网页加载应该流畅，无明显卡顿
3. **SSH连接**: 终端操作应该响应及时
4. **PT速度**: 下载速度会被限制但仍然可用

## 高级优化建议

### 1. 针对特定应用优化
```typescript
// 为特定游戏添加端口规则
const gamingPorts = [27015, 27036, 2099, 5223]; // Steam, LoL等

// 为视频流媒体优化
const streamingOptimization = {
    highPriorityUpload: '8mbit',  // 更多带宽给直播上传
    adaptiveThreshold: 30         // 更严格的延迟要求
};
```

### 2. 时间段控制
可以结合cron任务，在不同时间段使用不同的QoS策略：
- 工作时间: 严格限制PT，优先办公流量
- 夜间: 放宽PT限制，允许更多下载带宽

### 3. 与路由器QoS结合
- 在路由器层面设置基础限速
- 在服务器层面设置精细控制
- 双层优化获得最佳效果

## 故障排除

### 常见问题
1. **权限问题**: 确保运行用户有tc命令权限
2. **内核支持**: 检查是否支持HTB和SFQ模块
3. **接口名称**: 确认网络接口名称正确

### 调试命令
```bash
# 检查内核模块
lsmod | grep sch_htb
lsmod | grep sch_sfq

# 清除所有tc规则
tc qdisc del dev eth0 root

# 重新启动网络服务
systemctl restart networking
```

这个智能QoS解决方案应该能显著改善你的PT/PCDN使用体验，在保证下载效率的同时维持良好的网络响应性。