import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * 应用网络限速设置
 * @param interfaceName 网络接口名称 (如 eth0, wlan0)
 * @param speedLimit 限速值 (如 3mbit)
 * @returns 是否成功及消息
 */
export async function applySpeedLimit(interfaceName: string, speedLimit: string): Promise<{ success: boolean; message: string }> {
    // 统一在函数开始时清空旧规则
    try {
        await execAsync(`tc qdisc del dev ${interfaceName} root 2>/dev/null`);
    } catch (error) {
        console.log(`接口 ${interfaceName} 上没有找到现有规则，将直接应用新规则。`);
    }

    // 优先尝试使用 CAKE 算法
    try {
        const cakeCommand = `tc qdisc add dev ${interfaceName} root cake bandwidth ${speedLimit} besteffort triple-isolate nat`;
        console.log(`正在尝试执行优化的 CAKE 限速命令: ${cakeCommand}`);
        await execAsync(cakeCommand);
        return { success: true, message: `已成功为接口 ${interfaceName} 应用优化的 CAKE 限速 ${speedLimit}` };
    } catch (cakeError) {
        const cakeErrorMessage = (cakeError as Error).message;
        if (cakeErrorMessage.includes('Unknown qdisc') || cakeErrorMessage.includes('Specified qdisc kind is unknown')) {
            // 如果 CAKE 不可用，则回退到 HTB + fq_codel
            console.warn(`CAKE 不可用 (${cakeErrorMessage.trim()})，尝试回退到 HTB + fq_codel。`);
            try {
                // 应用 HTB (Hierarchical Token Bucket) 来设置总带宽
                await execAsync(`tc qdisc add dev ${interfaceName} root handle 1: htb default 1`);
                // 为 HTB 创建一个类别来应用速率限制
                await execAsync(`tc class add dev ${interfaceName} parent 1: classid 1:1 htb rate ${speedLimit}`);
                // 在该类别下应用 fq_codel 算法以管理延迟
                await execAsync(`tc qdisc add dev ${interfaceName} parent 1:1 fq_codel`);
                
                return { success: true, message: `CAKE 不可用。已成功为接口 ${interfaceName} 应用 fq_codel 回退限速 ${speedLimit}` };
            } catch (fqCodelError) {
                const fqCodelErrorMessage = (fqCodelError as Error).message;
                console.error('fq_codel 回退失败:', fqCodelError);
                return { success: false, message: `回退方案 fq_codel 应用失败: ${fqCodelErrorMessage}` };
            }
        } else {
            // 如果是 CAKE 的其他错误
            console.error('应用 CAKE 限速时发生未知错误:', cakeError);
            return { success: false, message: `应用限速失败: ${cakeErrorMessage}` };
        }
    }
};

/**
 * 查询网络限速状态
 * @param interfaceName 网络接口名称 (如 eth0, wlan0)
 * @returns 限速状态信息
 */
export async function getSpeedLimitStatus(interfaceName: string): Promise<{ 
    success: boolean; 
    hasLimit: boolean; 
    speed?: string; 
    message: string 
}> {
    try {
        const { stdout } = await execAsync(`tc qdisc show dev ${interfaceName}`);
        
        // 检查是否为 CAKE 规则
        if (stdout.includes('qdisc cake')) {
            const speedMatch = stdout.match(/bandwidth\s+([^\s]+)/);
            return {
                success: true,
                hasLimit: true,
                speed: speedMatch ? speedMatch[1] : '未知',
                message: `接口 ${interfaceName} 当前有 CAKE 限速规则。`
            };
        } 
        // 检查是否为 HTB + fq_codel 回退规则
        else if (stdout.includes('qdisc htb') && stdout.includes('qdisc fq_codel')) {
            const { stdout: classStdout } = await execAsync(`tc class show dev ${interfaceName}`);
            const speedMatch = classStdout.match(/rate\s+([^\s]+)/);
             return {
                success: true,
                hasLimit: true,
                speed: speedMatch ? speedMatch[1].replace('bit', 'bit') : '未知', // 规范化单位
                message: `接口 ${interfaceName} 当前有 fq_codel (HTB) 回退限速规则。`
            };
        }
        
        return {
            success: true,
            hasLimit: false,
            message: `接口 ${interfaceName} 当前没有限速规则。`
        };
    } catch (error) {
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
export async function removeSpeedLimit(interfaceName: string): Promise<{ success: boolean; message: string }> {
    try {
        // 这个命令可以移除 CAKE 或 HTB 根规则
        await execAsync(`tc qdisc del dev ${interfaceName} root 2>/dev/null`);
        return { success: true, message: `已成功移除接口 ${interfaceName} 的所有限速规则。` };
    } catch (error) {
        console.error('移除限速时出错 (可能规则已不存在):', error);
        return { success: true, message: `已成功移除接口 ${interfaceName} 的所有限速规则。` };
    }
};
