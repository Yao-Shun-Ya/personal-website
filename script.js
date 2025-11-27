// ============================================================
// 主脚本文件 (script.js)
// 负责：黑夜模式交互、视频列表展示、影院聚焦特效
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. 初始化黑夜模式 (带果冻动画)
    initTheme();

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
    const html = document.documentElement; // 获取 <html> 标签

    // 1. 检查本地存储是否有用户之前的选择
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    }

    // 2. 按钮点击事件
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
 * 优点：加载速度极快，不会出现网络报错
 */
function loadFeaturedVideos() {
    const container = document.querySelector(".portfolio-grid");
    if(container) container.innerHTML = ""; 

    // ⭐ 在这里配置你的视频信息
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

    // 循环生成卡片
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
        // 添加进场动画延迟，实现依次浮入效果
        setTimeout(() => card.classList.add("visible"), index * 150);
    });
}

/**
 * ⭐ 功能 3 (核心特效)：影院聚焦模式 + 随机歪头
 * 鼠标移入时：背景变暗 + 卡片放大 + 随机角度歪一下
 */
function addRandomHoverEffect(card) {
    const body = document.body;

    card.addEventListener('mouseenter', () => {
        // 1. 计算随机角度 (-6度 到 +6度)
        // Math.random() 生成 0-1，减 0.5 变 -0.5~0.5，乘 12 变 -6~6
        const randomAngle = (Math.random() - 0.5) * 12;

        // 2. 用 JS 动态设置 transform：
        //    scale(1.25): 放大 1.25 倍 (视觉聚焦)
        //    rotate(...): 随机歪头 (俏皮感)
        //    translateY(-15px): 稍微向上浮动
        card.style.transform = `scale(1.25) translateY(-15px) rotate(${randomAngle}deg)`;

        // 3. 激活背景遮罩 (body上的类) 和 层级提升 (card上的类)
        body.classList.add('has-focused-card');
        card.classList.add('is-focused');
    });

    card.addEventListener('mouseleave', () => {
        // 4. 鼠标离开：清空内联样式，移除类名
        //    让 CSS 的 .card.visible (rotate(0)) 重新生效，平滑归位
        card.style.transform = ''; 
        body.classList.remove('has-focused-card');
        card.classList.remove('is-focused');
    });
}

/**
 * 功能 4：平滑滚动逻辑
 * 点击导航栏链接时，页面丝滑滑动到对应位置
 */
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // 阻止默认的生硬跳转
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}