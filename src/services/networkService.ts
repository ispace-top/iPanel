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
        // 先清空现有规则
        await execAsync(`tc qdisc del dev ${interfaceName} root > /dev/null 2>&1`);
    } catch (error) {
        // 忽略删除失败的错误，可能是因为没有现有规则
        console.log(`没有找到现有规则，继续应用新规则`);
    }

    try {
        // 检查系统是否支持CAKE算法
        const checkCake = await execAsync(`tc qdisc add dev ${interfaceName} root cake bandwidth 1mbit > /dev/null 2>&1 || echo "CAKE not supported"`);
        
        if (checkCake.stdout.includes('CAKE not supported')) {
            // 尝试安装所需软件包
            try {
                console.log('系统不支持CAKE算法，尝试安装所需软件...');
                
                // 检查是否为Debian系统
                const isDebian = await execAsync(`grep -q Debian /etc/os-release && echo "Debian" || echo "Other"`);
                
                if (isDebian.stdout.trim() === 'Debian') {
                    // 对于Debian系统，尝试添加backports仓库并安装支持CAKE的iproute2
                    console.log('检测到Debian系统，尝试通过backports安装支持CAKE的iproute2...');
                    await execAsync(`sudo apt update`);
                    // 尝试安装backports版本的iproute2
                    try {
                        await execAsync(`sudo apt install -y -t $(lsb_release -sc)-backports iproute2`);
                    } catch (backportError) {
                        console.log('无法通过backports安装，尝试常规安装...');
                        await execAsync(`sudo apt install -y iproute2`);
                    }
                } else {
                    // 非Debian系统，尝试常规安装
                    await execAsync(`sudo apt update && sudo apt install -y iproute2`);
                }
                
                // 再次检查
                const checkAgain = await execAsync(`tc qdisc add dev ${interfaceName} root cake bandwidth 1mbit > /dev/null 2>&1 || echo "CAKE still not supported"`);
                if (checkAgain.stdout.includes('CAKE still not supported')) {
                    return {
                        success: false,
                        message: `系统不支持CAKE算法。在Debian上，您可能需要启用backports仓库或手动编译支持CAKE的iproute2版本。\n\n安装指南：\n1. 启用backports仓库：echo "deb http://deb.debian.org/debian $(lsb_release -sc)-backports main" | sudo tee /etc/apt/sources.list.d/backports.list\n2. 更新包列表：sudo apt update\n3. 安装backports版本的iproute2：sudo apt install -y -t $(lsb_release -sc)-backports iproute2`
                    };
                }
            } catch (installError) {
                return { success: false, message: `安装CAKE支持失败: ${(installError as Error).message}` };
            }
        }
        
        // 删除检查时添加的规则
        await execAsync(`tc qdisc del dev ${interfaceName} root > /dev/null 2>&1`);
        
        // 应用新的CAKE规则
        await execAsync(`tc qdisc add dev ${interfaceName} root cake bandwidth ${speedLimit}`);

        return { success: true, message: `已成功为接口 ${interfaceName} 应用CAKE限速 ${speedLimit}` };
    } catch (error) {
        console.error('应用限速失败:', error);
        return { success: false, message: `应用限速失败: ${(error as Error).message}` };
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
        if (stdout.includes('cake')) {
            // 尝试获取限速值
            const speedMatch = stdout.match(/bandwidth\s+(\w+)/);
            
            return {
                success: true,
                hasLimit: true,
                speed: speedMatch ? speedMatch[1] : '未知',
                message: `接口 ${interfaceName} 当前有CAKE限速规则`
            };
        }
        
        return {
            success: true,
            hasLimit: false,
            message: `接口 ${interfaceName} 没有限速规则`
        };
    } catch (error) {
        console.error('查询限速状态失败:', error);
        return {
            success: false,
            hasLimit: false,
            message: `查询限速状态失败: ${(error as Error).message}`
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
        // 清空规则
        await execAsync(`tc qdisc del dev ${interfaceName} root`);
        return { success: true, message: `已成功移除接口 ${interfaceName} 的限速` };
    } catch (error) {
        console.error('移除限速失败:', error);
        return { success: false, message: `移除限速失败: ${(error as Error).message}` };
    }
};
