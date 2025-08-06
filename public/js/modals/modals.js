export function initModals() {
    const passwordModal = document.getElementById('password-modal');
    const settingsModal = document.getElementById('settings-modal');
    const iconPickerModal = document.getElementById('icon-picker-modal');
    const confirmDialog = document.getElementById('confirm-dialog');
    
    let currentPasswordCallback = null;
    let currentIconCallback = null;
    
    // 密码模态框管理
    function showPasswordModal(callback) {
        currentPasswordCallback = callback;
        passwordModal.classList.remove('hidden');
        document.getElementById('password-input').focus();
        document.getElementById('password-error').classList.add('hidden');
    }
    
    function hidePasswordModal() {
        passwordModal.classList.add('hidden');
        document.getElementById('password-input').value = '';
        currentPasswordCallback = null;
    }
    
    // 设置模态框管理
    function showSettingsModal() {
        settingsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function hideSettingsModal() {
        settingsModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    // 图标选择器管理
    function showIconPicker(callback) {
        currentIconCallback = callback;
        iconPickerModal.classList.remove('hidden');
        loadIconGrid();
    }
    
    function hideIconPicker() {
        iconPickerModal.classList.add('hidden');
        currentIconCallback = null;
    }
    
    // 确认对话框管理
    function showConfirmDialog(title, message, onConfirm) {
        document.getElementById('confirm-dialog-title').textContent = title;
        document.getElementById('confirm-dialog-message').textContent = message;
        
        const confirmBtn = document.getElementById('confirm-dialog-confirm');
        const cancelBtn = document.getElementById('confirm-dialog-cancel');
        
        // 移除旧的事件监听器
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        
        // 添加新的事件监听器
        document.getElementById('confirm-dialog-confirm').addEventListener('click', () => {
            confirmDialog.classList.add('hidden');
            if (onConfirm) onConfirm();
        });
        
        document.getElementById('confirm-dialog-cancel').addEventListener('click', () => {
            confirmDialog.classList.add('hidden');
        });
        
        confirmDialog.classList.remove('hidden');
    }
    
    // 加载图标网格
    function loadIconGrid() {
        const iconGrid = document.getElementById('icon-picker-grid');
        // 这里应该加载图标，暂时使用占位符
        iconGrid.innerHTML = '<div class="col-span-full text-center p-8">图标加载中...</div>';
    }
    
    // 事件监听器设置
    function setupEventListeners() {
        // 设置按钮
        document.getElementById('settings-btn')?.addEventListener('click', showSettingsModal);
        
        // 关闭按钮
        document.getElementById('close-modal-btn')?.addEventListener('click', hideSettingsModal);
        document.getElementById('close-password-modal-btn')?.addEventListener('click', hidePasswordModal);
        document.getElementById('close-icon-picker-btn')?.addEventListener('click', hideIconPicker);
        
        // 密码提交
        document.getElementById('password-submit-btn')?.addEventListener('click', handlePasswordSubmit);
        document.getElementById('password-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handlePasswordSubmit();
        });
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!confirmDialog.classList.contains('hidden')) {
                    confirmDialog.classList.add('hidden');
                } else if (!iconPickerModal.classList.contains('hidden')) {
                    hideIconPicker();
                } else if (!passwordModal.classList.contains('hidden')) {
                    hidePasswordModal();
                } else if (!settingsModal.classList.contains('hidden')) {
                    hideSettingsModal();
                }
            }
        });
    }
    
    function handlePasswordSubmit() {
        const password = document.getElementById('password-input').value;
        if (password && currentPasswordCallback) {
            currentPasswordCallback(password);
        }
    }
    
    // 初始化
    setupEventListeners();
    
    // 导出函数供全局使用
    window.showPasswordModal = showPasswordModal;
    window.showSettingsModal = showSettingsModal;
    window.showIconPicker = showIconPicker;
    window.showConfirmDialog = showConfirmDialog;
    
    return {
        showPasswordModal,
        hidePasswordModal,
        showSettingsModal,
        hideSettingsModal,
        showIconPicker,
        hideIconPicker,
        showConfirmDialog
    };
}