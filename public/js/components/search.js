export function initSearch() {
    const searchInput = document.getElementById('search-input');
    const engineSelectBtn = document.getElementById('engine-select-btn');
    const engineDropdown = document.getElementById('engine-dropdown');
    const searchSubmitBtn = document.getElementById('search-submit-btn');
    
    let currentConfig = {
        engines: [],
        defaultEngine: null
    };
    
    function setActiveEngine(engine) {
        currentConfig.defaultEngine = engine;
        engineSelectBtn.innerHTML = `<div class="w-5 h-5">${engine.icon}</div>`;
        engineDropdown.classList.add('hidden');
    }
    
    function handleSearch() {
        const query = searchInput.value.trim();
        if (!query || !currentConfig.defaultEngine) return;
        
        const url = currentConfig.defaultEngine.url.replace('{query}', encodeURIComponent(query));
        window.open(url, '_blank');
    }
    
    // 事件监听
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    searchSubmitBtn.addEventListener('click', handleSearch);
    
    engineSelectBtn.addEventListener('click', () => {
        engineDropdown.classList.toggle('hidden');
    });
    
    document.addEventListener('click', (e) => {
        if (!engineSelectBtn.contains(e.target) && !engineDropdown.contains(e.target)) {
            engineDropdown.classList.add('hidden');
        }
    });
    
    // 更新搜索引擎配置
    function updateEngines(engines, defaultEngine) {
        currentConfig.engines = engines;
        
        // 更新下拉菜单
        engineDropdown.innerHTML = engines.map(engine => `
            <button class="w-full px-4 py-2 text-left hover:bg-white/20 transition-colors flex items-center gap-2">
                <div class="w-4 h-4 flex-shrink-0">${engine.icon}</div>
                <span>${engine.name}</span>
            </button>
        `).join('');
        
        // 设置默认引擎
        const activeEngine = engines.find(e => e.name === defaultEngine) || engines[0];
        if (activeEngine) setActiveEngine(activeEngine);
        
        // 添加切换事件
        engineDropdown.querySelectorAll('button').forEach((btn, index) => {
            btn.addEventListener('click', () => setActiveEngine(engines[index]));
        });
    }
    
    return { updateEngines };
}
