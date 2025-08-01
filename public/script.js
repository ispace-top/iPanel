// --- PREBUILT ICONS ---
const PREBUILT_ICONS = {
    // Services
    'plex': { name: 'Plex', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.232 12L7.025 7.793l4.207-4.208L15.44 7.793zm0 0l4.208 4.207-4.208 4.208-4.207-4.208z"/></svg>' },
    'jellyfin': { name: 'Jellyfin', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C7.582 0 4 3.582 4 8c0 2.454 1.104 4.653 2.859 6.079C4.347 14.61 2.5 17.619 2.5 21c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5c0-3.381 2.619-5.5 5.5-5.5s5.5 2.119 5.5 5.5c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5c0-3.381-1.847-6.39-4.359-6.921C18.896 12.653 20 10.454 20 8c0-4.418-3.582-8-8-8z"/></svg>' },
    'emby': { name: 'Emby', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-2.5-3.5l6-4.5-6-4.5v9z"/></svg>' },
    'docker': { name: 'Docker', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.146 11.236c-.225-.34-.543-.61-.91-.774a2.52 2.52 0 0 0-.936-.21H18.5V4.5a2.5 2.5 0 0 0-5 0v1H11v-1a2.5 2.5 0 0 0-5 0v1H3.5V3.5a2.5 2.5 0 0 0-2.22 2.493L1.25 6H6V5a1 1 0 0 1 2 0v1h5v-1a1 1 0 0 1 2 0v1h3.75c.133.001.266.012.398.033.402.067.785.21 1.13.43.344.22.64.512.872.863.232.352.392.754.464 1.173.072.418.072.846.001 1.264-.071.418-.214.82-.424 1.19-.21.37-.487.697-.822.968-.335.27-.724.478-1.148.612a2.5 2.5 0 0 0-1.255.07H3c-1.105 0-2-.895-2-2v-3a2 2 0 0 1 2-2h.5V4.5a.5.5 0 0 1 1 0v1h2V4.5a.5.5 0 0 1 1 0v1h2V4.5a.5.5 0 0 1 1 0v1h2V4.5a.5.5 0 0 1 1 0v1H15V4.5a.5.5 0 0 1 1 0v1h1.5a.5.5 0 0 1 0 1H17v1.5a.5.5 0 0 1-1 0V7.5h-1a.5.5 0 0 1 0-1h1V5.5a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5v2h2.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-2.5h-2a.5.5 0 0 1 0-1h2V6.5h-1a.5.5 0 0 1 0-1h1V4.5a1.5 1.5 0 0 1 3 0v1h1.5a1.5 1.5 0 0 1 .15 2.986l-.004.004c.061.421.051.849-.028 1.267-.08.418-.232.818-.453 1.188s-.508.697-.85.968c-.341.27-.74.478-1.17.612-.43.134-.88.196-1.33.18H3c-.552 0-1-.448-1-1v-3c0-.552.448-1 1-1h16.5c.34 0 .67.067.97.194.3.128.56.318.76.558.2.24.34.526.41.84.07.314.07.64 0 .954s-.14.61-.41.84c-.2.24-.46.43-.76.558-.3.127-.63.194-.97.194zM7 8H6V7h1zm5 0h-1V7h1zm5 0h-1V7h1z"/></svg>' },
    'portainer': { name: 'Portainer', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3A9,9,0,0,0,3,12A9,9,0,0,0,12,21A9,9,0,0,0,21,12A9,9,0,0,0,12,3M12,19A7,7,0,0,1,5,12A7,7,0,0,1,12,5A7,7,0,0,1,19,12A7,7,0,0,1,12,19M11,10L15,8V16L11,14V10Z" /></svg>' },
    'adguard': { name: 'AdGuard', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2L4,5V11C4,16.55 7.84,21.74 12,23C16.16,21.74 20,16.55 20,11V5L12,2M18,11C18,15.45 15.44,19.54 12,20.82C8.56,19.54 6,15.45 6,11V6.3L12,3.6L18,6.3V11Z" /></svg>' },
    'homeassistant': { name: 'Home Assistant', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2L2,12h3v8h14v-8h3L12,2z m5,16h-4v-6h-2v6H7v-7.81l5-4.5l5,4.5V18z"/></svg>' },
    'pihole': { name: 'Pi-hole', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18,6H16V4A1,1,0,0,0,15,3H9A1,1,0,0,0,8,4V6H6A1,1,0,0,0,5,7V17A1,1,0,0,0,6,18H8V20A1,1,0,0,0,9,21H15A1,1,0,0,0,16,20V18H18A1,1,0,0,0,19,17V7A1,1,0,0,0,18,6M10,6H14V11H10V6M14,18H10V13H14V18Z" /></svg>' },
    'qbittorrent': { name: 'qBittorrent', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2M15.22,15.78L13.44,9.67A1.5,1.5,0,0,0,12,8.44A1.5,1.5,0,0,0,10.5,9.67L8.78,15.78A1.5,1.5,0,0,0,10.17,17.5a1.5,1.5,0,0,0,1.66-.82A1.5,1.5,0,0,0,13.83,17.5a1.5,1.5,0,0,0,1.39-1.72Z" /></svg>' },
    'sonarr': { name: 'Sonarr', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16,11.78L20.24,4.45L22.24,5.55L16.22,15.55L14.78,12.22L12.55,16.55L11.11,15.44L16,11.78M4,2H19.5L22,6V18L19.5,22H4.5L2,18V6L4,2M4.5,4L3,6V18L4.5,20H19.5L21,18V6L19.5,4H4.5Z" /></svg>' },
    'radarr': { name: 'Radarr', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2M12,16.5A4.5,4.5,0,1,1,16.5,12,4.5,4.5,0,0,1,12,16.5M12,8.5A3.5,3.5,0,1,0,15.5,12,3.5,3.5,0,0,0,12,8.5Z" /></svg>' },
    'prowlarr': { name: 'Prowlarr', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2M15.6,14.19L14.19,15.6L12,13.41L9.81,15.6L8.4,14.19L10.59,12L8.4,9.81L9.81,8.4L12,10.59L14.19,8.4L15.6,9.81L13.41,12L15.6,14.19Z" /></svg>' },
    'overseerr': { name: 'Overseerr', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 13C9.24 17.5 7 15.26 7 12s2.24-5.5 5-5.5 5 2.24 5 5-2.24 5.5-5 5.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5z"/></svg>' },
    'synology': { name: 'Synology', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 10.5C5.67 10.5 5 11.17 5 12s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S7.33 10.5 6.5 10.5zm11 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-5.5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S12.83 10.5 12 10.5z"/><path d="M20.49 6.29l-1.42-1.42C18.33 4.13 17.17 4 16 4H8c-1.17 0-2.33.13-3.07.87L3.51 6.29C2.56 7.24 2 8.57 2 10v4c0 1.43.56 2.76 1.51 3.71l1.42 1.42C5.67 19.87 6.83 20 8 20h8c1.17 0 2.33-.13 3.07-.87l1.42-1.42c.95-.95 1.51-2.28 1.51-3.71v-4c0-1.43-.56-2.76-1.51-3.71zM18 16H6c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1z"/></svg>' },
    'truenas': { name: 'TrueNAS', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="m12.44 2.82l-9.13 5.27a1.4 1.4 0 0 0-.7 1.21v10.54c0 .5.28.98.74 1.21l9.13 5.27c.43.25.95.25 1.38 0l9.13-5.27a1.4 1.4 0 0 0 .7-1.21V9.3a1.4 1.4 0 0 0-.7-1.21l-9.13-5.27a1.4 1.4 0 0 0-1.38 0M12 5.5l7.06 4.08L12 13.65l-7.06-4.07L12 5.5m-.7 9.87l7.06-4.07l-7.06-4.08v8.15Z"/></svg>' },
    'unraid': { name: 'Unraid', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm-1 14.5v-5l-4-2.3v5l4 2.3zm2 0l4-2.3v-5l-4 2.3v5zm-1-6.5L16.95 8 12 5.25 7.05 8 12 10z"/></svg>' },
    'filebrowser': { name: 'File Browser', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>' },
    'nextcloud': { name: 'Nextcloud', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="6.5" cy="12" r="2.5"/><circle cx="17.5" cy="12" r="2.5"/><circle cx="12" cy="6.5" r="2.5"/><circle cx="12" cy="17.5" r="2.5"/></svg>' },
    // Generic categories
    'music': { name: '音乐', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3V13.55A4,4,0,1,0,14,17V7H18V3H12Z" /></svg>' },
    'movies': { name: '影视', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2,0,0,0,2,6V18A2,2,0,0,0,4,20H20A2,2,0,0,0,22,18V4H18Z" /></svg>' },
    'books': { name: '图书', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19,2H5A3,3,0,0,0,2,5V19A3,3,0,0,0,5,22H19A3,3,0,0,0,22,19V5A3,3,0,0,0,19,2M17,18H7V16H17V18M17,14H7V12H17V14M17,10H7V8H17V10Z" /></svg>' },
    'documents': { name: '文档', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2,0,0,0,4,4V20A2,2,0,0,0,6,22H18A2,2,0,0,0,20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>' },
    'wiki': { name: 'Wiki', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2M11,16.5V14.5H13V16.5H11M11,12.5V7.5H13V12.5H11Z" /></svg>' },
    'dashboard': { name: '仪表盘', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2M12,20A8,8,0,1,1,20,12,8,8,0,0,1,12,20M16.24,7.76L12,12L7.76,16.24L9.17,17.66L12,14.83L14.83,12L17.66,9.17L16.24,7.76Z" /></svg>' },
    'download': { name: '下载', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" /></svg>' },
    'router': { name: '路由器', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.2,5.9L22,7.7V11H20V8.4L18.6,7L17.2,8.4L15.8,7L14.4,8.4L13,7L11.6,8.4L10.2,7L8.8,8.4L7.4,7L6,8.4L4.6,7L2.8,8.8C2.3,8.3 2,7.7 2,7V5L3.8,3.2L5.2,4.6L6.6,3.2L8,4.6L9.4,3.2L10.8,4.6L12.2,3.2L13.6,4.6L15,3.2L16.4,4.6L17.8,3.2L19.2,4.6L20.2,5.9M20.8,13H3.2C2.6,13 2,13.2 2,13.7V17H22V13.7C22,13.2 21.4,13 20.8,13M5,15H7V16H5V15M8,15H10V16H8V15M11,15H13V16H11V15Z" /></svg>' },
    'storage': { name: '存储', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6,2H18A2,2,0,0,1,20,4V20A2,2,0,0,1,18,22H6A2,2,0,0,1,4,20V4A2,2,0,0,1,6,2M12,4A3,3,0,0,0,9,7A3,3,0,0,0,12,10A3,3,0,0,0,15,7A3,3,0,0,0,12,4Z" /></svg>' },
};

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const getElem = (id) => document.getElementById(id);

    // 网络限速相关元素
    const enableSpeedLimitCheckbox = getElem('enable-speed-limit');
    const speedLimitSettings = getElem('speed-limit-settings');
    const networkInterfaceSelect = getElem('network-interface');
    const speedLimitValueInput = getElem('speed-limit-value');
    const applySpeedLimitBtn = getElem('apply-speed-limit');
    const removeSpeedLimitBtn = getElem('remove-speed-limit');

    // 添加网络限速相关事件监听
    if (enableSpeedLimitCheckbox) {
        enableSpeedLimitCheckbox.addEventListener('change', toggleSpeedLimitSettings);
    }
    if (applySpeedLimitBtn) {
        applySpeedLimitBtn.addEventListener('click', applySpeedLimit);
    }
    if (removeSpeedLimitBtn) {
        removeSpeedLimitBtn.addEventListener('click', removeSpeedLimit);
    }
    const navContainer = getElem('nav-container');
    const systemInfoContent = getElem('system-info-content');
    const weatherContent = getElem('weather-content');
    const settingsBtn = getElem('settings-btn');
    const searchBarContainer = getElem('search-bar-container');

    // Search Bar
    const engineSelectBtn = getElem('engine-select-btn');
    const engineDropdown = getElem('engine-dropdown');
    const searchInput = getElem('search-input');
    const searchSubmitBtn = getElem('search-submit-btn');

    // Password Modal
    const passwordModal = getElem('password-modal');
    const closePasswordModalBtn = getElem('close-password-modal-btn');
    const passwordInput = getElem('password-input');
    const passwordError = getElem('password-error');
    const passwordSubmitBtn = getElem('password-submit-btn');

    // Settings Modal
    const settingsModal = getElem('settings-modal');
    const closeModalBtn = getElem('close-modal-btn');
    const saveSettingsBtn = getElem('save-settings-btn');
    const siteTitleInput = getElem('site-title-input');
    const newPasswordInput = getElem('new-password-input');
    const confirmPasswordInput = getElem('confirm-password-input');
    const navSettingsContainer = getElem('nav-settings-container');
    const addNavItemBtn = getElem('add-nav-item-btn');
    const weatherSettingsContainer = getElem('weather-settings-container');
    const addWeatherCityBtn = getElem('add-weather-city-btn');
    const searchSettingsContainer = getElem('search-settings-container');
    const addSearchEngineBtn = getElem('add-search-engine-btn');
    const backgroundSettingsContainer = getElem('background-settings-container');
    const bgUrlInputContainer = getElem('bg-url-input-container');
    const bgUrlInput = getElem('bg-url-input');
    const bgUploadContainer = getElem('bg-upload-container');
    const bgUploadBtn = getElem('bg-upload-btn');
    const bgUploadInput = getElem('bg-upload-input');
    const bgUploadPath = getElem('bg-upload-path');

    // Icon Picker
    const iconPickerModal = getElem('icon-picker-modal');
    const iconPickerGrid = getElem('icon-picker-grid');
    const closeIconPickerBtn = getElem('close-icon-picker-btn');
    const uploadFromPickerBtn = getElem('upload-from-picker-btn');

    // --- STATE ---
    let currentConfig = {};
    let activeIconForm = null;

    // --- DYNAMIC COLOR HELPERS ---
    // 用于文本颜色
    const getColorForPercentage = (percentage) => {
        if (percentage >= 80) return 'text-red-400';
        if (percentage >= 50) return 'text-yellow-400';
        return 'text-green-400';
    };

    // 用于背景颜色
    const getBgColorForPercentage = (percentage) => {
        if (percentage >= 80) return 'bg-red-400';
        if (percentage >= 50) return 'bg-yellow-400';
        return 'bg-green-400';
    };

    const getColorForCpuTemp = (temp) => {
        if (temp >= 80) return 'text-red-400';
        if (temp >= 60) return 'text-yellow-400';
        if (temp >= 40) return 'text-green-400';
        return 'text-cyan-400';
    };

    const getColorForWeatherTemp = (temp) => {
        const numericTemp = parseFloat(temp);
        if (numericTemp >= 30) return 'text-yellow-400';
        if (numericTemp >= 20) return 'text-green-400';
        if (numericTemp >= 10) return 'text-cyan-400';
        return 'text-blue-400';
    };

    // 根据天气图标ID返回颜色类名
    const getColorForWeatherIconId = (iconId) => {
        // 添加调试信息
        console.log('天气图标ID:', iconId);
        
        // 获取颜色值
        const color = getColorValueFromIconId(iconId);
        console.log('为图标', iconId, '应用颜色类:', color);
        
        // 返回颜色类名
        return color;
    };

    // 根据图标ID确定天气类型并返回颜色类名
    const getColorValueFromIconId = (iconId) => {
        // 晴天相关图标 (100-104, 150-153)
        if (['100', '101', '102', '103', '104', '150', '151', '152', '153'].includes(iconId)) return 'text-yellow-400';
        // 阴天相关图标 (300-302)
        if (['300', '301', '302'].includes(iconId)) return 'text-slate-500';
        // 多云相关图标 (303-314)
        if (['303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314'].includes(iconId)) return 'text-slate-300';
        // 雨天相关图标 (315-318, 350-351, 399)
        if (['315', '316', '317', '318', '350', '351', '399'].includes(iconId)) return 'text-blue-400';
        // 雪天相关图标 (400-407, 409-410, 456-457, 499)
        if (['400', '401', '402', '403', '404', '405', '406', '407', '409', '410', '456', '457', '499'].includes(iconId)) return 'text-cyan-300';
        // 雷暴相关图标 (500-515)
        if (['500', '501', '502', '503', '504', '507', '508', '509', '510', '511', '512', '513', '514', '515'].includes(iconId)) return 'text-purple-400';
        // 雾相关图标 (800-807)
        if (['800', '801', '802', '803', '804', '805', '806', '807'].includes(iconId)) return 'text-slate-400';
        // 寒冷相关图标 (900-901)
        if (['900', '901'].includes(iconId)) return 'text-blue-300';
        // 默认颜色
        console.log('未匹配到图标类型，使用默认颜色');
        return 'text-white';
    };

    // 保留原函数用于向后兼容
    const getColorForWeatherType = (weatherType) => {
        // 转换为小写以便匹配
        const type = weatherType.toLowerCase();

        // 晴天相关
        if (type.includes('晴')) return 'text-yellow-400';
        // 阴天相关
        if (type.includes('阴')) return 'text-slate-500';
        // 多云相关
        if (type.includes('云')) return 'text-slate-300';
        // 雨天相关
        if (type.includes('雨')) return 'text-blue-400';
        // 雪天相关
        if (type.includes('雪')) return 'text-cyan-300';
        // 雷暴相关（同时包含雷和暴）
        if (type.includes('雷') && type.includes('暴')) return 'text-purple-400';
        // 暴雨相关（只包含暴和雨）
        if (type.includes('暴') && type.includes('雨')) return 'text-blue-400';
        // 雾相关
        if (type.includes('雾')) return 'text-slate-400';
        // 默认颜色
        return 'text-white';
    };

    // 注意：此函数现在根据天气类型返回固定颜色，
    // 与实际天气无关，只与图标代表的天气类型相关

    // --- NETWORK SPEED LIMIT FUNCTIONS ---
    // 切换限速设置的显示/隐藏
    function toggleSpeedLimitSettings() {
        if (enableSpeedLimitCheckbox.checked) {
            speedLimitSettings.classList.remove('hidden');
        } else {
            speedLimitSettings.classList.add('hidden');
        }
    }

    // 应用限速设置
    async function applySpeedLimit() {
        const interfaceName = networkInterfaceSelect.value;
        const speedLimit = speedLimitValueInput.value.trim();

        if (!speedLimit) {
            alert('请输入限速值');
            return;
        }

        try {
            const response = await fetch('/api/network/speed-limit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    interface: interfaceName,
                    speed: speedLimit,
                    action: 'apply'
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('限速已应用');
            } else {
                alert('应用限速失败: ' + data.message);
            }
        } catch (error) {
            console.error('应用限速失败:', error);
            alert('应用限速失败，请检查网络连接');
        }
    }

    // 移除限速设置
    async function removeSpeedLimit() {
        const interfaceName = networkInterfaceSelect.value;

        try {
            const response = await fetch('/api/network/speed-limit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    interface: interfaceName,
                    action: 'remove'
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('限速已移除');
                enableSpeedLimitCheckbox.checked = false;
                toggleSpeedLimitSettings();
            } else {
                alert('移除限速失败: ' + data.message);
            }
        } catch (error) {
            console.error('移除限速失败:', error);
            alert('移除限速失败，请检查网络连接');
        }
    }

    // --- MAIN FUNCTIONS ---
    async function fetchConfigAndRender() {
        try {
            const response = await fetch('/api/config');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const config = await response.json();
            currentConfig = config;

            document.title = config.siteTitle || 'NAS 控制台';

            await applyBackground(config.background);
            renderNavItems(config.navItems || []);
            renderWeather(config.weather?.cities || []);
            populateSearch(config.search);
            populateSettingsModal(config);

        } catch (error) {
            console.error("获取或解析配置文件失败:", error);
            document.title = '加载失败';
            await applyBackground();
            navContainer.innerHTML = '<div class="text-center p-4 rounded-lg col-span-full">获取导航配置失败。</div>';
            weatherContent.innerHTML = '<div>获取天气配置失败。</div>';
        }
    }

    async function applyBackground(bgConfig) {
        let fallbackUrl = 'https://source.unsplash.com/random/1920x1080?nature,scenery';
        let bgUrl = fallbackUrl;

        if (!bgConfig) {
            document.body.style.backgroundImage = `url('${bgUrl}')`;
            return;
        }

        try {
            switch (bgConfig.type) {
                case 'bing':
                    const response = await fetch('/api/bing-wallpaper');
                    if (!response.ok) throw new Error('从后端获取壁纸失败');
                    const data = await response.json();
                    bgUrl = data.url;
                    break;
                case 'url':
                    if (bgConfig.value) bgUrl = bgConfig.value;
                    break;
                case 'upload':
                    if (bgConfig.value) bgUrl = bgConfig.value;
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("应用背景失败，将使用备用背景:", error);
            bgUrl = fallbackUrl;
        }

        document.body.style.backgroundImage = `url('${bgUrl}')`;
    }

    function renderNavItems(items) {
        navContainer.innerHTML = '';
        if (!items || items.length === 0) {
            navContainer.innerHTML = '<div class="text-center p-4 rounded-lg col-span-full">没有配置导航项，请在设置中添加。</div>';
            return;
        }
        items.forEach(item => {
            const div = document.createElement('a');
            div.href = item.url;
            div.target = "_blank";
            div.className = "icon-item flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-lg aspect-square";

            let iconHtml = getIconHtml(item.icon, 'w-12 h-12 mb-2');

            div.innerHTML = `${iconHtml}<span class="font-semibold text-center text-sm break-all">${item.name}</span>`;
            navContainer.appendChild(div);
        });
        lucide.createIcons();
    }

    // 全局变量，保持磁盘显示模式状态
    let diskDisplayMode = 'summary'; // 'summary' 或 'detailed'

    async function updateSystemInfo() {
        try {
            const response = await fetch('/api/system');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (!data) throw new Error("No data received from system API");
            // 添加调试信息，查看CPU数据结构
            // 已确认CPU数据结构，移除调试信息
            // console.log('CPU数据:', data.cpu);

            const formatBytes = (bytes, decimals = 2) => {
                if (!+bytes) return '0 Bytes'
                const k = 1024;
                const dm = decimals < 0 ? 0 : decimals;
                const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
            };

            // 格式化CPU频率（转换为GHz或MHz）
            const formatCpuFrequency = (speed) => {
                // 添加调试信息
                console.log('原始CPU频率数据:', speed);
                
                // 检查数据是否合理，有些系统可能返回GHz为单位的值
                if (speed < 10) {
                    // 可能已经是GHz单位
                    return `${speed.toFixed(2)} GHz`;
                } else if (speed >= 1000) {
                    return `${(speed / 1000).toFixed(2)} GHz`;
                } else {
                    return `${speed} MHz`;
                }
            };

            const cpuTemperature = data.cpu.temperature || 0;
            const cpuTempHtml = `<span class="font-mono ${getColorForCpuTemp(cpuTemperature)}">${cpuTemperature}°C</span>`;
            const cpuFrequencyHtml = formatCpuFrequency(data.cpu.speed || 0);

            const cpuHtml = `
                <div>
                    <h4 class="font-bold text-slate-100 mb-1">CPU</h4>
                    <div class="text-xs pl-2 space-y-2">
                        <div class="flex flex-wrap items-center w-full">
                            <span class="w-3/5 truncate font-medium text-left">${data.cpu.model || 'Unknown CPU'}</span>
                            <div class="w-2/5 flex justify-end space-x-2">
                                <span class="w-1/3 text-right">${data.cpu.cores}C/${data.cpu.cores}T</span>
                                <span class="w-1/3 text-right">${cpuFrequencyHtml}</span>
                                <span class="w-1/3 text-right">${cpuTempHtml}</span>
                            </div>
                        </div>
                        <div class="space-y-1">
                            <div class="flex justify-between items-center mb-1"><span></span><span class="font-mono ${getColorForPercentage(data.cpu.load)}">${(data.cpu.load || 0).toFixed(2)}%</span></div>
                            <div class="w-full bg-slate-700/50 rounded-full h-2.5"><div class="h-2.5 rounded-full ${getBgColorForPercentage(data.cpu.load)}" style="width: ${(data.cpu.load || 0).toFixed(2)}%"/></div>
                        </div>
                    </div>
                </div>`;

            const memHtml = `
                <div>
                    <h4 class="font-bold text-slate-100 mb-1">内存</h4>
                    <div class="space-y-1 text-xs pl-2">
                        <div class="flex justify-between items-center mb-1"><span></span><span class="font-mono ${getColorForPercentage(data.mem.usage)}">${(data.mem.usage || 0).toFixed(2)}%</span></div>
                        <div class="w-full bg-slate-700/50 rounded-full h-2.5"><div class="h-2.5 rounded-full ${getBgColorForPercentage(data.mem.usage)}" style="width: ${(data.mem.usage || 0).toFixed(2)}%"></div></div>
                        <div class="text-right text-slate-200 font-mono text-[10px]">${formatBytes(data.mem.used)} / ${formatBytes(data.mem.total)}</div>
                </div>
                    </div>
                </div>`;

            const networkHtml = `
                <div>
                    <h4 class="font-bold text-slate-100 mb-1">网络</h4>
                    <div class="text-xs pl-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span class="flex-shrink-0 mb-1 sm:mb-0 font-medium truncate">${data.net.ip || 'Unknown IP'}</span>
                        <div class="font-mono text-right">
                            <span class="inline-flex items-center text-green-400"><i data-lucide="arrow-up" class="w-3 h-3 mr-1"></i>${formatBytes((data.net.tx_sec || 0))}/s</span>
                            <span class="inline-flex items-center text-cyan-400 ml-2"><i data-lucide="arrow-down" class="w-3 h-3 mr-1"></i>${formatBytes((data.net.rx_sec || 0))}/s</span>
                        </div>
                    </div>
                </div>`;

            // 计算磁盘总使用率和总大小
            const totalDiskUsed = (data.fs || []).reduce((sum, d) => sum + (d.used || 0), 0);
            const totalDiskSize = (data.fs || []).reduce((sum, d) => sum + (d.size || 0), 0);
            const totalDiskUsage = totalDiskSize > 0 ? (totalDiskUsed / totalDiskSize) * 100 : 0;

            // 磁盘详细信息项
            const diskItems = (data.fs || []).map(d => `
                <div class="mb-3 last:mb-0">
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-medium truncate text-[10px]" title="${d.fs}">${d.fs}</span>
                        <span class="font-mono ${getColorForPercentage(d.use || 0)} text-[10px]">${(d.use || 0).toFixed(1)}%</span>
                    </div>
                    <div class="w-full bg-slate-700/50 rounded-full h-2"><div class="h-2 rounded-full ${getBgColorForPercentage(d.use || 0)}" style="width: ${(d.use || 0).toFixed(1)}%"></div></div>
                    <div class="text-right text-slate-200 font-mono text-[9px]">${formatBytes(d.used)} / ${formatBytes(d.size)}</div>
                </div>
            `).join('');

            // 磁盘总信息项
            const diskSummary = `
                <div class="mb-2">
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-medium text-[10px]">总使用率</span>
                        <span class="font-mono ${getColorForPercentage(totalDiskUsage)} text-[10px]">${totalDiskUsage.toFixed(1)}%</span>
                    </div>
                    <div class="w-full bg-slate-700/50 rounded-full h-2"><div class="h-2 rounded-full ${getBgColorForPercentage(totalDiskUsage)}" style="width: ${totalDiskUsage.toFixed(1)}%"/></div>
                    <div class="text-right text-slate-200 font-mono text-[9px]">${formatBytes(totalDiskUsed)} / ${formatBytes(totalDiskSize)}</div>
                </div>`;

            // 添加磁盘显示模式切换按钮

            // 切换按钮HTML (使用箭头图标)
            // summary模式(未展开)显示向上箭头，detailed模式(展开)显示向下箭头
            const toggleButton = `
                <button id="diskToggleBtn" class="ml-2 p-1 text-slate-300 hover:text-white transition-colors duration-200 focus:outline-none">
                    <i data-lucide="${diskDisplayMode === 'summary' ? 'chevron-up' : 'chevron-down'}" class="w-4 h-4"></i>
                </button>`;

            const diskHtml = `
                <div class="relative">
                    <h4 class="font-bold text-slate-100 mb-1 flex items-center">
                        磁盘
                        ${toggleButton}
                    </h4>
                    <div class="pl-2 text-xs" id="diskContent">
                        ${diskDisplayMode === 'summary' ? diskSummary : diskItems}
                    </div>
                </div>`;


            // 添加切换事件监听
            setTimeout(() => {
                const toggleBtn = document.getElementById('diskToggleBtn');
                const diskContent = document.getElementById('diskContent');
                if (toggleBtn && diskContent) {
                    toggleBtn.addEventListener('click', () => {
                        diskDisplayMode = diskDisplayMode === 'summary' ? 'detailed' : 'summary';
                        diskContent.innerHTML = diskDisplayMode === 'summary' ? diskSummary : diskItems;
                        // 更新箭头图标
                        // summary模式(未展开)显示向上箭头，detailed模式(展开)显示向下箭头
                        const icon = toggleBtn.querySelector('i[data-lucide]');
                        if (icon) {
                            icon.setAttribute('data-lucide', diskDisplayMode === 'summary' ? 'chevron-up' : 'chevron-down');
                            // 重新渲染图标
                            lucide.createIcons();
                        }
                    });
                }
            }, 0);

            systemInfoContent.innerHTML = `${cpuHtml}<hr class="border-white/10 my-3">${memHtml}<hr class="border-white/10 my-3">${networkHtml}<hr class="border-white/10 my-3">${diskHtml}`;
            lucide.createIcons();
        } catch (error) {
            console.error("更新系统信息失败:", error);
            systemInfoContent.innerHTML = '<div>获取系统信息失败。</div>';
        }
    }

    async function renderWeather(cities) {
        weatherContent.innerHTML = '';
        if (!cities || cities.length === 0) {
            weatherContent.innerHTML = '<div>没有配置天气城市。</div>';
            return;
        }
        try {
            const results = await Promise.allSettled(
                cities.map(city => fetch(`/api/weather?city=${encodeURIComponent(city)}`)
                .then(res => res.ok ? res.json() : Promise.reject({ city: city, reason: res.statusText }))
            ));
            let hasSuccess = false;
            results.forEach((result, index) => {
                const cityWeatherContainer = document.createElement('div');
                if (index > 0) 
                    cityWeatherContainer.classList.add('mt-4', 'pt-4', 'border-t', 'border-white/10');
                if (result.status === 'fulfilled' && result.value) {
                    hasSuccess = true;
                    const data = result.value;
                    const forecastData = (index === 0) ? data.forecast.slice(1, 3) : data.forecast;
                    const forecastRows = forecastData.map(day => {
                        // 提取图标ID
                        const iconId = day.icon.split('/').pop().split('.')[0];
                        // 获取颜色类名
                        const colorClass = getColorForWeatherIconId(iconId);
                        return `<tr class="border-b border-white/10 last:border-none"><td class="py-1">${day.date}</td><td class="py-1 text-center"><i class="qi-${iconId} text-xl ${colorClass}" alt="${day.description}"></i></td><td class="py-1 text-center">${day.description}</td><td class="py-1 text-right font-mono">${day.temp}</td></tr>`;
                    }).join('');

                    if (index === 0) {
                        // 提取当前天气图标ID
                        const currentIconId = data.now.icon.split('/').pop().split('.')[0];
                        // 获取当前天气图标颜色类名
                        const currentColorClass = getColorForWeatherIconId(currentIconId);
                        
                        cityWeatherContainer.innerHTML = `
                            <div class="text-center mb-4"><h4 class="font-bold text-xl text-slate-50">${data.city}</h4><div class="flex items-center justify-center gap-2 mt-1"><i class="qi-${currentIconId} text-5xl ${currentColorClass}" alt="${data.now.text}"></i><span class="text-5xl font-light ${getColorForWeatherTemp(data.now.temp)}">${data.now.temp}°</span></div><p class="text-slate-200 text-sm mt-1">${data.now.text}</p></div>
                            <hr class="border-white/10 my-3">
                            <div><h4 class="font-bold text-slate-100 mb-1">未来预报</h4><div class="pl-2 text-xs"><table class="w-full"><tbody>${forecastRows}</tbody></table></div></div>`;
                    } else {
                        cityWeatherContainer.innerHTML = `<div><h4 class="font-bold text-lg text-slate-50 mb-2">${data.city}</h4><div class="pl-2 text-xs"><table class="w-full"><tbody>${forecastRows}</tbody></table></div></div>`;
                    }
                } else {
                    cityWeatherContainer.innerHTML = `<div><strong>${cities[index]}:</strong> 获取天气失败。</div>`;
                }
                weatherContent.appendChild(cityWeatherContainer);
            });
            if (!hasSuccess) weatherContent.innerHTML = '<div>所有城市天气信息获取失败。</div>';
        } catch (error) {
            console.error("加载天气组件时出错:", error);
            weatherContent.innerHTML = '<div>加载天气组件时出错。</div>';
        }
    }

    // --- SEARCH LOGIC ---
    function populateSearch(searchConfig) {
        if (!searchConfig || !searchConfig.engines) return;

        const { engines, defaultEngine } = searchConfig;

        engineDropdown.innerHTML = engines.map(engine => `
            <button data-engine="${engine.name}" class="search-engine-option w-full text-left px-4 py-2 text-sm hover:bg-white/20 flex items-center gap-2">
                <span class="w-5 h-5">${engine.icon}</span>
                <span>${engine.name}</span>
            </button>
        `).join('');

        const defaultEngineData = engines.find(e => e.name === defaultEngine) || engines[0];
        if (defaultEngineData) {
            engineSelectBtn.innerHTML = `<span class="w-6 h-6">${defaultEngineData.icon}</span>`;
            engineSelectBtn.dataset.activeEngine = defaultEngineData.name;
        }
    }

    function handleSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        const activeEngineName = engineSelectBtn.dataset.activeEngine;
        const engine = currentConfig.search.engines.find(e => e.name === activeEngineName);
        if (engine) {
            const searchUrl = engine.url.replace('%s', encodeURIComponent(query));
            window.open(searchUrl, '_blank');
            searchInput.value = '';
        }
    }

    // --- PASSWORD & SETTINGS MODAL LOGIC ---
    function populateSettingsModal(config) {
        siteTitleInput.value = config.siteTitle || 'NAS 控制台';

        navSettingsContainer.innerHTML = '';
        (config.navItems || []).forEach(item => addNavItemForm(item));

        weatherSettingsContainer.innerHTML = '';
        (config.weather?.cities || []).forEach(city => addWeatherCityForm(city));

        // 加载天气API Key
        const weatherApiKeyInput = document.getElementById('weather-api-key');
        if (weatherApiKeyInput) {
            weatherApiKeyInput.value = config.weather?.apiKey || '';
        }

        searchSettingsContainer.innerHTML = '';
        (config.search?.engines || []).forEach(engine => {
            if (engine.custom) addSearchEngineForm(engine);
        });

        const bgConfig = config.background || { type: 'bing', value: '' };
        const radio = backgroundSettingsContainer.querySelector(`input[name="bg-type"][value="${bgConfig.type}"]`);
        if (radio) radio.checked = true;
        bgUrlInput.value = bgConfig.type === 'url' ? bgConfig.value : '';
        bgUploadPath.textContent = bgConfig.type === 'upload' ? bgConfig.value : '';
        updateBgSettingsVisibility();
    }

    function addNavItemForm(item = { name: '', url: '', icon: 'globe' }) {
        const div = document.createElement('div');
        div.className = 'p-2 bg-white/10 rounded-lg flex items-center gap-2';

        let iconHtml = getIconHtml(item.icon);

        div.innerHTML = `
            <input type="text" placeholder="名称" value="${item.name}" class="nav-name bg-transparent border-b border-white/30 p-1 w-1/4 focus:outline-none focus:border-white placeholder:text-slate-400">
            <input type="text" placeholder="URL" value="${item.url}" class="nav-url bg-transparent border-b border-white/30 p-1 flex-grow focus:outline-none focus:border-white placeholder:text-slate-400">
            <div class="icon-preview-container flex items-center gap-2">
                <input type="hidden" class="nav-icon" value="${item.icon}">
                <div class="icon-preview w-8 h-8 flex items-center justify-center">${iconHtml}</div>
                <button class="choose-icon-btn bg-white/10 hover:bg-white/20 p-2 rounded-md" title="选择图标"><i data-lucide="image"></i></button>
            </div>
            <input type="file" class="nav-icon-upload hidden" accept="image/*">
            <button class="remove-btn p-1 rounded-full hover:bg-white/20 text-red-400" title="删除此项"><i data-lucide="trash-2"></i></button>`;
        navSettingsContainer.appendChild(div);
        lucide.createIcons();
    }

    function addWeatherCityForm(city = '') {
        const div = document.createElement('div');
        div.className = 'p-2 bg-white/10 rounded-lg flex items-center gap-2';
        div.innerHTML = `
            <input type="text" placeholder="城市名称 (例如: 北京)" value="${city}" class="weather-city bg-transparent border-b border-white/30 p-1 flex-grow focus:outline-none focus:border-white placeholder:text-slate-400">
            <button class="remove-btn p-1 rounded-full hover:bg-white/20 text-red-400" title="删除此城市"><i data-lucide="trash-2"></i></button>`;
        weatherSettingsContainer.appendChild(div);
        lucide.createIcons();
    }

    function addSearchEngineForm(engine = { name: '', url: '', icon: '', custom: true }) {
        const div = document.createElement('div');
        div.className = 'p-2 bg-white/10 rounded-lg flex items-center gap-2';
        div.innerHTML = `
            <div class="flex items-center gap-2 flex-grow">
                <input type="text" placeholder="引擎名称" value="${engine.name}" class="search-engine-name bg-transparent border-b border-white/30 p-1 w-1/3 focus:outline-none focus:border-white placeholder:text-slate-400">
                <input type="text" placeholder="URL (用 %s 占位)" value="${engine.url}" class="search-engine-url bg-transparent border-b border-white/30 p-1 w-2/3 focus:outline-none focus:border-white placeholder:text-slate-400">
            </div>
             <div class="flex items-center gap-2 flex-grow-[2]">
                <textarea placeholder="图标SVG代码" class="search-engine-icon bg-transparent border-b border-white/30 p-1 w-full h-8 resize-none focus:outline-none focus:border-white placeholder:text-slate-400">${engine.icon}</textarea>
                <button class="remove-btn p-1 rounded-full hover:bg-white/20 text-red-400" title="删除此引擎"><i data-lucide="trash-2"></i></button>
            </div>
            `;
        searchSettingsContainer.appendChild(div);
        lucide.createIcons();
    }

    function updateBgSettingsVisibility() {
        const selectedType = backgroundSettingsContainer.querySelector('input[name="bg-type"]:checked')?.value;
        bgUrlInputContainer.classList.toggle('hidden', selectedType !== 'url');
        bgUploadContainer.classList.toggle('hidden', selectedType !== 'upload');
    }

    async function handleSaveSettings() {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword && newPassword !== confirmPassword) {
            alert('两次输入的密码不匹配！');
            return;
        }

        const siteTitle = siteTitleInput.value;
        const navItems = Array.from(navSettingsContainer.children).map(div => ({ name: div.querySelector('.nav-name').value, url: div.querySelector('.nav-url').value, icon: div.querySelector('.nav-icon').value }));
        const cities = Array.from(weatherSettingsContainer.children).map(div => div.querySelector('.weather-city').value).filter(city => city.trim() !== '');
        const weatherApiKeyInput = document.getElementById('weather-api-key');
        const apiKey = weatherApiKeyInput ? weatherApiKeyInput.value : '';

        const customEngines = Array.from(searchSettingsContainer.children).map(div => ({
            name: div.querySelector('.search-engine-name').value,
            url: div.querySelector('.search-engine-url').value,
            icon: div.querySelector('.search-engine-icon').value,
            custom: true
        }));

        // Keep the default engines from the current config and add the new custom ones
        const defaultEngines = currentConfig.search.engines.filter(e => !e.custom);

        const search = {
            engines: [...defaultEngines, ...customEngines],
            defaultEngine: currentConfig.search?.defaultEngine
        };

        const bgType = backgroundSettingsContainer.querySelector('input[name="bg-type"]:checked')?.value;
        let bgValue = '';
        if (bgType === 'url') bgValue = bgUrlInput.value;
        else if (bgType === 'upload') bgValue = bgUploadPath.textContent;

        const newConfig = { siteTitle, navItems, weather: { cities, apiKey }, search, background: { type: bgType, value: bgValue } };

        if (newPassword) {
            newConfig.password = newPassword;
        }

        try {
            const response = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newConfig) });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || `HTTP error! status: ${response.status}`);
            }
            alert('设置已保存！页面将重新加载以应用更改。');
            location.reload();
        } catch (error) {
            console.error("保存设置失败:", error);
            alert(`保存设置失败: ${error.message}`);
        }
    }

    // --- ICON PICKER LOGIC ---
    function getIconHtml(iconIdentifier, sizeClass = 'w-8 h-8') {
        if (iconIdentifier?.startsWith('prebuilt:')) {
            const iconId = iconIdentifier.replace('prebuilt:', '');
            const prebuiltIcon = PREBUILT_ICONS[iconId];
            return prebuiltIcon ? `<div class="${sizeClass} text-white">${prebuiltIcon.svg}</div>` : `<i data-lucide="globe" class="${sizeClass}"></i>`;
        } else if (iconIdentifier?.startsWith('/uploads/')) {
            return `<img src="${iconIdentifier}" class="${sizeClass} object-contain" alt="icon">`;
        } else {
            return `<i data-lucide="${iconIdentifier || 'globe'}" class="${sizeClass}"></i>`;
        }
    }

    function populateIconPicker() {
        iconPickerGrid.innerHTML = '';
        Object.entries(PREBUILT_ICONS).forEach(([id, icon]) => {
            const button = document.createElement('button');
            button.className = "icon-picker-item flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 backdrop-blur-md shadow-lg aspect-square";
            button.dataset.iconId = `prebuilt:${id}`;
            button.innerHTML = `
                <div class="w-10 h-10 text-white">${icon.svg}</div>
                <span class="text-xs mt-2 text-slate-300">${icon.name}</span>
            `;
            iconPickerGrid.appendChild(button);
        });
    }

    function openIconPicker(formElement) {
        activeIconForm = formElement;
        iconPickerModal.classList.remove('hidden');
    }

    function selectIcon(iconId) {
        if (!activeIconForm) return;
        const iconInput = activeIconForm.querySelector('.nav-icon');
        const iconPreview = activeIconForm.querySelector('.icon-preview');
        iconInput.value = iconId;
        iconPreview.innerHTML = getIconHtml(iconId);
        lucide.createIcons();
        iconPickerModal.classList.add('hidden');
        activeIconForm = null;
    }

    // --- EVENT LISTENERS ---
    const closePasswordModal = () => {
        passwordModal.classList.add('hidden');
        passwordInput.value = '';
        passwordError.classList.add('hidden');
    };

    settingsBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            currentConfig = config; // Refresh config before opening
            if (config.hasPassword) {
                passwordModal.classList.remove('hidden');
                passwordInput.focus();
            } else {
                settingsModal.classList.remove('hidden');
            }
        } catch (error) {
            alert('无法获取配置，请刷新页面重试。');
        }
    });

    closePasswordModalBtn.addEventListener('click', closePasswordModal);
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            closePasswordModal();
        }
    });

    passwordSubmitBtn.addEventListener('click', async () => {
        passwordError.classList.add('hidden');
        const response = await fetch('/api/verify-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput.value })
        });

        if (!response.ok) {
            passwordError.textContent = '服务器错误，请稍后重试。';
            passwordError.classList.remove('hidden');
            return;
        }

        const result = await response.json();
        if (result.success) {
            closePasswordModal();
            settingsModal.classList.remove('hidden');
        } else {
            passwordError.textContent = '密码错误！';
            passwordError.classList.remove('hidden');
        }
    });
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') passwordSubmitBtn.click();
    });


    closeModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    saveSettingsBtn.addEventListener('click', handleSaveSettings);
    addNavItemBtn.addEventListener('click', () => addNavItemForm());
    addWeatherCityBtn.addEventListener('click', () => addWeatherCityForm());
    addSearchEngineBtn.addEventListener('click', () => addSearchEngineForm());
    bgUploadBtn.addEventListener('click', () => bgUploadInput.click());
    backgroundSettingsContainer.addEventListener('change', updateBgSettingsVisibility);

    settingsModal.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-btn');
        if (removeBtn) removeBtn.parentElement.remove();

        const chooseIconBtn = e.target.closest('.choose-icon-btn');
        if (chooseIconBtn) openIconPicker(chooseIconBtn.closest('.icon-preview-container'));
    });

    closeIconPickerBtn.addEventListener('click', () => iconPickerModal.classList.add('hidden'));
    uploadFromPickerBtn.addEventListener('click', () => {
        if (activeIconForm) activeIconForm.closest('.flex').querySelector('.nav-icon-upload').click();
    });
    iconPickerGrid.addEventListener('click', (e) => {
        const pickerItem = e.target.closest('.icon-picker-item');
        if (pickerItem) selectIcon(pickerItem.dataset.iconId);
    });

    engineSelectBtn.addEventListener('click', () => engineDropdown.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
        if (!searchBarContainer.contains(e.target)) {
            engineDropdown.classList.add('hidden');
        }
    });
    engineDropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.search-engine-option');
        if (option) {
            const engineName = option.dataset.engine;
            const engineData = currentConfig.search.engines.find(eng => eng.name === engineName);
            if (engineData) {
                engineSelectBtn.innerHTML = `<span class="w-6 h-6">${engineData.icon}</span>`;
                engineSelectBtn.dataset.activeEngine = engineName;
                currentConfig.search.defaultEngine = engineName;
            }
            engineDropdown.classList.add('hidden');
        }
    });
    searchSubmitBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    settingsModal.addEventListener('change', async (e) => {
        const target = e.target;
        if (target.classList.contains('nav-icon-upload') && target.files[0]) {
            const formData = new FormData();
            formData.append('icon', target.files[0]);
            try {
                const response = await fetch('/api/upload/icon', { method: 'POST', body: formData });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                selectIcon(result.filePath);
            } catch (error) { alert('图标上传失败！'); }
        }
        if (target.id === 'bg-upload-input' && target.files[0]) {
            const formData = new FormData();
            formData.append('background', target.files[0]);
            try {
                const response = await fetch('/api/upload/background', { method: 'POST', body: formData });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                bgUploadPath.textContent = result.filePath;
            } catch (error) { alert('背景上传失败！'); }
        }
    });

    function init() {
        populateIconPicker();
        fetchConfigAndRender();
        updateSystemInfo();
        setInterval(updateSystemInfo, 5000);
    }

    init();
});
