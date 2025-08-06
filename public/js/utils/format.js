// 格式化字节大小
export function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 格式化百分比的颜色
export function getColorForPercentage(percentage) {
    if (percentage >= 80) return 'text-red-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-green-400';
}

// 格式化背景色
export function getBgColorForPercentage(percentage) {
    if (percentage >= 80) return 'bg-red-400';
    if (percentage >= 50) return 'bg-yellow-400';
    return 'bg-green-400';
}

// 处理API响应
export async function handleApiResponse(response, errorMessage = '操作失败') {
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `${errorMessage}: ${response.status}`);
    }
    return response.json();
}
