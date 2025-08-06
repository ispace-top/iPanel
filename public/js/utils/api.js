import { handleApiResponse } from './format.js';
import { API_ENDPOINTS } from '../config/constants.js';

// API请求包装器
async function fetchApi(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(endpoint, { ...defaultOptions, ...options });
        return await handleApiResponse(response);
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
}

// 配置相关API
export async function getConfig() {
    return await fetchApi(API_ENDPOINTS.config);
}

// 系统信息相关API
export async function getSystemInfo() {
    return await fetchApi(API_ENDPOINTS.systemInfo);
}

// 天气相关API
export async function getWeather(city) {
    return await fetchApi(`${API_ENDPOINTS.weather}?city=${encodeURIComponent(city)}`);
}

// 壁纸相关API
export async function getBingWallpaper() {
    return await fetchApi(API_ENDPOINTS.bing);
}

export async function uploadWallpaper(file) {
    const formData = new FormData();
    formData.append('wallpaper', file);
    
    return await fetchApi(API_ENDPOINTS.uploadWallpaper, {
        method: 'POST',
        headers: {}, // 让浏览器自动设置 Content-Type
        body: formData
    });
}

// 密码验证API
export async function verifyPassword(password) {
    return await fetchApi(API_ENDPOINTS.verify, {
        method: 'POST',
        body: JSON.stringify({ password })
    });
}
