import si from 'systeminformation';

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
        const [cpuData, memData, fsData, netData, temp] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.cpuTemperature(),
        ]);

        const load = await si.currentLoad();

        // 为 'n' 参数添加了显式类型
        // Added explicit type for parameter 'n'
        const defaultInterface = netData[0]?.iface || 'default';
        const netStat = netData.find((n: si.Systeminformation.NetworkStatsData) => n.iface === defaultInterface) || netData[0];

        const info = {
            cpu: {
                manufacturer: cpuData.manufacturer,
                brand: cpuData.brand,
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
                tx_sec: netStat?.tx_sec
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
