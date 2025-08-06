import { initDateTime } from './components/datetime.js';
import { initWeather } from './components/weather.js';
import { initSearch } from './components/search.js';
import { initSystemInfo } from './components/system-info.js';
import { initNavigation } from './components/navigation.js';
import { initModals } from './modals/modals.js';
import { initSettings } from './modals/settings.js';
import { API_ENDPOINTS } from './config/constants.js';
import { handleApiResponse } from './utils/format.js';

async function initApp() {
    let currentConfig = {};
    const cleanupFunctions = [];
    
    try {
        // 初始化模态框和设置
        initModals();
        initSettings();
        
        // 获取配置
        const response = await fetch(API_ENDPOINTS.config);
        currentConfig = await handleApiResponse(response, '获取配置失败');
        
        // 设置页面标题
        document.title = currentConfig.siteTitle || 'NAS 控制台';
        
        // 初始化时间组件
        cleanupFunctions.push(initDateTime());
        
        // 初始化搜索
        const { updateEngines } = initSearch();
        if (currentConfig.search) {
            updateEngines(currentConfig.search.engines, currentConfig.search.defaultEngine);
        }
        
        // 初始化导航
        const { renderNavigation } = initNavigation();
        if (currentConfig.nav) {
            renderNavigation(currentConfig.nav);
        }
        
        // 初始化系统信息
        cleanupFunctions.push(initSystemInfo());
        
        // 初始化天气组件
        const { renderWeather } = initWeather();
        if (currentConfig.weather && currentConfig.weather.cities) {
            renderWeather(currentConfig.weather.cities);
            setInterval(() => renderWeather(currentConfig.weather.cities), 300000);
        }
        
        // 应用背景
        applyBackground(currentConfig.background);
        
    } catch (error) {
        console.error('初始化失败:', error);
        // 显示错误信息给用户
        document.getElementById('nav-container').innerHTML = '<div class="text-center p-4 rounded-lg col-span-full text-red-400">加载配置失败，请检查后端服务是否正常运行</div>';
    }
    
    // 返回清理函数
    return () => cleanupFunctions.forEach(cleanup => cleanup());
}

// 应用背景
async function applyBackground(bgConfig) {
    const fallbackUrl = 'https://source.unsplash.com/random/1920x1080?nature,scenery';
    let bgUrl = fallbackUrl;
    
    document.body.style.backgroundColor = '#1e293b';
    
    if (!bgConfig) {
        document.body.style.backgroundImage = `url('${bgUrl}')`;
        return;
    }
    
    try {
        switch (bgConfig.type) {
            case 'bing':
                const response = await fetch(API_ENDPOINTS.bing);
                if (!response.ok) throw new Error('获取必应壁纸失败');
                const data = await response.json();
                bgUrl = data.url;
                break;
            case 'url':
                if (bgConfig.value) bgUrl = bgConfig.value;
                break;
            case 'upload':
                if (bgConfig.value) bgUrl = bgConfig.value;
                break;
        }
    } catch (error) {
        console.error('应用背景失败，使用默认背景:', error);
        bgUrl = fallbackUrl;
    }
    
    document.body.style.backgroundImage = `url('${bgUrl}')`;
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 处理需要密码验证的链接
window.handlePasswordProtectedLink = function(url) {
    window.showPasswordModal((_password) => {
        // 这里应该验证密码，暂时直接打开链接
        window.open(url, '_blank');
        window.hidePasswordModal?.();
    });
};
