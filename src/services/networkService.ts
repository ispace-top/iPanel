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
    try {
        // 先清空现有规则
        // 使用输出重定向代替stdio选项，以避免TypeScript类型错误
        await execAsync(`tc qdisc del dev ${interfaceName} root > /dev/null 2>&1`);
    } catch (error) {
        // 忽略删除失败的错误，可能是因为没有现有规则
        console.log(`没有找到现有规则，继续应用新规则`);
    }

    try {
        // 应用新规则
        await execAsync(`tc qdisc add dev ${interfaceName} root handle 1: htb default 12`);
        await execAsync(`tc class add dev ${interfaceName} parent 1: classid 1:1 htb rate ${speedLimit} burst 15k`);
        await execAsync(`tc class add dev ${interfaceName} parent 1:1 classid 1:12 htb rate ${speedLimit} burst 15k`);

        return { success: true, message: `已成功为接口 ${interfaceName} 应用限速 ${speedLimit}` };
    } catch (error) {
        console.error('应用限速失败:', error);
        return { success: false, message: `应用限速失败: ${(error as Error).message}` };
    }
}

/**
 * 移除网络限速设置
 * @param interfaceName 网络接口名称 (如 eth0, wlan0)
 * @returns 是否成功及消息
 */
export async function removeSpeedLimit(interfaceName: string): Promise<{ success: boolean; message: string }> {
    try {
        // 清空规则
        await execAsync(`tc qdisc del dev ${interfaceName} root`);
        return { success: true, message: `已成功移除接口 ${interfaceName} 的限速` };
    } catch (error) {
        console.error('移除限速失败:', error);
        return { success: false, message: `移除限速失败: ${(error as Error).message}` };
    }
}