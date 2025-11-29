// =========================================
// Download 页面逻辑 (Script.js - 全功能整合版)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => document.body.classList.remove('preload'), 50);
    initThemeToggle();
    if (typeof resources !== 'undefined') initResourceManager();
    
    // ✅ 找回丢失的导航栏逻辑
    initSmartNavbar();
});

// --- 1. 智能导航栏逻辑 (含居中修复) ---
function initSmartNavbar() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let isHeaderVisible = true;

    // 确保有过渡动画
    header.style.transition = 'transform 0.3s ease-in-out';

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // 向下滚 -> 隐藏 (保留 X 轴 -50% 居中)
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            if (isHeaderVisible) {
                header.style.transform = 'translate(-50%, -200%)'; 
                isHeaderVisible = false;
            }
        } 
        // 向上滚 -> 显示 (归位)
        else if (currentScrollY < lastScrollY) {
            if (!isHeaderVisible) {
                header.style.transform = 'translate(-50%, 0)'; 
                isHeaderVisible = true;
            }
        }

        lastScrollY = currentScrollY;
    });
}

// --- 2. 资源管理与卡片逻辑 ---
function initResourceManager() {
    const grid = document.getElementById('resource-grid');
    const categoryContainer = document.getElementById('category-group');
    const sortSwitch = document.getElementById('sort-switch');
    const backdrop = document.querySelector('.overlay-backdrop');

    let appState = 'IDLE'; 
    let activeCardInfo = null; 
    let activeOverlay = null;  
    let typewriterTimer = null;

    let currentFilter = 'all';
    let currentSort = 'newest';

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
            
            const opts = sortSwitch.querySelectorAll('.switch-opt');
            opts.forEach(opt => {
                if(opt.dataset.type === currentSort) opt.classList.add('active');
                else opt.classList.remove('active');
            });
            
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
                <div class="card-footer">
                    <span class="file-info">${item.size}</span>
                    <span style="color:var(--accent-green); font-size:1.4rem; font-weight:bold;">→</span>
                </div>
            </div>`;
        }).join('');
        
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', () => openCard(card));
        });
    };

    // --- ⭐ 核心：打字机功能 (DOM 遍历版 - 确保链接可点击) ---
    const startTypewriter = (htmlContent, element) => {
        // 1. 插入完整 HTML
        element.innerHTML = htmlContent;

        // 2. 递归查找文本节点
        const getTextNodes = (node) => {
            let textNodes = [];
            if (node.nodeType === 3) { 
                if (node.nodeValue.replace(/\n/g, '').length > 0) {
                    textNodes.push(node);
                }
            } else {
                node.childNodes.forEach(child => {
                    textNodes = textNodes.concat(getTextNodes(child));
                });
            }
            return textNodes;
        };

        const textNodes = getTextNodes(element);
        const allSpans = [];

        // 3. 包裹字符
        textNodes.forEach(node => {
            const wrapper = document.createDocumentFragment();
            const text = node.nodeValue;
            for (let char of text) {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.opacity = '0';
                wrapper.appendChild(span);
                allSpans.push(span);
            }
            node.parentNode.replaceChild(wrapper, node);
        });

        // 4. 逐个显示
        let i = 0;
        const reveal = () => {
            if (i < allSpans.length) {
                allSpans[i].style.opacity = '1'; 
                i++;
                typewriterTimer = setTimeout(reveal, 20); 
            } else {
                // 动画结束，双重保险：强制激活所有链接
                const links = element.querySelectorAll('a');
                links.forEach(link => {
                    link.style.pointerEvents = 'auto';
                    link.style.color = 'var(--accent-pink)';
                    link.style.textDecoration = 'underline';
                });
            }
        };
        reveal();
    };

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
            targetWidth = window.innerWidth * 0.9;
            targetHeight = window.innerHeight * 0.7;
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
                const descBox = overlay.querySelector('.desc');
                if (descBox && data.desc) {
                    startTypewriter(data.desc, descBox);
                }
            }, 500); 
        });

        const closeBtn = overlay.querySelector('.close-btn');
        closeBtn.onclick = closeCard;
    };

    const closeCard = () => {
        if (appState !== 'OPEN') return;
        
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
        if (typewriterTimer) clearTimeout(typewriterTimer);
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