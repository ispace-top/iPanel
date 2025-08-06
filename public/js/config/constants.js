export const API_ENDPOINTS = {
    weather: '/api/weather',
    system: '/api/system',
    config: '/api/config',
    bing: '/api/bing-wallpaper',
    upload: {
        icon: '/api/upload/icon',
        background: '/api/upload/background'
    },
    network: '/api/network/speed-limit'
};

export const UPDATE_INTERVALS = {
    datetime: 1000,
    weather: 300000,
    system: 5000
};

export const COMMON_ICONS = {
    // 系统类
    'router': { name: '路由器', icon: '<i data-lucide="router"></i>' },
    'server': { name: '服务器', icon: '<i data-lucide="server"></i>' },
    'hard-drive': { name: '硬盘', icon: '<i data-lucide="hard-drive"></i>' },
    'monitor': { name: '显示器', icon: '<i data-lucide="monitor"></i>' },
    'smartphone': { name: '手机', icon: '<i data-lucide="smartphone"></i>' },
    'laptop': { name: '笔记本', icon: '<i data-lucide="laptop"></i>' },
    'database': { name: '数据库', icon: '<i data-lucide="database"></i>' },
    'cloud': { name: '云服务', icon: '<i data-lucide="cloud"></i>' },
    'shield': { name: '安全', icon: '<i data-lucide="shield"></i>' },
    'settings': { name: '设置', icon: '<i data-lucide="settings"></i>' },
    
    // 媒体类
    'play': { name: '播放器', icon: '<i data-lucide="play"></i>' },
    'music': { name: '音乐', icon: '<i data-lucide="music"></i>' },
    'video': { name: '视频', icon: '<i data-lucide="video"></i>' },
    'image': { name: '图片', icon: '<i data-lucide="image"></i>' },
    'camera': { name: '相机', icon: '<i data-lucide="camera"></i>' },
    'headphones': { name: '耳机', icon: '<i data-lucide="headphones"></i>' },
    'tv': { name: '电视', icon: '<i data-lucide="tv"></i>' },
    'radio': { name: '电台', icon: '<i data-lucide="radio"></i>' },
    
    // 网络类
    'globe': { name: '网站', icon: '<i data-lucide="globe"></i>' },
    'wifi': { name: 'WiFi', icon: '<i data-lucide="wifi"></i>' },
    'link': { name: '链接', icon: '<i data-lucide="link"></i>' },
    'mail': { name: '邮件', icon: '<i data-lucide="mail"></i>' },
    'message-circle': { name: '消息', icon: '<i data-lucide="message-circle"></i>' },
    'phone': { name: '电话', icon: '<i data-lucide="phone"></i>' },
    'download': { name: '下载', icon: '<i data-lucide="download"></i>' },
    'upload': { name: '上传', icon: '<i data-lucide="upload"></i>' },
    
    // 工具类
    'tool': { name: '工具', icon: '<i data-lucide="wrench"></i>' },
    'code': { name: '代码', icon: '<i data-lucide="code"></i>' },
    'terminal': { name: '终端', icon: '<i data-lucide="terminal"></i>' },
    'git-branch': { name: 'Git', icon: '<i data-lucide="git-branch"></i>' },
    'file-text': { name: '文档', icon: '<i data-lucide="file-text"></i>' },
    'folder': { name: '文件夹', icon: '<i data-lucide="folder"></i>' },
    'search': { name: '搜索', icon: '<i data-lucide="search"></i>' },
    'bookmark': { name: '书签', icon: '<i data-lucide="bookmark"></i>' },
    
    // 应用类
    'home': { name: '首页', icon: '<i data-lucide="home"></i>' },
    'user': { name: '用户', icon: '<i data-lucide="user"></i>' },
    'users': { name: '用户组', icon: '<i data-lucide="users"></i>' },
    'calendar': { name: '日历', icon: '<i data-lucide="calendar"></i>' },
    'clock': { name: '时钟', icon: '<i data-lucide="clock"></i>' },
    'map': { name: '地图', icon: '<i data-lucide="map"></i>' },
    'shopping-cart': { name: '购物', icon: '<i data-lucide="shopping-cart"></i>' },
    'heart': { name: '收藏', icon: '<i data-lucide="heart"></i>' },
    'star': { name: '星标', icon: '<i data-lucide="star"></i>' },
    'flag': { name: '标记', icon: '<i data-lucide="flag"></i>' }
};
