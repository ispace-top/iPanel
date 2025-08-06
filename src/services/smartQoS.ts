import { exec } from 'child_process';
import { promisify } from 'util';
import si from 'systeminformation';

const execAsync = promisify(exec);

export interface QoSConfig {
    interface: string;
    totalUpload: string;      // 总上传带宽 (如 "10mbit")
    totalDownload: string;    // 总下载带宽 (如 "100mbit")
    highPriorityUpload: string;   // 高优先级上传保留 (如 "3mbit")
    normalLatencyThreshold: number; // 正常延迟阈值 (毫秒)
    enableAdaptive: boolean;  // 是否启用自适应限速
    ptPorts?: number[];       // PT软件端口列表
    pcdnProcesses?: string[]; // PCDN进程名称列表
}

export interface NetworkMetrics {
    latency: number;          // 当前延迟 (毫秒)
    uploadUsage: number;      // 上传使用率 (%)
    downloadUsage: number;    // 下载使用率 (%)
    activeConnections: number; // 活动连接数
}

/**
 * 智能QoS管理类
 * 用于动态调整网络限速，优化PT/PCDN场景下的延迟问题
 */
export class SmartQoS {
    private config: QoSConfig;
    private isActive = false;
    private monitoringInterval?: NodeJS.Timeout;
    private lastMetrics?: NetworkMetrics;

    constructor(config: QoSConfig) {
        this.config = config;
    }

    /**
     * 启动智能QoS
     */
    async start(): Promise<{ success: boolean; message: string }> {
        try {
            // 1. 清除现有规则
            await this.clearRules();

            // 2. 设置高级QoS规则
            await this.setupAdvancedQoS();

            // 3. 启动监控（如果启用自适应）
            if (this.config.enableAdaptive) {
                this.startMonitoring();
            }

            this.isActive = true;
            return { success: true, message: '智能QoS已启动' };
        } catch (error) {
            return { success: false, message: `启动失败: ${(error as Error).message}` };
        }
    }

    /**
     * 停止智能QoS
     */
    async stop(): Promise<{ success: boolean; message: string }> {
        try {
            // 停止监控
            if (this.monitoringInterval) {
                clearInterval(this.monitoringInterval);
                this.monitoringInterval = undefined;
            }

            // 清除所有规则
            await this.clearRules();

            this.isActive = false;
            return { success: true, message: '智能QoS已停止' };
        } catch (error) {
            return { success: false, message: `停止失败: ${(error as Error).message}` };
        }
    }

    /**
     * 设置高级QoS规则
     * 使用HTB (Hierarchical Token Bucket) + 多级队列
     */
    private async setupAdvancedQoS(): Promise<void> {
        const { interface: iface, totalUpload, highPriorityUpload } = this.config;

        // === 上传限制 (出口流量) ===
        
        // 1. 创建HTB根队列
        await execAsync(`tc qdisc add dev ${iface} root handle 1: htb default 13`);

        // 2. 创建根类别
        await execAsync(`tc class add dev ${iface} parent 1: classid 1:1 htb rate ${totalUpload} ceil ${totalUpload}`);

        // 3. 创建高优先级类别 (SSH, DNS, ICMP, Web浏览等)
        await execAsync(`tc class add dev ${iface} parent 1:1 classid 1:10 htb rate ${highPriorityUpload} ceil ${totalUpload} prio 1`);

        // 4. 创建中等优先级类别 (普通应用)
        const mediumUpload = this.calculateBandwidth(totalUpload, 0.3); // 30%
        await execAsync(`tc class add dev ${iface} parent 1:1 classid 1:11 htb rate ${mediumUpload} ceil ${totalUpload} prio 2`);

        // 5. 创建低优先级类别 (PT/PCDN等大流量应用)
        const lowUpload = this.calculateBandwidth(totalUpload, 0.4); // 40%
        await execAsync(`tc class add dev ${iface} parent 1:1 classid 1:12 htb rate ${lowUpload} ceil ${totalUpload} prio 3`);

        // 6. 创建默认类别 (其他流量)
        const defaultUpload = this.calculateBandwidth(totalUpload, 0.2); // 20%
        await execAsync(`tc class add dev ${iface} parent 1:1 classid 1:13 htb rate ${defaultUpload} ceil ${totalUpload} prio 4`);

        // 7. 为每个类别添加SFQ队列（公平队列）
        await execAsync(`tc qdisc add dev ${iface} parent 1:10 handle 10: sfq perturb 10`);
        await execAsync(`tc qdisc add dev ${iface} parent 1:11 handle 11: sfq perturb 10`);
        await execAsync(`tc qdisc add dev ${iface} parent 1:12 handle 12: sfq perturb 10`);
        await execAsync(`tc qdisc add dev ${iface} parent 1:13 handle 13: sfq perturb 10`);

        // 8. 设置流量分类规则
        await this.setupTrafficFilters();

        console.log('高级QoS规则设置完成');
    }

    /**
     * 设置流量分类规则
     */
    private async setupTrafficFilters(): Promise<void> {
        const { interface: iface } = this.config;

        // 高优先级流量规则
        // SSH (端口22)
        await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 1 u32 match ip dport 22 0xffff flowid 1:10`);
        await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 1 u32 match ip sport 22 0xffff flowid 1:10`);

        // DNS (端口53)
        await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 1 u32 match ip dport 53 0xffff flowid 1:10`);
        await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 1 u32 match ip sport 53 0xffff flowid 1:10`);

        // ICMP (ping等)
        await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 1 u32 match ip protocol 1 0xff flowid 1:10`);

        // HTTP/HTTPS (端口80, 443) - 中等优先级
        await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 2 u32 match ip dport 80 0xffff flowid 1:11`);
        await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 2 u32 match ip dport 443 0xffff flowid 1:11`);

        // PT常用端口 - 低优先级
        if (this.config.ptPorts) {
            for (const port of this.config.ptPorts) {
                await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 3 u32 match ip dport ${port} 0xffff flowid 1:12`);
                await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 3 u32 match ip sport ${port} 0xffff flowid 1:12`);
            }
        }

        // 常见PT端口范围
        const commonPTPorts = [6881, 6882, 6883, 6884, 6885, 6886, 6887, 6888, 6889];
        for (const port of commonPTPorts) {
            try {
                await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 3 u32 match ip dport ${port} 0xffff flowid 1:12`);
                await execAsync(`tc filter add dev ${iface} parent 1: protocol ip prio 3 u32 match ip sport ${port} 0xffff flowid 1:12`);
            } catch (error) {
                // 忽略重复规则错误
            }
        }
    }

    /**
     * 开始网络监控
     */
    private startMonitoring(): void {
        this.monitoringInterval = setInterval(async () => {
            try {
                const metrics = await this.collectNetworkMetrics();
                await this.adaptiveAdjustment(metrics);
                this.lastMetrics = metrics;
            } catch (error) {
                console.error('网络监控出错:', error);
            }
        }, 10000); // 每10秒检查一次
    }

    /**
     * 收集网络指标
     */
    private async collectNetworkMetrics(): Promise<NetworkMetrics> {
        // 测试延迟 (ping本地网关)
        let latency = 0;
        try {
            const gateway = await this.getDefaultGateway();
            const { stdout } = await execAsync(`ping -c 1 -W 2000 ${gateway} | grep 'time=' | awk -F'time=' '{print $2}' | awk '{print $1}'`);
            latency = parseFloat(stdout.trim()) || 0;
        } catch (error) {
            console.warn('延迟测试失败:', error);
        }

        // 获取网络使用情况
        const networkStats = await si.networkStats(this.config.interface);
        const stats = Array.isArray(networkStats) ? networkStats[0] : networkStats;

        return {
            latency,
            uploadUsage: 0, // 需要根据配置的带宽计算
            downloadUsage: 0,
            activeConnections: 0 // 可以通过netstat或ss获取
        };
    }

    /**
     * 获取默认网关
     */
    private async getDefaultGateway(): Promise<string> {
        try {
            const { stdout } = await execAsync(`ip route | grep default | awk '{print $3}' | head -n1`);
            return stdout.trim() || '8.8.8.8'; // fallback to public DNS
        } catch (error) {
            return '8.8.8.8';
        }
    }

    /**
     * 自适应调整
     */
    private async adaptiveAdjustment(metrics: NetworkMetrics): Promise<void> {
        if (metrics.latency > this.config.normalLatencyThreshold) {
            console.log(`检测到高延迟 (${metrics.latency}ms)，调整QoS策略`);
            
            // 降低低优先级流量的带宽限制
            await this.adjustLowPriorityBandwidth(0.8); // 降低到80%
            
            // 可以考虑临时阻止新的PT连接
            if (this.config.ptPorts) {
                await this.temporaryThrottlePT();
            }
        } else if (this.lastMetrics && this.lastMetrics.latency > this.config.normalLatencyThreshold && 
                   metrics.latency <= this.config.normalLatencyThreshold) {
            console.log('延迟恢复正常，恢复QoS策略');
            
            // 恢复正常带宽分配
            await this.restoreNormalBandwidth();
        }
    }

    /**
     * 调整低优先级带宽
     */
    private async adjustLowPriorityBandwidth(factor: number): Promise<void> {
        const { interface: iface, totalUpload } = this.config;
        const newLowUpload = this.calculateBandwidth(totalUpload, 0.4 * factor);
        
        try {
            // 删除现有的低优先级类别
            await execAsync(`tc class del dev ${iface} classid 1:12`);
            
            // 重新创建调整后的类别
            await execAsync(`tc class add dev ${iface} parent 1:1 classid 1:12 htb rate ${newLowUpload} ceil ${totalUpload} prio 3`);
            await execAsync(`tc qdisc add dev ${iface} parent 1:12 handle 12: sfq perturb 10`);
            
            console.log(`低优先级带宽调整为: ${newLowUpload}`);
        } catch (error) {
            console.error('调整带宽失败:', error);
        }
    }

    /**
     * 临时限制PT流量
     */
    private async temporaryThrottlePT(): Promise<void> {
        // 可以通过iptables临时限制PT端口的连接数
        // 这里提供一个示例实现
        console.log('实施PT流量临时限制措施');
    }

    /**
     * 恢复正常带宽分配
     */
    private async restoreNormalBandwidth(): Promise<void> {
        // 重新设置QoS规则
        await this.clearRules();
        await this.setupAdvancedQoS();
    }

    /**
     * 计算带宽
     */
    private calculateBandwidth(totalBandwidth: string, percentage: number): string {
        const match = totalBandwidth.match(/^(\d+(?:\.\d+)?)(.*)$/);
        if (!match) return totalBandwidth;
        
        const value = parseFloat(match[1]);
        const unit = match[2];
        const newValue = Math.floor(value * percentage);
        
        return `${newValue}${unit}`;
    }

    /**
     * 清除所有tc规则
     */
    private async clearRules(): Promise<void> {
        try {
            await execAsync(`tc qdisc del dev ${this.config.interface} root 2>/dev/null`);
        } catch (error) {
            // 忽略清除失败的错误
        }
    }

    /**
     * 获取当前QoS状态
     */
    async getStatus(): Promise<any> {
        try {
            const { stdout } = await execAsync(`tc qdisc show dev ${this.config.interface}`);
            return {
                active: this.isActive,
                adaptive: this.config.enableAdaptive,
                rules: stdout,
                lastMetrics: this.lastMetrics
            };
        } catch (error) {
            return {
                active: false,
                error: (error as Error).message
            };
        }
    }
}