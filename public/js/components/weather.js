import { API_ENDPOINTS } from '../config/constants.js';
import { handleApiResponse } from '../utils/format.js';

export function initWeather() {
    const weatherContent = document.getElementById('weather-content');
    
    function getColorForWeatherTemp(temp) {
        const numericTemp = parseFloat(temp);
        if (numericTemp >= 30) return 'text-yellow-400';
        if (numericTemp >= 20) return 'text-green-400';
        if (numericTemp >= 10) return 'text-cyan-400';
        return 'text-blue-400';
    }
    
    function getWeatherIcon(iconId) {
        // 根据和风天气图标ID返回对应的图标
        const iconMap = {
            '100': '☀️', // 晴
            '101': '🌤️', // 多云
            '102': '⛅', // 少云
            '103': '☁️', // 晴间多云
            '104': '☁️', // 阴
            '150': '☀️', // 晴（夜间）
            '300': '🌦️', // 阵雨
            '301': '🌧️', // 强阵雨
            '302': '⛈️', // 雷阵雨
            '303': '⛈️', // 强雷阵雨
            '304': '⛈️', // 雷阵雨伴冰雹
            '305': '🌦️', // 小雨
            '306': '🌧️', // 中雨
            '307': '🌧️', // 大雨
            '308': '🌧️', // 极端降雨
            '309': '🌦️', // 毛毛雨/细雨
            '310': '🌧️', // 暴雨
            '311': '🌧️', // 大暴雨
            '312': '🌧️', // 特大暴雨
            '313': '🌦️', // 冻雨
            '314': '🌦️', // 小到中雨
            '315': '🌧️', // 中到大雨
            '316': '🌧️', // 大到暴雨
            '317': '🌧️', // 暴雨到大暴雨
            '318': '🌧️', // 大暴雨到特大暴雨
            '399': '🌧️', // 雨
            '400': '❄️', // 小雪
            '401': '🌨️', // 中雪
            '402': '🌨️', // 大雪
            '403': '🌨️', // 暴雪
            '404': '🌨️', // 雨夹雪
            '405': '🌨️', // 小到中雪
            '406': '🌨️', // 中到大雪
            '407': '🌨️', // 大到暴雪
            '408': '❄️', // 小雨转雪
            '409': '🌨️', // 中雨转雪
            '410': '🌨️', // 大雨转雪
            '499': '❄️', // 雪
            '500': '🌫️', // 薄雾
            '501': '🌫️', // 雾
            '502': '🌫️', // 霾
            '503': '🌪️', // 扬沙
            '504': '🌪️', // 浮尘
            '507': '🌪️', // 沙尘暴
            '508': '🌪️', // 强沙尘暴
            '509': '🌫️', // 浓雾
            '510': '🌫️', // 强浓雾
            '511': '🌫️', // 中度霾
            '512': '🌫️', // 重度霾
            '513': '🌫️' // 严重霾
        };
        
        return iconMap[iconId] || '🌤️';
    }
    
    async function renderWeather(cities) {
        if (!cities || cities.length === 0) {
            weatherContent.innerHTML = '<div class="text-slate-400">没有配置天气城市。请在设置中添加城市。</div>';
            return;
        }
        
        weatherContent.innerHTML = '<div class="text-slate-400">正在加载天气信息...</div>';
        
        try {
            const results = await Promise.allSettled(
                cities.map(city => 
                    fetch(`${API_ENDPOINTS.weather}?city=${encodeURIComponent(city)}`)
                    .then(res => handleApiResponse(res, '获取天气信息失败'))
                )
            );
            
            const weatherData = results
                .map((result, index) => {
                    if (result.status === 'fulfilled') {
                        return result.value;
                    } else {
                        console.error(`获取 ${cities[index]} 天气失败:`, result.reason);
                        return null;
                    }
                })
                .filter(data => data !== null);
            
            if (weatherData.length === 0) {
                weatherContent.innerHTML = '<div class="text-red-400">无法获取天气信息。请检查网络连接和API密钥配置。</div>';
                return;
            }
            
            // 渲染天气信息
            const weatherHTML = weatherData.map((weather, index) => {
                if (index === 0) {
                    // 主要城市 - 大字体显示
                    return `
                        <div class="weather-item border-b border-white/10 pb-4 mb-4">
                            <div class="text-center mb-3">
                                <h5 class="font-medium text-slate-100 mb-1">${weather.city}</h5>
                                <div class="flex items-center justify-center gap-2 mb-2">
                                    <span class="text-2xl">${getWeatherIcon(weather.now.iconId || weather.now.icon)}</span>
                                    <div class="text-3xl font-light ${getColorForWeatherTemp(weather.now.temp)}">${weather.now.temp}°C</div>
                                </div>
                                <div class="text-sm text-slate-300">${weather.now.text}</div>
                            </div>
                            
                            ${weather.forecast && weather.forecast.length > 0 ? `
                                <div class="space-y-1">
                                    ${weather.forecast.slice(1, 3).map(day => `
                                        <div class="grid grid-cols-4 gap-2 items-center text-xs">
                                            <span class="text-slate-200 text-center">${day.date}</span>
                                            <span class="text-lg text-center">${getWeatherIcon(day.iconId || day.icon)}</span>
                                            <span class="text-slate-100 font-mono text-center">${day.temp}</span>
                                            <span class="text-slate-200 text-center truncate">${day.description}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
                } else {
                    // 次要城市 - 城市名行与预报行格式保持一致，城市名更突出
                    return `
                        <div class="weather-item border-b border-white/10 last:border-b-0 pb-3 last:pb-0 mb-3 last:mb-0">
                            ${weather.forecast && weather.forecast.length > 0 ? `
                                <div class="space-y-1">
                                    <div class="grid grid-cols-4 gap-2 items-center text-xs">
                                        <span class="text-white text-center font-bold text-sm bg-white/10 px-2 py-1 rounded-md">${weather.city}</span>
                                        <span class="text-lg text-center">${getWeatherIcon(weather.now.iconId || weather.now.icon)}</span>
                                        <span class="text-slate-100 font-mono text-center">${weather.now.tempRange || weather.now.temp + '°'}</span>
                                        <span class="text-slate-200 text-center truncate">${weather.now.text}</span>
                                    </div>
                                    ${weather.forecast.slice(1, 3).map(day => `
                                        <div class="grid grid-cols-4 gap-2 items-center text-xs">
                                            <span class="text-slate-200 text-center">${day.date}</span>
                                            <span class="text-lg text-center">${getWeatherIcon(day.iconId || day.icon)}</span>
                                            <span class="text-slate-100 font-mono text-center">${day.temp}</span>
                                            <span class="text-slate-200 text-center truncate">${day.description}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="grid grid-cols-4 gap-2 items-center text-xs">
                                    <span class="text-white text-center font-bold text-sm bg-white/10 px-2 py-1 rounded-md">${weather.city}</span>
                                    <span class="text-lg text-center">${getWeatherIcon(weather.now.iconId || weather.now.icon)}</span>
                                    <span class="text-slate-100 font-mono text-center">${weather.now.tempRange || weather.now.temp + '°'}</span>
                                    <span class="text-slate-200 text-center truncate">${weather.now.text}</span>
                                </div>
                            `}
                        </div>
                    `;
                }
            }).join('');
            
            weatherContent.innerHTML = weatherHTML;
            
        } catch (error) {
            console.error('更新天气信息失败:', error);
            weatherContent.innerHTML = '<div class="text-red-400">获取天气信息失败。</div>';
        }
    }
    
    // 返回更新函数供外部调用
    return { renderWeather };
}
