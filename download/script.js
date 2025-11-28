// =========================================
// Download 页面逻辑 (Script.js - 打字机版)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => document.body.classList.remove('preload'), 50);
    initThemeToggle();
    if (typeof resources !== 'undefined') initResourceManager();
});

function initResourceManager() {
    const grid = document.getElementById('resource-grid');
    const categoryContainer = document.getElementById('category-group');
    const sortSwitch = document.getElementById('sort-switch');
    const backdrop = document.querySelector('.overlay-backdrop');

    // 状态机
    let appState = 'IDLE'; 
    let activeCardInfo = null; 
    let activeOverlay = null;  
    
    // ⭐ 新增：打字机定时器存储变量
    let typewriterTimer = null;

    let currentFilter = 'all';
    let currentSort = 'newest';

    // --- 渲染逻辑 (保持不变) ---
    const renderButtons = () => {
        categoryContainer.innerHTML = categoryConfig.map(cat => {
            const activeClass = cat.type === 'all' ? 'active' : '';
            return `<button class="filter-btn ${activeClass}" data-type="${cat.type}">${cat.name}</button>`;
        }).join('');
    };
    renderButtons();

    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.type;
            renderCards();
        });
    });

    if (sortSwitch) {
        sortSwitch.addEventListener('click', () => {
            currentSort = (currentSort === 'newest') ? 'oldest' : 'newest';
            sortSwitch.setAttribute('data-val', currentSort);
            renderCards();
        });
    }

    const renderCards = () => {
        let filtered = resources.filter(item => (currentFilter === 'all' || item.type === currentFilter));
        filtered.sort((a, b) => {
            const dateA = new Date(a.date), dateB = new Date(b.date);
            return currentSort === 'newest' ? dateB - dateA : dateA - dateB;
        });

        grid.innerHTML = filtered.map(item => {
            let previewHtml = item.cover 
                ? `<img src="${item.cover}" alt="${item.title}" loading="lazy">` 
                : `<div style="width:100%; height:100%; background:#e1bee7; display:flex; align-items:center; justify-content:center; font-size:3rem;">${item.emoji || '📦'}</div>`;
                
            return `<div class="resource-card animate-in" data-id="${item.id}">
                <div class="card-preview">${previewHtml}</div>
                <div class="card-body"><h3>${item.title}</h3><p class="date-tag">📅 ${item.date}</p><p class="note">${item.desc}</p></div>
                <div class="card-footer"><span class="file-info">${item.size}</span><span class="btn-mini">查看详情</span></div>
            </div>`;
        }).join('');
        
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', () => openCard(card));
        });
    };

    // --- ⭐ 核心：打字机功能 ---
    const startTypewriter = (text, element) => {
        element.textContent = ""; // 清空内容
        let i = 0;
        
        // 定义递归打字函数
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                // 递归调用，设置打字速度 (20ms/字)
                typewriterTimer = setTimeout(type, 50); 
            }
        };
        type(); // 开始打字
    };

    // --- 打开卡片 ---
    const openCard = (card) => {
        if (appState !== 'IDLE') return;
        appState = 'OPENING';

        const id = card.dataset.id;
        const data = resources.find(r => r.id == id);
        if (!data) { appState = 'IDLE'; return; }

        const startRect = card.getBoundingClientRect();
        activeCardInfo = { card, startRect };

        const overlay = document.createElement('div');
        overlay.className = 'resource-overlay';
        
        overlay.style.top = startRect.top + 'px';
        overlay.style.left = startRect.left + 'px';
        overlay.style.width = startRect.width + 'px';
        overlay.style.height = startRect.height + 'px';

        let previewHtml = data.cover 
            ? `<img src="${data.cover}" alt="${data.title}">` 
            : `<div style="width:100%; height:100%; background:#e1bee7; display:flex; align-items:center; justify-content:center; font-size:5rem;">${data.emoji || '📦'}</div>`;

        overlay.innerHTML = `
            <button class="close-btn">&times;</button>
            <div class="overlay-preview">${previewHtml}</div>
            <div class="overlay-content">
                <h2>${data.title}</h2>
                <p class="meta">📅 发布于 ${data.date} &nbsp; | &nbsp; 📦 ${data.size}</p>
                <div class="desc"></div>
                <a href="${data.link}" class="btn-large" target="_blank" download>立即下载</a>
            </div>
        `;

        document.body.appendChild(overlay);
        activeOverlay = overlay;

        card.classList.add('is-hidden');
        backdrop.classList.add('active');
        document.body.classList.add('lock-scroll');

        let targetWidth, targetHeight, targetLeft, targetTop;
        if (window.innerWidth > 768) {
            targetWidth = Math.min(900, window.innerWidth * 0.9);
            targetHeight = Math.min(550, window.innerHeight * 0.85);
        } else {
            targetWidth = window.innerWidth * 0.92;
            targetHeight = window.innerHeight * 0.85;
        }
        targetLeft = (window.innerWidth - targetWidth) / 2;
        targetTop = (window.innerHeight - targetHeight) / 2;

        requestAnimationFrame(() => {
            overlay.classList.add('active');
            overlay.style.width = targetWidth + 'px';
            overlay.style.height = targetHeight + 'px';
            overlay.style.top = targetTop + 'px';
            overlay.style.left = targetLeft + 'px';
            overlay.style.borderRadius = '20px';
            
            setTimeout(() => {
                appState = 'OPEN';
                
                // ⭐ 修改点：动画结束后，触发打字机
                const descBox = overlay.querySelector('.desc');
                if (descBox && data.desc) {
                    startTypewriter(data.desc, descBox);
                }
            }, 500); 
        });

        const closeBtn = overlay.querySelector('.close-btn');
        closeBtn.onclick = closeCard;
    };

    // --- 关闭卡片 ---
    const closeCard = () => {
        if (appState !== 'OPEN') return;
        
        // ⭐ 修改点：关闭时立刻停止打字
        if (typewriterTimer) clearTimeout(typewriterTimer);

        appState = 'CLOSING';

        const overlay = activeOverlay;
        const { card, startRect } = activeCardInfo;

        overlay.classList.remove('active');
        overlay.classList.add('closing');
        backdrop.classList.remove('active');

        overlay.style.width = startRect.width + 'px';
        overlay.style.height = startRect.height + 'px';
        overlay.style.top = startRect.top + 'px';
        overlay.style.left = startRect.left + 'px';
        overlay.style.borderRadius = '16px';

        setTimeout(() => {
            if (card) card.classList.remove('is-hidden');
            
            overlay.classList.add('fading-out');
            
            setTimeout(() => {
                if (overlay && overlay.parentNode) overlay.remove();
                
                document.body.classList.remove('lock-scroll');
                activeCardInfo = null;
                activeOverlay = null;
                appState = 'IDLE';
            }, 300);

        }, 400); 
    };

    backdrop.onclick = () => {
        if (appState === 'OPEN') closeCard();
    };

    const forceReset = () => {
        if (typewriterTimer) clearTimeout(typewriterTimer); // 保底清理
        document.body.classList.remove('lock-scroll');
        backdrop.classList.remove('active');
        document.querySelectorAll('.resource-overlay').forEach(el => el.remove());
        document.querySelectorAll('.resource-card.is-hidden').forEach(el => el.classList.remove('is-hidden'));
        appState = 'IDLE';
        activeOverlay = null;
    };

    renderCards();
}

function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            themeBtn.classList.add('animate-bounce');
            setTimeout(() => themeBtn.classList.remove('animate-bounce'), 500);
            const currentTheme = html.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}