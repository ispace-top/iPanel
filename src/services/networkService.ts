const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * 应用网络限速设置
 * @param interfaceName 网络接口名称 (如 eth0, wlan0)
 * @param speedLimit 限速值 (如 3mbit)
 * @returns 是否成功及消息
 */
exports.applySpeedLimit = async function(interfaceName: string, speedLimit: string): Promise<{ success: boolean; message: string }> {
    try {
        // 先清空该网络接口上所有现有的 qdisc 规则，以便应用新规则
        // We ignore errors here because a rule might not exist, which is fine.
        await execAsync(`tc qdisc del dev ${interfaceName} root 2>/dev/null`);
    } catch (error) {
        // 忽略删除失败的错误，这通常意味着之前没有设置规则
        console.log(`接口 ${interfaceName} 上没有找到现有规则，将直接应用新规则。`);
    }

    try {
        // 优化后的 CAKE 命令
        // The optimized CAKE command with additional parameters to reduce latency.
        // - besteffort: 默认的尽力而为模式
        // - triple-isolate: 提供强大的流隔离，确保没有单个连接可以霸占所有带宽，是降低延迟的关键
        // - nat: 启用 NAT (网络地址转换) 感知，帮助 CAKE 更好地区分内部和外部流量，对 Docker 等场景很重要
        const command = `tc qdisc add dev ${interfaceName} root cake bandwidth ${speedLimit} besteffort triple-isolate nat`;
        
        console.log(`正在执行优化的限速命令: ${command}`);
        await execAsync(command);

        return { success: true, message: `已成功为接口 ${interfaceName} 应用优化的CAKE限速 ${speedLimit}` };
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('应用限速失败:', error);

        // 如果命令失败，可能是因为内核不支持 CAKE。提供友好的提示。
        if (errorMessage.includes('Unknown qdisc "cake"')) {
            return {
                success: false,
                message: `应用限速失败: 您的系统内核似乎不支持 "cake" 队列算法。请尝试升级您的内核或安装包含 "cake" 的 iproute2 工具包。`
            };
        }
        
        return { success: false, message: `应用限速失败: ${errorMessage}` };
    }
};

/**
 * 查询网络限速状态
 * @param interfaceName 网络接口名称 (如 eth0, wlan0)
 * @returns 限速状态信息
 */
exports.getSpeedLimitStatus = async function(interfaceName: string): Promise<{ 
    success: boolean; 
    hasLimit: boolean; 
    speed?: string; 
    message: string 
}> {
    try {
        const { stdout } = await execAsync(`tc qdisc show dev ${interfaceName}`);
        
        // 检查输出中是否包含cake规则
        if (stdout.includes('qdisc cake')) {
            // 尝试从输出中解析带宽值
            const speedMatch = stdout.match(/bandwidth\s+([^\s]+)/);
            
            return {
                success: true,
                hasLimit: true,
                speed: speedMatch ? speedMatch[1] : '未知',
                message: `接口 ${interfaceName} 当前有CAKE限速规则。`
            };
        }
        
        return {
            success: true,
            hasLimit: false,
            message: `接口 ${interfaceName} 当前没有限速规则。`
        };
    } catch (error) {
        // 如果查询命令失败（例如接口不存在），则认为没有限速
        return {
            success: true,
            hasLimit: false,
            message: `接口 ${interfaceName} 不存在或无法查询。`
        };
    }
};

/**
 * 移除网络限速设置
 * @param interfaceName 网络接口名称 (如 eth0, wlan0)
 * @returns 是否成功及消息
 */
exports.removeSpeedLimit = async function(interfaceName: string): Promise<{ success: boolean; message: string }> {
    try {
        // 使用与应用时相同的命令来删除规则
        await execAsync(`tc qdisc del dev ${interfaceName} root 2>/dev/null`);
        return { success: true, message: `已成功移除接口 ${interfaceName} 的所有限速规则。` };
    } catch (error) {
        // 即使删除失败（可能规则已不存在），也视为成功，因为目标是确保没有规则
        console.error('移除限速时出错 (可能规则已不存在):', error);
        return { success: true, message: `已成功移除接口 ${interfaceName} 的所有限速规则。` };
    }
};
