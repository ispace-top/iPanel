import si from 'systeminformation';
import os from 'os';
import fs from 'fs';
import path from 'path';

export async function getSystemInfo() {
    try {
        // Changed type to any[] to resolve compilation error
        let fansData: any[] = [];
        try {
            // 尝试获取风扇数据，如果不支持则跳过，避免程序崩溃
            // Try to get fan data, skip if not supported to avoid crashing
            // Cast 'si' to 'any' to bypass the strict type check for the 'fans' method
            fansData = await (si as any).fans();
            // oxlint-disable-next-line no-unused-vars
        } catch (error) {
        }

        // 并行获取所有其他数据以提高性能
        // Fetch all other data in parallel to improve performance
        // 添加获取网络接口信息以获取IP地址
        const [cpuData, memData, fsData, netData, temp, networkInterfaces] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.cpuTemperature(),
            si.networkInterfaces(),
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
                    console.log('CPU info content:', cpuInfo.substring(0, 500)); // 输出前500个字符用于调试
                    
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
            
            return 'Unknown CPU';
        };

        const load = await si.currentLoad();

        // 为 'n' 参数添加了显式类型
        // Added explicit type for parameter 'n'
        const defaultInterface = netData[0]?.iface || 'default';
        const netStat = netData.find((n: si.Systeminformation.NetworkStatsData) => n.iface === defaultInterface) || netData[0];

        const info = {
            cpu: {
                manufacturer: cpuData.manufacturer,
                brand: cpuData.brand,
                model: getCpuModel(), // 使用辅助函数获取CPU型号，支持ARM架构
                rawBrand: cpuData.brand, // 添加原始品牌数据用于调试
                cores: cpuData.cores,
                speed: cpuData.speed,
                load: load.currentLoad,
                temperature: temp.main,
                fanSpeed: fansData[0]?.speed || 0, // 重新添加风扇转速 (Re-added fan speed)
            },
            mem: {
                total: memData.total,
                used: memData.used,
                free: memData.free,
                usage: (memData.used / memData.total) * 100
            },
            // 为 'd' 参数添加了显式类型
            // Added explicit type for parameter 'd'
            fs: fsData.map((d: si.Systeminformation.FsSizeData) => ({
                fs: d.fs,
                type: d.type,
                size: d.size,
                used: d.used,
                available: d.available,
                use: d.use
            })),
            net: {
                iface: netStat?.iface,
                rx_sec: netStat?.rx_sec,
                tx_sec: netStat?.tx_sec,
                ip: (() => {
                    try {
                        // 使用Node.js内置os模块获取网络接口
                        const nets = os.networkInterfaces();
                        console.log('Node.js network interfaces:', nets);
                        
                        for (const name of Object.keys(nets)) {
                            // 跳过本地回环接口
                            if (name === 'lo0') continue;
                            
                            for (const net of nets[name] || []) {
                                // 跳过IPv6地址和内部地址
                                if (net.family === 'IPv4' && !net.internal) {
                                    console.log(`Found IPv4 address: ${net.address} on interface ${name}`);
                                    return net.address;
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error getting network interfaces:', error);
                    }
                    
                    console.warn('No IPv4 address found on non-loopback interfaces');
                    return 'Unknown IP';
                })()
            },
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
        // Return a default structure on error to prevent frontend from crashing
        return {
            cpu: { load: 0, cores: 0, speed: 0, temperature: 0, fanSpeed: 0 },
            mem: { total: 0, used: 0, free: 0, usage: 0 },
            fs: [],
            net: { rx_sec: 0, tx_sec: 0 },
            time: {}
        };
    }
}
