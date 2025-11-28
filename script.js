// ============================================================
// 主脚本文件 (script.js)
// 负责：黑夜模式交互、视频列表展示、影院聚焦特效
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. 初始化黑夜模式 (绑定按钮事件)
    initTheme();

    // ⭐ 核心修复：页面加载完毕后，移除禁用动画的类，恢复过渡效果
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);

    // 2. 加载精选视频
    loadFeaturedVideos();
    
    // 3. 启用平滑滚动
    addSmoothScroll();
});

/**
 * ⭐ 功能 1：黑夜模式切换逻辑 (Dark Mode)
 * 包含：本地存储记忆 + 按钮果冻弹跳动画
 */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement; 

    // (注意：初始化读取 localstorage 的逻辑已经移到 index.html 的 head 里了，这里只负责按钮)

    // 按钮点击事件
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            // --- A. 触发果冻弹跳动画 ---
            themeBtn.classList.add('animate-bounce');
            
            // 500ms 后移除动画类，确保下次点击还能触发
            setTimeout(() => {
                themeBtn.classList.remove('animate-bounce');
            }, 500);

            // --- B. 切换主题逻辑 ---
            const currentTheme = html.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                // 切换回白天
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                // 切换到黑夜
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}

/**
 * 功能 2：加载精选视频列表 (手动配置模式)
 */
function loadFeaturedVideos() {
    const container = document.querySelector(".portfolio-grid");
    if(container) container.innerHTML = ""; 

    // 视频配置
    const myVideos = [
        {
            title: "《A Seat For You》男声翻唱",
            date: "2025/10/24",
            img: "./Picture/投稿图片/asfy.jpg", 
            link: "https://www.bilibili.com/video/BV1GNsWzeEon"
        },
        {
            title: "你唱歌的时候真的！好可爱~ ",
            date: "2025/10/08",
            img: "./Picture/投稿图片/演.jpg",
            link: "https://www.bilibili.com/video/BV1rCWxzpEPt"
        },
        {
            title: "七夕特供BE翻唱《消散对白》",
            date: "2025/8/29",
            img: "./Picture/投稿图片/消散对白.jpg",
            link: "https://www.bilibili.com/video/BV1ZwvAz3EqL"
        }
    ];

    myVideos.forEach((item, index) => {
        const card = document.createElement("a");
        card.className = "card";
        card.href = item.link;
        card.target = "_blank"; 

        card.innerHTML = `
            <img src="${item.img}" class="card-img" alt="${item.title}" loading="lazy">
            <h3>${item.title}</h3>
            <div class="card-meta">
                <span>${item.date}</span>
                <span class="tag">视频</span>
            </div>
        `;

        // 绑定“影院模式 + 随机歪头”特效
        addRandomHoverEffect(card);

        container.appendChild(card);
        // 添加进场动画延迟
        setTimeout(() => card.classList.add("visible"), index * 150);
    });
}

/**
 * ⭐ 功能 3：影院聚焦模式 + 随机歪头
 */
function addRandomHoverEffect(card) {
    const body = document.body;

    card.addEventListener('mouseenter', () => {
        // 计算随机角度 (-6度 到 +6度)
        const randomAngle = (Math.random() - 0.5) * 12;

        // 设置 transform：放大 + 歪头 + 上浮
        card.style.transform = `scale(1.25) translateY(-15px) rotate(${randomAngle}deg)`;

        // 激活背景遮罩
        body.classList.add('has-focused-card');
        card.classList.add('is-focused');
    });

    card.addEventListener('mouseleave', () => {
        // 复原
        card.style.transform = ''; 
        body.classList.remove('has-focused-card');
        card.classList.remove('is-focused');
    });
}

/**
 * 功能 4：平滑滚动
 */
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}