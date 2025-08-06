import { API_ENDPOINTS, UPDATE_INTERVALS } from '../config/constants.js';
import { formatBytes, getColorForPercentage, getBgColorForPercentage } from '../utils/format.js';
import { handleApiResponse } from '../utils/format.js';

export function initSystemInfo() {
    const systemInfoContent = document.getElementById('system-info-content');
    
    async function updateSystemInfo() {
        try {
            const response = await fetch(API_ENDPOINTS.system);
            const data = await handleApiResponse(response, '获取系统信息失败');
            
            // 计算物理磁盘使用情况
            const diskUsageMap = {};
            
            // 为每个物理磁盘计算使用情况
            data.diskPartitions.forEach(partition => {
                // 简单映射：系统盘通常对应第一块物理磁盘
                const diskIndex = partition.mount === '/' ? 0 : Math.min(data.physicalDisks.length - 1, 0);
                const diskKey = `disk_${diskIndex}`;
                
                if (!diskUsageMap[diskKey]) {
                    diskUsageMap[diskKey] = {
                        totalUsed: 0,
                        totalSize: 0,
                        partitions: []
                    };
                }
                
                diskUsageMap[diskKey].totalUsed += partition.used;
                diskUsageMap[diskKey].totalSize += partition.total;
                diskUsageMap[diskKey].partitions.push(partition);
            });
            
            // 生成物理磁盘HTML - 显示物理磁盘规格和使用情况
            const diskItems = data.physicalDisks.map((disk, index) => {
                const diskKey = `disk_${index}`;
                const usage = diskUsageMap[diskKey];
                const usagePercent = usage ? (usage.totalUsed / usage.totalSize) * 100 : 0;
                
                return `
                <div class="mb-2">
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-medium text-[10px] text-slate-300">${disk.name || `磁盘${index + 1}`}</span>
                        <span class="font-mono ${usage ? getColorForPercentage(usagePercent) : 'text-slate-500'} text-[10px]">
                            ${usage ? usagePercent.toFixed(1) + '%' : '未挂载'}
                        </span>
                    </div>
                    ${usage ? `
                        <div class="w-full bg-slate-700/50 rounded-full h-1.5 mb-1">
                            <div class="h-1.5 rounded-full ${getBgColorForPercentage(usagePercent)}" style="width: ${usagePercent.toFixed(1)}%"></div>
                        </div>
                        <div class="flex justify-between items-center text-[9px]">
                            <span class="text-slate-400 truncate">
                                ${disk.vendor ? `${disk.vendor} ` : ''}${disk.type || 'Unknown'} ${disk.interfaceType || ''}
                            </span>
                            <span class="text-slate-200 font-mono ml-2">${formatBytes(usage.totalUsed)} / ${formatBytes(disk.size)}</span>
                        </div>
                    ` : `
                        <div class="text-slate-400 text-[9px] truncate">
                            ${disk.vendor ? `${disk.vendor} ` : ''}${disk.type || 'Unknown'} ${disk.interfaceType || ''} • ${formatBytes(disk.size)}
                        </div>
                    `}
                </div>
            `;
            }).join('');
            
            // 渲染系统信息
            const html = `
                <!-- CPU信息 -->
                <div class="border-b border-white/10 pb-4 mb-4">
                    <h4 class="font-bold text-slate-100 mb-1">处理器</h4>
                    <div class="pl-2">
                        <div class="flex justify-end items-center mb-1">
                            <span class="font-mono ${getColorForPercentage(data.cpu.usage)} text-sm">${data.cpu.usage.toFixed(1)}%</span>
                        </div>
                        <div class="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                            <div class="h-2 rounded-full ${getBgColorForPercentage(data.cpu.usage)}" style="width: ${data.cpu.usage.toFixed(1)}%"></div>
                        </div>
                        <div class="text-xs text-slate-200 space-y-1">
                            <div class="flex justify-between items-center">
                                <span class="truncate flex-1">${data.cpu.model || 'Unknown CPU'}</span>
                                <span class="ml-2">${data.cpu.physicalCores || data.cpu.cores}C/${data.cpu.cores}T</span>
                                <span class="ml-2">${(data.cpu.currentSpeed || data.cpu.speed || 0).toFixed(1)} GHz</span>
                                ${data.cpu.temperature > 0 ? `<span class="ml-2 ${data.cpu.temperature > 70 ? 'text-red-400' : data.cpu.temperature > 50 ? 'text-yellow-400' : 'text-green-400'}">${data.cpu.temperature.toFixed(1)}°C</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 内存信息 -->
                <div class="border-b border-white/10 pb-4 mb-4">
                    <h4 class="font-bold text-slate-100 mb-1">内存</h4>
                    <div class="pl-2">
                        <div class="flex justify-end items-center mb-1">
                            <span class="font-mono ${getColorForPercentage(data.memory.usage)} text-sm">${data.memory.usage.toFixed(1)}%</span>
                        </div>
                        <div class="w-full bg-slate-700/50 rounded-full h-2 mb-1">
                            <div class="h-2 rounded-full ${getBgColorForPercentage(data.memory.usage)}" style="width: ${data.memory.usage.toFixed(1)}%"></div>
                        </div>
                        <div class="text-right text-slate-200 text-xs">${formatBytes(data.memory.used)} / ${formatBytes(data.memory.total)}</div>
                    </div>
                </div>
                
                <!-- 网络信息 -->
                <div class="border-b border-white/10 pb-4 mb-4">
                    <h4 class="font-bold text-slate-100 mb-1">网络</h4>
                    <div class="pl-2">
                        ${data.network.length > 0 ? `
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-mono text-slate-200">${data.network[0].ip || '未知IP'}</span>
                                <div class="flex gap-2">
                                    <span class="text-green-400">↑${formatBytes(data.network[0].sent)}/s</span>
                                    <span class="text-blue-400">↓${formatBytes(data.network[0].received)}/s</span>
                                </div>
                            </div>
                        ` : '<div class="text-slate-400 text-xs">无网络信息</div>'}
                    </div>
                </div>
                
                <!-- 磁盘信息 -->
                <div>
                    <h4 class="font-bold text-slate-100 mb-1">磁盘</h4>
                    <div class="pl-2 space-y-2">
                        ${diskItems}
                    </div>
                </div>
            `;
            
            systemInfoContent.innerHTML = html;
            lucide.createIcons();
            
            
        } catch (error) {
            console.error('更新系统信息失败:', error);
            systemInfoContent.innerHTML = '<div>获取系统信息失败。</div>';
        }
    }
    
    // 初始更新
    updateSystemInfo();
    
    // 设置定时更新
    const timer = setInterval(updateSystemInfo, UPDATE_INTERVALS.system);
    
    // 返回清理函数
    return () => clearInterval(timer);
}
