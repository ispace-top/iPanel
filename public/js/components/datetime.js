export function initDateTime() {
    const timeElem = document.getElementById('time');
    const dateElem = document.getElementById('date');

    function updateDateTime() {
        const now = new Date();
        
        // 更新时间
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElem.textContent = `${hours}:${minutes}`;

        // 更新日期
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        dateElem.textContent = `${month}月${date}日`;
    }

    // 初始更新
    updateDateTime();
    
    // 设置定时更新
    const timer = setInterval(updateDateTime, 1000);
    
    // 返回清理函数
    return () => clearInterval(timer);
}
