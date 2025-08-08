import { API_ENDPOINTS } from '../config/constants.js';
import { handleApiResponse } from '../utils/format.js';
import { COMMON_ICONS } from '../config/constants.js';

export function initSettings() {
    let currentConfig = {};
    let qosTemplates = {};

    async function loadSettings() {
        try {
            // Fetch main config
            const response = await fetch(API_ENDPOINTS.config);
            currentConfig = await handleApiResponse(response, '加载设置失败');
            populateSettingsForm(currentConfig);

            // Fetch QoS templates
            const templatesResponse = await fetch(API_ENDPOINTS.qosTemplates);
            qosTemplates = await handleApiResponse(templatesResponse, '加载QoS模板失败');
            populateQosTemplates(qosTemplates);

            // Fetch network interfaces
            const interfacesResponse = await fetch(API_ENDPOINTS.networkInterfaces);
            const interfaces = await handleApiResponse(interfacesResponse, '加载网络接口失败');
            populateNetworkInterfaces(interfaces);

        } catch (error) {
            console.error('加载设置或资源失败:', error);
        }
    }

    function populateNetworkInterfaces(interfaces) {
        const select = document.getElementById('network-interface');
        if (!select) return;
        const currentValue = select.value;
        select.innerHTML = '';
        interfaces.forEach(iface => {
            const option = document.createElement('option');
            option.value = iface;
            option.textContent = iface;
            select.appendChild(option);
        });
        
        const interfaceToSet = currentConfig.network?.interface || currentValue || interfaces[0];
        if (interfaceToSet) {
            select.value = interfaceToSet;
        }
    }

    function populateQosTemplates(templates) {
        const select = document.getElementById('qos-template');
        const description = document.getElementById('qos-template-description');
        if (!select || !description) return;

        const selectedValue = currentConfig.network?.smartQos?.template;
        select.innerHTML = '';

        for (const key in templates) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = templates[key].name;
            select.appendChild(option);
        }

        if (selectedValue) {
            select.value = selectedValue;
        }

        const updateDescription = () => {
            const selectedTemplate = templates[select.value];
            if (selectedTemplate) {
                description.textContent = selectedTemplate.description;
            }
        };

        select.addEventListener('change', updateDescription);
        updateDescription();
    }

    function populateSettingsForm(config) {
        if (config.siteTitle) {
            document.getElementById('site-title-input').value = config.siteTitle;
        }
        
        if (config.weather?.apiKey) {
            document.getElementById('weather-api-key').value = config.weather.apiKey;
        }
        
        if (config.background) {
            const bgType = config.background.type || 'bing';
            const radio = document.querySelector(`input[name="bg-type"][value="${bgType}"]`);
            if (radio) radio.checked = true;
            
            document.getElementById('bg-url-input-container').classList.toggle('hidden', bgType !== 'url');
            document.getElementById('bg-upload-container').classList.toggle('hidden', bgType !== 'upload');

            if (bgType === 'url' && config.background.value) {
                document.getElementById('bg-url-input').value = config.background.value;
            } else if (bgType === 'upload' && config.background.value) {
                const bgUploadPath = document.getElementById('bg-upload-path');
                if (bgUploadPath) {
                    bgUploadPath.textContent = config.background.value.split('/').pop() || config.background.value;
                }
            }
        }
        
        if (config.network?.speedLimit) {
            document.getElementById('enable-speed-limit').checked = config.network.speedLimit.enabled;
            document.getElementById('speed-limit-value').value = config.network.speedLimit.value || '';
            toggleSpeedLimitSettings(config.network.speedLimit.enabled);
        }

        if (config.network?.smartQos) {
            document.getElementById('enable-smart-qos').checked = config.network.smartQos.enabled;
            toggleSmartQosSettings(config.network.smartQos.enabled);
        }
        
        renderNavSettings(config.nav || []);
        renderWeatherSettings(config.weather?.cities || []);
        renderSearchSettings(config.search?.engines || []);
    }
    
    function renderNavSettings(navItems) {
        const container = document.getElementById('nav-settings-container');
        container.innerHTML = navItems.map((item, index) => `
            <div class="nav-item p-2 bg-white/10 rounded-lg flex gap-2 items-center">
                <input type="text" placeholder="名称" value="${item.name || ''}" class="flex-1 bg-transparent border-b border-white/30 p-1" data-field="name" data-index="${index}">
                <input type="text" placeholder="URL" value="${item.url || ''}" class="flex-1 bg-transparent border-b border-white/30 p-1" data-field="url" data-index="${index}">
                <button class="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded" onclick="selectIcon(${index})">
                    <span class="nav-icon-preview">${item.icon || '<i data-lucide="external-link"></i>'}</span>
                    <span>图标</span>
                </button>
                <button class="text-red-400 hover:text-red-300 p-1" onclick="removeNavItem(${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
        `).join('');
        lucide.createIcons();
    }
    
    function renderWeatherSettings(cities) {
        const container = document.getElementById('weather-settings-container');
        container.innerHTML = cities.map((city, index) => `
            <div class="weather-city p-2 bg-white/10 rounded-lg flex gap-2 items-center">
                <input type="text" placeholder="城市名称" value="${city}" class="flex-1 bg-transparent border-b border-white/30 p-1" data-index="${index}">
                <button class="text-red-400 hover:text-red-300 p-1" onclick="removeWeatherCity(${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
        `).join('');
        lucide.createIcons();
    }
    
    function renderSearchSettings(engines) {
        const container = document.getElementById('search-settings-container');
        container.innerHTML = engines.map((engine, index) => `
            <div class="search-engine p-2 bg-white/10 rounded-lg flex gap-2 items-center">
                ${engine.custom ? `
                    <input type="text" placeholder="引擎名称" value="${engine.name || ''}" class="flex-1 bg-transparent" data-field="name" data-index="${index}">
                    <input type="text" placeholder="搜索URL" value="${engine.url || ''}" class="flex-2 bg-transparent" data-field="url" data-index="${index}">
                    <button class="text-red-400 hover:text-red-300 p-1" onclick="removeSearchEngine(${index})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
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
        document.getElementById('speed-limit-settings').classList.toggle('hidden', !enabled);
    }

    function toggleSmartQosSettings(enabled) {
        document.getElementById('smart-qos-settings').classList.toggle('hidden', !enabled);
    }
    
    async function saveSettings() {
        try {
            const formData = collectFormData();
            const response = await fetch(API_ENDPOINTS.config, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            await handleApiResponse(response, '保存设置失败');
            window.showConfirmDialog('保存成功', '设置已保存，部分更改可能需要重新加载页面才能生效。', () => location.reload());
        } catch (error) {
            window.showConfirmDialog('保存失败', error.message);
        }
    }
    
    function collectFormData() {
        const data = { ...currentConfig };
        data.siteTitle = document.getElementById('site-title-input').value;
        
        data.network = {
            ...data.network,
            interface: document.getElementById('network-interface').value,
            speedLimit: {
                enabled: document.getElementById('enable-speed-limit').checked,
                value: document.getElementById('speed-limit-value').value
            },
            smartQos: {
                enabled: document.getElementById('enable-smart-qos').checked,
                template: document.getElementById('qos-template').value
            }
        };
        
        data.weather = {
            apiKey: document.getElementById('weather-api-key').value,
            cities: Array.from(document.querySelectorAll('#weather-settings-container input')).map(input => input.value).filter(Boolean)
        };
        
        const bgType = document.querySelector('input[name="bg-type"]:checked').value;
        data.background = { type: bgType };
        if (bgType === 'url') {
            data.background.value = document.getElementById('bg-url-input').value;
        } else if (bgType === 'upload') {
            data.background.value = currentConfig.background?.value || '';
        }
        
        data.nav = Array.from(document.querySelectorAll('#nav-settings-container .nav-item')).map(item => ({
            name: item.querySelector('[data-field="name"]').value,
            url: item.querySelector('[data-field="url"]').value,
            icon: item.querySelector('.nav-icon-preview').innerHTML
        })).filter(item => item.name && item.url);
        
        const builtInEngines = (currentConfig.search?.engines || []).filter(engine => !engine.custom);
        const customEngines = Array.from(document.querySelectorAll('#search-settings-container .search-engine')).map(item => {
            const nameInput = item.querySelector('[data-field="name"]');
            if (!nameInput) return null;
            return {
                name: nameInput.value,
                url: item.querySelector('[data-field="url"]').value,
                custom: true
            };
        }).filter(Boolean);
        data.search = {
            engines: [...builtInEngines, ...customEngines],
            defaultEngine: currentConfig.search?.defaultEngine
        };
        
        return data;
    }

    async function applySpeedLimit() {
        const interfaceName = document.getElementById('network-interface').value;
        const speed = document.getElementById('speed-limit-value').value;
        if (!speed) {
            window.showConfirmDialog('错误', '请输入限速值。');
            return;
        }
        try {
            const response = await fetch(API_ENDPOINTS.network, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interface: interfaceName, speed: speed, action: 'apply' })
            });
            const result = await handleApiResponse(response, '应用限速失败');
            window.showConfirmDialog('成功', result.message);
        } catch (error) {
            window.showConfirmDialog('失败', `应用限速失败: ${error.message}`);
        }
    }

    async function removeSpeedLimit() {
        const interfaceName = document.getElementById('network-interface').value;
        try {
            const response = await fetch(API_ENDPOINTS.network, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interface: interfaceName, action: 'remove' })
            });
            const result = await handleApiResponse(response, '移除限速失败');
            window.showConfirmDialog('成功', result.message);
        } catch (error) {
            window.showConfirmDialog('失败', `移除限速失败: ${error.message}`);
        }
    }

    async function startSmartQos() {
        const interfaceName = document.getElementById('network-interface').value;
        const templateKey = document.getElementById('qos-template').value;
        const templateConfig = qosTemplates[templateKey];
        if (!templateConfig) {
            window.showConfirmDialog('错误', '无效的QoS模板。');
            return;
        }
        const config = { ...templateConfig, interface: interfaceName };
        try {
            const response = await fetch(API_ENDPOINTS.smartQos + '/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            const result = await handleApiResponse(response, '启动智能QoS失败');
            window.showConfirmDialog('成功', result.message);
        } catch (error) {
            window.showConfirmDialog('失败', `启动智能QoS失败: ${error.message}`);
        }
    }

    async function stopSmartQos() {
        try {
            const response = await fetch(API_ENDPOINTS.smartQos + '/stop', { method: 'POST' });
            const result = await handleApiResponse(response, '停止智能QoS失败');
            window.showConfirmDialog('成功', result.message);
        } catch (error) {
            window.showConfirmDialog('失败', `停止智能QoS失败: ${error.message}`);
        }
    }
    
    function setupEventListeners() {
        document.getElementById('save-settings-btn')?.addEventListener('click', saveSettings);
        
        document.getElementById('enable-speed-limit')?.addEventListener('change', (e) => toggleSpeedLimitSettings(e.target.checked));
        document.getElementById('enable-smart-qos')?.addEventListener('change', (e) => toggleSmartQosSettings(e.target.checked));

        document.getElementById('apply-speed-limit')?.addEventListener('click', applySpeedLimit);
        document.getElementById('remove-speed-limit')?.addEventListener('click', removeSpeedLimit);
        document.getElementById('start-smart-qos')?.addEventListener('click', startSmartQos);
        document.getElementById('stop-smart-qos')?.addEventListener('click', stopSmartQos);
        
        document.querySelectorAll('input[name="bg-type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('bg-url-input-container').classList.toggle('hidden', e.target.value !== 'url');
                document.getElementById('bg-upload-container').classList.toggle('hidden', e.target.value !== 'upload');
            });
        });
        
        document.getElementById('add-nav-item-btn')?.addEventListener('click', () => {
            saveCurrentNavFormData();
            currentConfig.nav = currentConfig.nav || [];
            currentConfig.nav.push({ name: '', url: '', icon: '<i data-lucide="external-link"></i>' });
            renderNavSettings(currentConfig.nav);
        });
        
        document.getElementById('add-weather-city-btn')?.addEventListener('click', () => {
            saveCurrentWeatherFormData(); // Save current inputs first
            currentConfig.weather.cities = currentConfig.weather.cities || [];
            currentConfig.weather.cities.push('');
            renderWeatherSettings(currentConfig.weather.cities);
        });
        
        document.getElementById('add-search-engine-btn')?.addEventListener('click', () => {
            saveCurrentSearchFormData();
            currentConfig.search.engines.push({ name: '', url: '', custom: true });
            renderSearchSettings(currentConfig.search.engines);
        });

        document.getElementById('bg-upload-btn')?.addEventListener('click', () => document.getElementById('bg-upload-input').click());

        document.getElementById('bg-upload-input')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('background', file);
            try {
                const response = await fetch('/api/upload/background', { method: 'POST', body: formData });
                const result = await handleApiResponse(response, '背景上传失败');
                document.getElementById('bg-upload-path').textContent = file.name;
                document.querySelector('input[name="bg-type"][value="upload"]').checked = true;
                currentConfig.background = { type: 'upload', value: result.filePath };
            } catch (error) {
                window.showConfirmDialog('上传失败', `背景上传失败：${error.message}`);
            }
        });
    }
    
    // Make functions available on window
    window.removeNavItem = (index) => {
        currentConfig.nav.splice(index, 1);
        renderNavSettings(currentConfig.nav);
    };
    window.removeWeatherCity = (index) => {
        currentConfig.weather.cities.splice(index, 1);
        renderWeatherSettings(currentConfig.weather.cities);
    };
    window.removeSearchEngine = (index) => {
        if (!currentConfig.search.engines[index].custom) return;
        currentConfig.search.engines.splice(index, 1);
        renderSearchSettings(currentConfig.search.engines);
    };
    
    function saveCurrentWeatherFormData() {
        const cityInputs = document.querySelectorAll('#weather-settings-container input[type="text"]');
        currentConfig.weather = currentConfig.weather || {};
        currentConfig.weather.cities = Array.from(cityInputs).map(input => input.value).filter(city => city.trim() !== '');
    }

    let currentIconSelectIndex = -1;
    window.selectIcon = (navIndex) => {
        currentIconSelectIndex = navIndex;
        document.getElementById('icon-picker-modal').classList.remove('hidden');
        loadIconGrid();
    };
    
    function loadIconGrid() {
        const iconGrid = document.getElementById('icon-picker-grid');
        iconGrid.innerHTML = Object.entries(COMMON_ICONS).map(([key, iconData]) => `
            <div class="icon-item" onclick="selectIconFromGrid('${key}')">
                <div class="text-2xl">${iconData.icon}</div>
                <span class="text-xs">${iconData.name}</span>
            </div>
        `).join('');
        lucide.createIcons();
    }
    
    window.selectIconFromGrid = (iconKey) => {
        if (currentIconSelectIndex < 0 || !COMMON_ICONS[iconKey]) return;
        currentConfig.nav[currentIconSelectIndex].icon = COMMON_ICONS[iconKey].icon;
        renderNavSettings(currentConfig.nav);
        document.getElementById('icon-picker-modal').classList.add('hidden');
        currentIconSelectIndex = -1;
    };
    
    // Init
    setupEventListeners();
    loadSettings();
    
    return { loadSettings, saveSettings };
}