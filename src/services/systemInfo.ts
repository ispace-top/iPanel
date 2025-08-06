import si from 'systeminformation';
import os from 'os';
import fs from 'fs';
import path from 'path';

var fristError=0;

export async function getSystemInfo() {
    try {
        let fansData: any[] = [];
        try {
            // 尝试获取风扇数据，如果不支持则跳过，避免程序崩溃
            fansData = await (si as any).fans();
        } catch (error) {
            if (fristError < 1) {
                console.warn("WARN：获取风扇转速失败，系统不支持或无传感器。");
                fristError++;
            }
        }

        // 并行获取所有其他数据以提高性能
        // 添加获取网络接口信息以获取IP地址
        const [cpuData, memData, fsData, netData, temp, networkInterfaces, cpuSpeed, diskLayout] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.cpuTemperature(),
            si.networkInterfaces(),
            si.cpuCurrentSpeed(),
            si.diskLayout()
        ]);

        // 获取CPU型号的辅助函数，支持ARM架构
        const getCpuModel = () => {
            try {
                // 尝试从systeminformation库获取
                if (cpuData.brand && cpuData.brand.toLowerCase() !== 'unknown' && cpuData.brand !== '0') {
                    return cpuData.brand;
                }

                // 如果在ARM架构上运行，尝试从/proc/cpuinfo读取
                const cpuInfoPath = '/proc/cpuinfo';
                if (fs.existsSync(cpuInfoPath)) {
                    const cpuInfo = fs.readFileSync(cpuInfoPath, 'utf-8');
                    // 查找CPU型号信息（不同ARM设备可能有不同的标签）
                    const modelMatch = cpuInfo.match(/model\s+name\s*:\s*(.+)/i) ||
                                      cpuInfo.match(/processor\s+:\s*(.+)/i) ||
                                      cpuInfo.match(/cpu\s+:\s*(.+)/i) ||
                                      cpuInfo.match(/hardware\s+:\s*(.+)/i); // 增加对hardware标签的支持
                    
                    if (modelMatch && modelMatch[1] && modelMatch[1].trim() !== '0') {
                        return modelMatch[1].trim();
                    } else if (modelMatch) {
                        console.warn('CPU model match found but value is invalid:', modelMatch[1]);
                    }
                } else {
                    console.warn('CPU info path does not exist:', cpuInfoPath);
                }
            } catch (error) {
                console.error('Error getting CPU model:', error);
            }
            
            return '未知CPU';
        };

        const load = await si.currentLoad();

        // 为 'n' 参数添加了显式类型
        const defaultInterface = netData[0]?.iface || 'default';
        const netStat = netData.find((n: si.Systeminformation.NetworkStatsData) => n.iface === defaultInterface) || netData[0];

        const info = {
            cpu: {
                manufacturer: cpuData.manufacturer,
                brand: cpuData.brand,
                model: getCpuModel(), // 使用辅助函数获取CPU型号，支持ARM架构
                rawBrand: cpuData.brand, // 添加原始品牌数据用于调试
                cores: cpuData.cores,
                physicalCores: cpuData.physicalCores,
                speed: cpuData.speed, // 基础频率
                speedMin: cpuData.speedMin,
                speedMax: cpuData.speedMax,
                currentSpeed: cpuSpeed.avg || cpuSpeed.cores?.[0] || cpuData.speed, // 当前运行频率
                usage: load.currentLoad,
                temperature: temp.main || temp.max || 0,
                fanSpeed: fansData[0]?.speed || 0, // 重新添加风扇转速 (Re-added fan speed)
            },
            memory: {
                total: memData.total,
                used: memData.used,
                free: memData.free,
                usage: (memData.used / memData.total) * 100
            },
            // 物理磁盘信息（基于实际硬件）
            physicalDisks: diskLayout.map((disk: any) => ({
                name: disk.name || disk.device,
                type: disk.type,
                vendor: disk.vendor,
                size: disk.size,
                interfaceType: disk.interfaceType
            })),
            // 磁盘分区使用情况
            diskPartitions: fsData
                .filter((d: si.Systeminformation.FsSizeData) => {
                    // 排除虚拟文件系统和特殊分区
                    const excludeTypes = ['devfs', 'tmpfs', 'sysfs', 'proc', 'squashfs', 'overlay'];
                    const excludeMounts = ['/dev', '/sys', '/proc', '/run', '/boot/efi', '/snap'];
                    
                    // 排除特定类型的文件系统
                    if (excludeTypes.includes(d.type.toLowerCase())) {
                        return false;
                    }
                    
                    // 排除特定挂载点
                    if (excludeMounts.some(mount => d.mount.startsWith(mount))) {
                        return false;
                    }
                    
                    // 只保留大小大于0的磁盘
                    return d.size > 0;
                })
                .map((d: si.Systeminformation.FsSizeData) => ({
                    mount: d.mount,
                    fs: d.fs,
                    type: d.type,
                    total: d.size,
                    used: d.used,
                    available: d.available,
                    use: d.use
                })),
            network: netData.map((n: si.Systeminformation.NetworkStatsData) => ({
                interface: n.iface,
                sent: n.tx_sec || 0,
                received: n.rx_sec || 0,
                ip: (() => {
                    try {
                        // 使用Node.js内置os模块获取网络接口
                        const nets = os.networkInterfaces();
                        for (const name of Object.keys(nets)) {
                            // 跳过本地回环接口
                            if (name === 'lo0') continue;
                            
                            for (const net of nets[name] || []) {
                                // 跳过IPv6地址和内部地址
                                if (net.family === 'IPv4' && !net.internal) {
                                    return net.address;
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error getting network interfaces:', error);
                    }
                    
                    console.warn('No IPv4 address found on non-loopback interfaces');
                    return '未知IP';
                })()
            })),
            time: {
                current: si.time().current,
                uptime: si.time().uptime,
                timezone: si.time().timezone,
                timezoneName: si.time().timezoneName
            }
        };

        return info;
    } catch (e) {
        console.error("获取系统信息时出错 (Error getting system info):", e);
        // 在出错时返回一个默认结构，防止前端崩溃
        return {
            cpu: { load: 0, cores: 0, speed: 0, temperature: 0, fanSpeed: 0 },
            mem: { total: 0, used: 0, free: 0, usage: 0 },
            fs: [],
            net: { rx_sec: 0, tx_sec: 0 },
            time: {}
        };
    }
}
