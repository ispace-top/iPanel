import { API_ENDPOINTS } from '../config/constants.js';
import { handleApiResponse } from '../utils/format.js';
import { COMMON_ICONS } from '../config/constants.js';

export function initSettings() {
    let currentConfig = {};
    
    async function loadSettings() {
        try {
            const response = await fetch(API_ENDPOINTS.config);
            currentConfig = await handleApiResponse(response, '加载设置失败');
            populateSettingsForm(currentConfig);
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }
    
    function populateSettingsForm(config) {
        // 页面标题
        if (config.siteTitle) {
            document.getElementById('site-title-input').value = config.siteTitle;
        }
        
        // 天气API密钥
        if (config.weather?.apiKey) {
            document.getElementById('weather-api-key').value = config.weather.apiKey;
        }
        
        // 背景设置
        if (config.background) {
            const bgType = config.background.type || 'bing';
            document.querySelector(`input[name="bg-type"][value="${bgType}"]`)?.click();
            
            if (bgType === 'url' && config.background.value) {
                document.getElementById('bg-url-input').value = config.background.value;
            } else if (bgType === 'upload' && config.background.value) {
                // 显示已上传的文件路径信息
                const bgUploadPath = document.getElementById('bg-upload-path');
                if (bgUploadPath) {
                    // 从完整路径中提取文件名
                    const fileName = config.background.value.split('/').pop() || config.background.value;
                    bgUploadPath.textContent = fileName;
                }
            }
        }
        
        // 网络限速设置
        if (config.network?.speedLimit) {
            document.getElementById('enable-speed-limit').checked = config.network.speedLimit.enabled;
            document.getElementById('network-interface').value = config.network.speedLimit.interface || 'eth0';
            document.getElementById('speed-limit-value').value = config.network.speedLimit.value || '';
            toggleSpeedLimitSettings(config.network.speedLimit.enabled);
        }
        
        // 导航项目
        renderNavSettings(config.nav || []);
        
        // 天气城市
        renderWeatherSettings(config.weather?.cities || []);
        
        // 搜索引擎
        renderSearchSettings(config.search?.engines || []);
    }
    
    function renderNavSettings(navItems) {
        const container = document.getElementById('nav-settings-container');
        container.innerHTML = navItems.map((item, index) => `
            <div class="nav-item p-2 bg-white/10 rounded-lg flex gap-2 items-center">
                <input type="text" placeholder="名称" value="${item.name || ''}" class="flex-1 bg-transparent border-b border-white/30 p-1 focus:outline-none focus:border-white placeholder:text-slate-400" data-field="name" data-index="${index}">
                <input type="text" placeholder="URL" value="${item.url || ''}" class="flex-1 bg-transparent border-b border-white/30 p-1 focus:outline-none focus:border-white placeholder:text-slate-400" data-field="url" data-index="${index}">
                <button class="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors" onclick="selectIcon(${index})">
                    <span class="nav-icon-preview">${item.icon || '<i data-lucide="external-link"></i>'}</span>
                    <span>图标</span>
                </button>
                <button class="text-red-400 hover:text-red-300 p-1" onclick="removeNavItem(${index})">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
        lucide.createIcons();
    }
    
    function renderWeatherSettings(cities) {
        const container = document.getElementById('weather-settings-container');
        container.innerHTML = cities.map((city, index) => `
            <div class="weather-city p-2 bg-white/10 rounded-lg flex gap-2 items-center">
                <input type="text" placeholder="城市名称" value="${city}" class="flex-1 bg-transparent border-b border-white/30 p-1 focus:outline-none focus:border-white placeholder:text-slate-400" data-index="${index}">
                <button class="text-red-400 hover:text-red-300 p-1" onclick="removeWeatherCity(${index})">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
        lucide.createIcons();
    }
    
    function renderSearchSettings(engines) {
        const container = document.getElementById('search-settings-container');
        container.innerHTML = engines.map((engine, index) => `
            <div class="search-engine p-2 bg-white/10 rounded-lg flex gap-2 items-center">
                ${engine.custom ? `
                    <input type="text" placeholder="引擎名称" value="${engine.name || ''}" class="flex-1 bg-transparent border-b border-white/30 p-1 focus:outline-none focus:border-white placeholder:text-slate-400" data-field="name" data-index="${index}">
                    <input type="text" placeholder="搜索URL (使用 {query} 占位符)" value="${engine.url || ''}" class="flex-2 bg-transparent border-b border-white/30 p-1 focus:outline-none focus:border-white placeholder:text-slate-400" data-field="url" data-index="${index}">
                    <button class="text-red-400 hover:text-red-300 p-1" onclick="removeSearchEngine(${index})">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                ` : `
                    <span class="flex-1 text-slate-200 p-1">${engine.name}</span>
                    <span class="flex-2 text-slate-400 p-1 text-sm truncate">${engine.url}</span>
                    <span class="text-slate-500 p-1 text-xs">内置</span>
                `}
            </div>
        `).join('');
        lucide.createIcons();
    }
    
    function toggleSpeedLimitSettings(enabled) {
        const settingsDiv = document.getElementById('speed-limit-settings');
        if (enabled) {
            settingsDiv.classList.remove('hidden');
        } else {
            settingsDiv.classList.add('hidden');
        }
    }
    
    async function saveSettings() {
        try {
            const formData = collectFormData();
            const response = await fetch(API_ENDPOINTS.config, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            await handleApiResponse(response, '保存设置失败');
            
            window.showConfirmDialog('保存成功', '设置已保存，是否重新加载页面以应用更改？', () => {
                location.reload();
            });
        } catch (error) {
            console.error('保存设置失败:', error);
            window.showConfirmDialog('保存失败', error.message);
        }
    }
    
    function collectFormData() {
        const data = { ...currentConfig };
        
        // 基本设置
        const siteTitleInput = document.getElementById('site-title-input');
        data.siteTitle = siteTitleInput ? siteTitleInput.value : (data.siteTitle || '');
        
        // 网络设置
        const enableSpeedLimitInput = document.getElementById('enable-speed-limit');
        const networkInterfaceInput = document.getElementById('network-interface');
        const speedLimitValueInput = document.getElementById('speed-limit-value');
        
        data.network = {
            speedLimit: {
                enabled: enableSpeedLimitInput ? enableSpeedLimitInput.checked : false,
                interface: networkInterfaceInput ? networkInterfaceInput.value : 'eth0',
                value: speedLimitValueInput ? speedLimitValueInput.value : ''
            }
        };
        
        // 天气设置
        const weatherApiKeyInput = document.getElementById('weather-api-key');
        const weatherCityInputs = document.querySelectorAll('#weather-settings-container input');
        
        data.weather = {
            apiKey: weatherApiKeyInput ? weatherApiKeyInput.value : (data.weather?.apiKey || ''),
            cities: Array.from(weatherCityInputs).map(input => input.value).filter(city => city)
        };
        
        // 背景设置
        const bgTypeInput = document.querySelector('input[name="bg-type"]:checked');
        const bgUrlInput = document.getElementById('bg-url-input');
        
        const bgType = bgTypeInput ? bgTypeInput.value : 'bing';
        data.background = { type: bgType };
        
        if (bgType === 'url' && bgUrlInput) {
            data.background.value = bgUrlInput.value;
        } else if (bgType === 'upload') {
            // 对于上传类型，从 currentConfig 中获取已上传的文件路径
            data.background.value = currentConfig.background?.value || '';
        }
        
        // 导航设置
        data.nav = Array.from(document.querySelectorAll('#nav-settings-container .nav-item')).map((item, index) => {
            const nameInput = item.querySelector('[data-field="name"]');
            const urlInput = item.querySelector('[data-field="url"]');
            const iconPreview = item.querySelector('.nav-icon-preview');
            
            return {
                name: nameInput ? nameInput.value : '',
                url: urlInput ? urlInput.value : '',
                requiresPassword: false, // 移除密码功能
                icon: iconPreview ? iconPreview.innerHTML : '<i data-lucide="external-link"></i>'
            };
        }).filter(item => item.name && item.url);
        
        // 搜索引擎设置
        const searchEngineItems = document.querySelectorAll('#search-settings-container .search-engine');
        const customEngines = Array.from(searchEngineItems).map(item => {
            const nameInput = item.querySelector('[data-field="name"]');
            const urlInput = item.querySelector('[data-field="url"]');
            
            // 只处理自定义搜索引擎（有输入框的）
            if (nameInput && urlInput) {
                return {
                    name: nameInput.value,
                    url: urlInput.value,
                    custom: true,
                    icon: '<i data-lucide="search"></i>' // 默认图标
                };
            }
            return null;
        }).filter(item => item && item.name && item.url);
        
        // 保留内置搜索引擎并添加自定义的
        const builtInEngines = (data.search?.engines || []).filter(engine => !engine.custom);
        data.search = {
            engines: [...builtInEngines, ...customEngines],
            defaultEngine: data.search?.defaultEngine || data.search?.engines?.[0]?.name || 'Google'
        };
        
        return data;
    }
    
    function setupEventListeners() {
        // 保存设置按钮
        document.getElementById('save-settings-btn')?.addEventListener('click', saveSettings);
        
        // 网络限速切换
        document.getElementById('enable-speed-limit')?.addEventListener('change', (e) => {
            toggleSpeedLimitSettings(e.target.checked);
        });
        
        // 背景类型切换
        document.querySelectorAll('input[name="bg-type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const urlContainer = document.getElementById('bg-url-input-container');
                const uploadContainer = document.getElementById('bg-upload-container');
                
                urlContainer.classList.add('hidden');
                uploadContainer.classList.add('hidden');
                
                if (e.target.value === 'url') {
                    urlContainer.classList.remove('hidden');
                } else if (e.target.value === 'upload') {
                    uploadContainer.classList.remove('hidden');
                }
            });
        });
        
        // 添加导航项目
        document.getElementById('add-nav-item-btn')?.addEventListener('click', () => {
            // 首先保存当前表单数据
            saveCurrentNavFormData();
            
            currentConfig.nav = currentConfig.nav || [];
            currentConfig.nav.push({ name: '', url: '', requiresPassword: false, icon: '<i data-lucide="external-link"></i>' });
            renderNavSettings(currentConfig.nav);
        });
        
        // 添加天气城市
        document.getElementById('add-weather-city-btn')?.addEventListener('click', () => {
            // 首先保存当前表单数据
            saveCurrentWeatherFormData();
            
            currentConfig.weather = currentConfig.weather || {};
            currentConfig.weather.cities = currentConfig.weather.cities || [];
            currentConfig.weather.cities.push('');
            renderWeatherSettings(currentConfig.weather.cities);
        });
        
        // 添加搜索引擎
        document.getElementById('add-search-engine-btn')?.addEventListener('click', () => {
            // 首先保存当前表单数据
            saveCurrentSearchFormData();
            
            currentConfig.search = currentConfig.search || {};
            currentConfig.search.engines = currentConfig.search.engines || [];
            currentConfig.search.engines.push({ name: '', url: '', custom: true });
            renderSearchSettings(currentConfig.search.engines);
        });

        // 背景上传相关事件监听器
        document.getElementById('bg-upload-btn')?.addEventListener('click', () => {
            const bgUploadInput = document.getElementById('bg-upload-input');
            if (bgUploadInput) {
                bgUploadInput.click();
            }
        });

        // 背景文件选择事件监听器
        document.getElementById('bg-upload-input')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const bgUploadPath = document.getElementById('bg-upload-path');
            
            try {
                const formData = new FormData();
                formData.append('background', file);
                
                const response = await fetch('/api/upload/background', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.error || `HTTP 错误! 状态: ${response.status}`);
                }
                
                // 更新显示的文件路径
                if (bgUploadPath) {
                    bgUploadPath.textContent = file.name;
                }
                
                // 自动选择上传选项
                const uploadRadio = document.querySelector('input[name="bg-type"][value="upload"]');
                if (uploadRadio) {
                    uploadRadio.checked = true;
                    // 触发背景类型切换事件
                    uploadRadio.dispatchEvent(new Event('change'));
                }
                
                // 更新配置中的背景设置
                currentConfig.background = {
                    type: 'upload',
                    value: result.filePath
                };
                
                console.log('背景上传成功:', result.filePath);
                
            } catch (error) {
                console.error('背景上传失败:', error);
                if (bgUploadPath) {
                    bgUploadPath.textContent = '上传失败';
                }
                window.showConfirmDialog('上传失败', `背景上传失败：${error.message}`);
            }
        });
    }
    
    // 导出全局函数
    window.removeNavItem = (index) => {
        currentConfig.nav.splice(index, 1);
        renderNavSettings(currentConfig.nav);
    };
    
    window.removeWeatherCity = (index) => {
        currentConfig.weather.cities.splice(index, 1);
        renderWeatherSettings(currentConfig.weather.cities);
    };
    
    window.removeSearchEngine = (index) => {
        // 不允许删除内置搜索引擎
        if (currentConfig.search.engines[index].custom === false) {
            return;
        }
        currentConfig.search.engines.splice(index, 1);
        renderSearchSettings(currentConfig.search.engines);
    };
    
    // 图标选择相关函数
    let currentIconSelectIndex = -1;
    
    window.selectIcon = (navIndex) => {
        currentIconSelectIndex = navIndex;
        showIconPickerModal();
    };
    
    function showIconPickerModal() {
        const modal = document.getElementById('icon-picker-modal');
        if (modal) {
            modal.classList.remove('hidden');
            loadIconGrid();
        }
    }
    
    function loadIconGrid() {
        const iconGrid = document.getElementById('icon-picker-grid');
        if (!iconGrid) return;
        
        const iconsHTML = Object.entries(COMMON_ICONS).map(([key, iconData]) => `
            <div class="icon-item cursor-pointer p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex flex-col items-center justify-center gap-2" onclick="selectIconFromGrid('${key}')">
                <div class="text-2xl text-white">${iconData.icon}</div>
                <span class="text-xs text-slate-300 text-center">${iconData.name}</span>
            </div>
        `).join('');
        
        iconGrid.innerHTML = iconsHTML;
        lucide.createIcons();
    }
    
    function saveCurrentNavFormData() {
        // 保存当前表单中的导航数据到配置
        const navItems = Array.from(document.querySelectorAll('#nav-settings-container .nav-item')).map((item, index) => {
            const nameInput = item.querySelector('[data-field="name"]');
            const urlInput = item.querySelector('[data-field="url"]');
            const iconPreview = item.querySelector('.nav-icon-preview');
            
            return {
                name: nameInput ? nameInput.value : (currentConfig.nav[index]?.name || ''),
                url: urlInput ? urlInput.value : (currentConfig.nav[index]?.url || ''),
                icon: iconPreview ? iconPreview.innerHTML : (currentConfig.nav[index]?.icon || '<i data-lucide="external-link"></i>'),
                requiresPassword: false
            };
        });
        
        currentConfig.nav = navItems;
    }
    
    function saveCurrentWeatherFormData() {
        // 保存当前天气城市表单数据
        const cityInputs = document.querySelectorAll('#weather-settings-container input');
        currentConfig.weather = currentConfig.weather || {};
        currentConfig.weather.cities = Array.from(cityInputs).map(input => input.value).filter(city => city);
    }
    
    function saveCurrentSearchFormData() {
        // 保存当前搜索引擎表单数据
        const searchEngineItems = document.querySelectorAll('#search-settings-container .search-engine');
        const customEngines = Array.from(searchEngineItems).map(item => {
            const nameInput = item.querySelector('[data-field="name"]');
            const urlInput = item.querySelector('[data-field="url"]');
            
            // 只处理自定义搜索引擎（有输入框的）
            if (nameInput && urlInput) {
                return {
                    name: nameInput.value,
                    url: urlInput.value,
                    custom: true
                };
            }
            return null;
        }).filter(item => item && item.name && item.url);
        
        // 保留内置搜索引擎并添加自定义的
        const builtInEngines = (currentConfig.search?.engines || []).filter(engine => !engine.custom);
        currentConfig.search = currentConfig.search || {};
        currentConfig.search.engines = [...builtInEngines, ...customEngines];
    }
    
    window.selectIconFromGrid = (iconKey) => {
        if (currentIconSelectIndex >= 0 && COMMON_ICONS[iconKey]) {
            // 首先保存当前表单数据到配置中
            saveCurrentNavFormData();
            
            // 更新当前配置的图标
            if (!currentConfig.nav[currentIconSelectIndex]) {
                currentConfig.nav[currentIconSelectIndex] = {};
            }
            currentConfig.nav[currentIconSelectIndex].icon = COMMON_ICONS[iconKey].icon;
            
            // 重新渲染导航设置
            renderNavSettings(currentConfig.nav);
            
            // 关闭图标选择器
            const modal = document.getElementById('icon-picker-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
            
            currentIconSelectIndex = -1;
        }
    };
    
    // 初始化
    setupEventListeners();
    loadSettings();
    
    return {
        loadSettings,
        saveSettings
    };
}