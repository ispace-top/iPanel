import { QoSConfig } from './smartQoS';

/**
 * 预定义的QoS配置模板
 */
export const QoSTemplates = {
    /**
     * 家庭宽带场景 - PT/PCDN优化
     * 适合: 100Mbps下载 / 20Mbps上传的家庭宽带
     */
    homeBroadband: {
        name: '家庭宽带',
        description: '适用于大多数家庭网络，优化下载和日常网页浏览体验。',
        interface: 'eth0',
        totalUpload: '18mbit',      // 预留2Mbps缓冲
        totalDownload: '95mbit',    // 预留5Mbps缓冲
        highPriorityUpload: '6mbit', // SSH、DNS、Web浏览等
        normalLatencyThreshold: 50,  // 50ms延迟阈值
        enableAdaptive: true,
        ptPorts: [6881, 6882, 6883, 6884, 6885, 51413, 8999],
        pcdnProcesses: ['thunder', 'xunlei', 'qbittorrent', 'transmission']
    } as QoSConfig,

    /**
     * 高带宽场景 - 服务器/企业
     * 适合: 1000Mbps对等连接
     */
    highBandwidth: {
        name: '高带宽/服务器',
        description: '适用于高速网络环境，如千兆光纤，确保服务器和企业应用流畅运行。',
        interface: 'eth0',
        totalUpload: '900mbit',
        totalDownload: '900mbit',
        highPriorityUpload: '100mbit',
        normalLatencyThreshold: 30,
        enableAdaptive: true,
        ptPorts: [6881, 6882, 6883, 6884, 6885, 51413, 8999],
        pcdnProcesses: ['thunder', 'xunlei', 'qbittorrent', 'transmission']
    } as QoSConfig,

    /**
     * 低带宽场景 - ADSL/低速宽带
     * 适合: 20Mbps下载 / 2Mbps上传
     */
    lowBandwidth: {
        name: '低带宽/ADSL',
        description: '适用于网络速度较慢的环境，优先保障基础网络服务的稳定性。',
        interface: 'ppp0',
        totalUpload: '1800kbit',
        totalDownload: '18mbit',
        highPriorityUpload: '800kbit',
        normalLatencyThreshold: 100,
        enableAdaptive: true,
        ptPorts: [6881, 6882, 6883, 6884, 6885],
        pcdnProcesses: ['thunder', 'xunlei']
    } as QoSConfig,

    /**
     * 游戏优化场景
     * 专门针对在线游戏延迟优化
     */
    gaming: {
        name: '游戏优化',
        description: '优先处理游戏流量，最大限度降低游戏延迟和卡顿。',
        interface: 'eth0',
        totalUpload: '18mbit',
        totalDownload: '95mbit',
        highPriorityUpload: '10mbit', // 更多带宽给高优先级
        normalLatencyThreshold: 30,   // 更严格的延迟要求
        enableAdaptive: true,
        ptPorts: [6881, 6882, 6883, 6884, 6885],
        pcdnProcesses: ['thunder', 'xunlei', 'qbittorrent']
    } as QoSConfig
};

/**
 * QoS策略推荐
 */
export class QoSRecommendation {
    /**
     * 根据网络环境推荐QoS配置
     */
    static recommendConfig(networkInfo: {
        downloadSpeed: number; // Mbps
        uploadSpeed: number;   // Mbps
        latency: number;       // ms
        connectionType: 'fiber' | 'adsl' | 'cable' | 'wireless';
        usage: 'home' | 'office' | 'server' | 'gaming';
    }): QoSConfig {
        const { downloadSpeed, uploadSpeed, usage, connectionType } = networkInfo;

        let template: QoSConfig;

        // 根据带宽选择基础模板
        if (uploadSpeed >= 50) {
            template = { ...QoSTemplates.highBandwidth };
        } else if (uploadSpeed >= 10) {
            template = { ...QoSTemplates.homeBroadband };
        } else {
            template = { ...QoSTemplates.lowBandwidth };
        }

        // 根据使用场景调整
        if (usage === 'gaming') {
            template.normalLatencyThreshold = 30;
            template.highPriorityUpload = this.calculateBandwidth(template.totalUpload, 0.5); // 50%给高优先级
        }

        // 根据连接类型调整
        if (connectionType === 'wireless') {
            template.normalLatencyThreshold += 20; // 无线连接延迟容忍度更高
        }

        // 动态计算带宽分配
        template.totalUpload = `${Math.floor(uploadSpeed * 0.9)}mbit`;
        template.totalDownload = `${Math.floor(downloadSpeed * 0.95)}mbit`;
        template.highPriorityUpload = this.calculateBandwidth(template.totalUpload, 0.4);

        return template;
    }

    private static calculateBandwidth(totalBandwidth: string, percentage: number): string {
        const match = totalBandwidth.match(/^(\d+(?:\.\d+)?)(.*)$/);
        if (!match) return totalBandwidth;
        
        const value = parseFloat(match[1]);
        const unit = match[2];
        const newValue = Math.floor(value * percentage);
        
        return `${newValue}${unit}`;
    }
}

/**
 * 常见应用端口映射
 */
export const ApplicationPorts = {
    // PT软件端口
    bittorrent: [6881, 6882, 6883, 6884, 6885, 6886, 6887, 6888, 6889],
    qbittorrent: [8080, 51413],
    transmission: [9091, 51413],
    deluge: [58846, 58847],
    utorrent: [6881, 10000],
    
    // P2P下载
    emule: [4662, 4672],
    thunder: [9050, 9051],
    
    // 游戏端口
    steam: [27015, 27036],
    battlenet: [1119, 6113],
    league_of_legends: [2099, 5223, 8393, 8394],
    
    // 视频流媒体
    netflix: [443, 80],
    youtube: [443, 80],
    twitch: [443, 80, 1935],
    
    // 常用服务
    ssh: [22],
    web: [80, 443],
    ftp: [20, 21],
    dns: [53],
    ntp: [123]
};

/**
 * 流量分类规则
 */
export const TrafficClasses = {
    // 最高优先级 - 实时性要求极高
    critical: {
        protocols: ['icmp'],
        ports: [...ApplicationPorts.ssh, ...ApplicationPorts.dns],
        description: '关键系统流量'
    },
    
    // 高优先级 - 交互性应用
    high: {
        ports: [...ApplicationPorts.web, ...ApplicationPorts.steam, ...ApplicationPorts.battlenet],
        description: '交互性应用'
    },
    
    // 中等优先级 - 普通应用
    normal: {
        ports: [443, 993, 995, 587, 465], // HTTPS, IMAPS, POP3S, SMTP
        description: '普通应用流量'
    },
    
    // 低优先级 - 大流量应用
    bulk: {
        ports: [
            ...ApplicationPorts.bittorrent,
            ...ApplicationPorts.qbittorrent,
            ...ApplicationPorts.transmission,
            ...ApplicationPorts.thunder,
            ...ApplicationPorts.emule
        ],
        description: 'P2P和大文件传输'
    }
};