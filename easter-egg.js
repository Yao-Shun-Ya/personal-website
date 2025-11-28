// =========================================
// 🥚 彩蛋逻辑模块 (easter-egg.js)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    initAvatarEasterEgg();
});

/**
 * 核心逻辑：点击 5 次触发派对特效
 */
function initAvatarEasterEgg() {
    const avatar = document.querySelector('.avatar');
    if (!avatar) return;

    let clickCount = 0;
    let clickTimer = null;

    avatar.addEventListener('click', (e) => {
        // 1. 触发 Q 弹动画 (重置动画技巧)
        avatar.classList.remove('popping');
        void avatar.offsetWidth; // 强制重绘
        avatar.classList.add('popping');

        // 2. 计数逻辑
        clickCount++;
        
        // 如果超过 2 秒没继续点，重置计数（防止误触）
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 2000);

        // 3. 触发彩蛋
        if (clickCount === 5) {
            triggerConfetti(avatar);
            showEasterModal();
            clickCount = 0; // 重置
        }
    });
}

/**
 * 触发纸屑爆炸特效
 */
function triggerConfetti(sourceElement) {
    const rect = sourceElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 生成 50 个粒子
    for (let i = 0; i < 50; i++) {
        createParticle(centerX, centerY);
    }
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('confetti-particle');
    document.body.appendChild(particle);

    // 随机颜色
    const colors = ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98', '#FFA07A'];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // 随机角度和距离
    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 200; // 爆炸半径
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    // 执行动画
    const animation = particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: Math.random() * 200
    });

    animation.onfinish = () => {
        particle.remove();
    };
}

/**
 * 显示彩蛋弹窗
 */
function showEasterModal() {
    const modal = document.getElementById('easter-egg-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.easter-close-btn');
    
    // 显示
    modal.classList.add('active');
    
    // 关闭逻辑
    const closeModal = () => {
        modal.classList.remove('active');
    };

    if(closeBtn) closeBtn.onclick = closeModal;
    
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}