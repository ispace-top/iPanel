export function initNavigation() {
    const navContainer = document.getElementById('nav-container');
    
    function renderNavigation(navItems) {
        if (!navItems || navItems.length === 0) {
            navContainer.innerHTML = '<div class="text-center p-4 rounded-lg col-span-full text-slate-300">暂无导航项目</div>';
            return;
        }
        
        const navHtml = navItems.map(item => {
            const isPassword = item.requiresPassword;
            const clickAction = isPassword ? 
                `onclick="handlePasswordProtectedLink('${item.url}')"` : 
                `onclick="window.open('${item.url}', '_blank')"`;
            
            return `
                <div class="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg" ${clickAction}>
                    <div class="backdrop-blur-md bg-white/10 p-4 rounded-xl shadow-md group-hover:bg-white/20 transition-colors h-full flex flex-col items-center justify-center">
                        <div class="w-12 h-12 mb-2 text-white group-hover:text-slate-200 transition-colors flex items-center justify-center">
                            ${item.icon || '<i data-lucide="external-link"></i>'}
                        </div>
                        <span class="text-sm font-medium text-slate-100 group-hover:text-white transition-colors text-center">${item.name}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        navContainer.innerHTML = navHtml;
        
        // 重新创建lucide图标
        lucide.createIcons();
    }
    
    return { renderNavigation };
}