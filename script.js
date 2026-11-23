// ============================================================
// 主脚本文件 V2 (script.js)
// 极致影院 3D 卡片聚焦 · Canvas 次元星门粒子漩涡 · 呼吸感入场 · 光标追光
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    initAmbientCanvas();
    initTheme();
    setTimeout(() => document.body.classList.remove("preload"), 100);

    loadFeaturedVideos();
    addSmoothScroll();
    initScrollSpy();
    initScrollReveal();
    initSpotlightCards();
    initStargatePortal();
    initCopyEmail();
});

function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    const html = document.documentElement;
    if (!themeBtn) return;

    themeBtn.addEventListener("click", () => {
        themeBtn.classList.remove("animate-bounce");
        void themeBtn.offsetWidth;
        themeBtn.classList.add("animate-bounce");
        setTimeout(() => themeBtn.classList.remove("animate-bounce"), 540);

        const isDark = html.getAttribute("data-theme") === "dark";
        if (isDark) {
            html.removeAttribute("data-theme");
            try { localStorage.setItem("theme", "light"); } catch (e) {}
            showToast("☀️ 已切换至温暖马卡龙白昼");
        } else {
            html.setAttribute("data-theme", "dark");
            try { localStorage.setItem("theme", "dark"); } catch (e) {}
            showToast("🌙 已切换至赛博霓虹夜境");
        }
    });
}

function loadFeaturedVideos() {
    const container = document.querySelector(".portfolio-grid");
    if (!container) return;
    container.innerHTML = "";

    const myVideos = [
        {
            title: "《芭蕉夜雨》翻唱周年重置版，你是我每一首诗的主角",
            date: "2026/10/31",
            img: "./download/资源仓库文件/芭蕉夜雨（周年重制版）/1.webp",
            link: "https://www.bilibili.com/video/BV1VrxA6AEyc"
        },
        {
            title: "拒绝被改变的你呀｜双人合唱《丑马》【知空 × 爻舜】",
            date: "2026/10/18",
            img: "./download/资源仓库文件/丑马/1.webp",
            link: "https://www.bilibili.com/video/BV1AdJq6FEi1"
        },
        {
            title: "《花骨朵》男声翻唱，“眼看着那缕胭脂红，玩笑一般的开在无人问津的枝头”",
            date: "2026/09/30",
            img: "./download/资源仓库文件/花骨朵/1.webp",
            link: "https://www.bilibili.com/video/BV1pUap6DECC"
        }
    ];

    myVideos.forEach((item, index) => {
        const card = document.createElement("a");
        card.className = "card";
        card.href = item.link;
        card.target = "_blank";
        card.rel = "noopener noreferrer";

        card.innerHTML = `
            <span class="card-sheen" aria-hidden="true"></span>
            <div class="card-media">
                <img src="${item.img}" class="card-img" alt="${item.title}" loading="lazy">
                <span class="card-watch-pill">前往 B 站观看 ▶</span>
                <span class="card-play-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                </span>
            </div>
            <h3>${item.title}</h3>
            <div class="card-meta">
                <span>${item.date}</span>
                <span class="tag">Bilibili 视频</span>
            </div>
        `;

        addCinema3DHover(card);
        container.appendChild(card);
        setTimeout(() => card.classList.add("visible"), index * 130);
    });
}

/**
 * 极致影院聚焦 + 随机歪头 + 实时 3D 鼠标倾角 + 全息追光
 */
function addCinema3DHover(card) {
    const body = document.body;
    let baseAngle = 0;
    let baseRect = null;
    let tiltRaf = null;

    card.addEventListener("mouseenter", () => {
        if (window.innerWidth <= 768) return;
        // 记录放大前的布局矩形，避免用放大后的 rect 计算倾角造成抖动反馈
        baseRect = card.getBoundingClientRect();
        baseAngle = (Math.random() - 0.5) * 9; // -4.5deg ~ +4.5deg
        card.style.transition = "transform 0.36s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.3s ease";
        card.style.transform = `scale(1.22) translateY(-18px) rotate(${baseAngle.toFixed(2)}deg)`;
        body.classList.add("has-focused-card");
        card.classList.add("is-focused");
    });

    card.addEventListener("mousemove", (e) => {
        if (window.innerWidth <= 768 || !card.classList.contains("is-focused")) return;
        const rect = baseRect || card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const px = Math.min(1.12, Math.max(-0.12, (e.clientX - rect.left) / rect.width));
        const py = Math.min(1.12, Math.max(-0.12, (e.clientY - rect.top) / rect.height));
        const rx = (0.5 - py) * 14;
        const ry = (px - 0.5) * 16;

        if (tiltRaf) cancelAnimationFrame(tiltRaf);
        tiltRaf = requestAnimationFrame(() => {
            card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
            card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
            card.style.transition = "transform 0.08s ease-out, box-shadow 0.35s ease, border-color 0.3s ease";
            card.style.transform = `perspective(900px) scale(1.22) translateY(-18px) rotate(${baseAngle.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        });
    });

    card.addEventListener("mouseleave", () => {
        if (tiltRaf) {
            cancelAnimationFrame(tiltRaf);
            tiltRaf = null;
        }
        baseRect = null;
        card.style.transition = "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.3s ease";
        card.style.transform = "";
        body.classList.remove("has-focused-card");
        card.classList.remove("is-focused");
    });
}

/**
 * 次元星门粒子漩涡 + 悬停引力跃迁加速 + 点击跃迁闪光
 */
function initStargatePortal() {
    const canvas = document.getElementById("portal-canvas");
    const gate = document.getElementById("portal-gate");
    const flash = document.getElementById("warp-flash");
    if (!canvas || !gate) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let isHovered = false;
    let warpBoost = 0;

    const particles = [];
    const COUNT = 64;

    function resize() {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width || 420;
        height = rect.height || 420;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnParticle(randomRadius) {
        return {
            angle: Math.random() * Math.PI * 2,
            radius: randomRadius ? 68 + Math.random() * 125 : 140 + Math.random() * 60,
            speed: 0.008 + Math.random() * 0.016,
            size: 1.4 + Math.random() * 2.4,
            hueOffset: Math.floor(Math.random() * 4)
        };
    }

    for (let i = 0; i < COUNT; i++) {
        particles.push(spawnParticle(true));
    }

    resize();
    window.addEventListener("resize", resize);

    gate.addEventListener("mouseenter", () => { isHovered = true; });
    gate.addEventListener("mouseleave", () => { isHovered = false; });

    // 点击星门触发短暂跃迁闪光（如非预览拦截，则 360ms 后跳转）
    gate.addEventListener("click", (e) => {
        if (gate.dataset.previewVault === "true") return;
        // 保留 Ctrl/Cmd/Shift/中键 等“新标签页打开”的原生行为
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const href = gate.getAttribute("href");
        if (!href) return;
        e.preventDefault();
        warpBoost = 1;
        if (flash) flash.classList.add("active");
        setTimeout(() => {
            window.location.href = href;
        }, 360);
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const colors = isDark
            ? ["#00F0FF", "#FF2E93", "#A855F7", "#E8FF5A"]
            : ["#F28BA8", "#69C9B6", "#F7CE68", "#B69CF5"];

        const targetBoost = isHovered ? 1 : 0;
        warpBoost += (targetBoost - warpBoost) * 0.08;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const prevAngle = p.angle;
            const prevR = p.radius;

            p.angle += p.speed * (1 + warpBoost * 3.8);
            p.radius -= (0.28 + warpBoost * 2.4);

            if (p.radius < 46) {
                particles[i] = spawnParticle(false);
                continue;
            }

            const x = cx + Math.cos(p.angle) * p.radius;
            const y = cy + Math.sin(p.angle) * p.radius;
            const px = cx + Math.cos(prevAngle) * prevR;
            const py = cy + Math.sin(prevAngle) * prevR;

            const alpha = Math.min(1, (p.radius - 46) / 60) * (isDark ? 0.92 : 0.78);
            const col = colors[p.hueOffset % colors.length];

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.strokeStyle = col;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = p.size * (1 + warpBoost * 0.6);
            ctx.lineCap = "round";
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x, y, p.size * 0.85, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

/**
 * 区块滚动呼吸入场
 */
function initScrollReveal() {
    const blocks = document.querySelectorAll(".reveal-block");
    if (!blocks.length) return;

    if (!("IntersectionObserver" in window)) {
        blocks.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    blocks.forEach((el) => io.observe(el));
}

/**
 * Bento 卡片光标追光反馈
 */
function initSpotlightCards() {
    document.querySelectorAll(".spotlight-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
            card.style.setProperty("--my", `${e.clientY - rect.top}px`);
        });
    });
}

function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

function initScrollSpy() {
    const navLinks = Array.from(document.querySelectorAll("header nav a[href^='#']"));
    if (!navLinks.length) return;
    const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

    const updateActive = () => {
        const scrollY = window.scrollY + 180;
        let currentId = sections[0] ? sections[0].id : "";
        for (const sec of sections) {
            // main 有 position:relative，offsetTop 不是文档坐标，这里用视口坐标换算
            if (sec.getBoundingClientRect().top + window.scrollY <= scrollY) currentId = sec.id;
        }
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
        });
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
}

let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById("site-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function initCopyEmail() {
    const btn = document.querySelector(".copy-email-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        const email = btn.getAttribute("data-email") || "2720356281@qq.com";
        const copyFallback = () => {
            const ta = document.createElement("textarea");
            ta.value = email;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch (e) {}
            ta.remove();
            showToast(`✨ 已复制邮箱：${email}`);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(() => showToast(`✨ 已复制邮箱：${email}`)).catch(copyFallback);
        } else {
            copyFallback();
        }
    });
}


/**
 * 呼吸感氛围微粒画布（白天：暖奶油漂浮光斑；夜晚：赛博霓虹星尘与微弱视差）
 */
function initAmbientCanvas() {
    const canvas = document.getElementById("bg-ambient-canvas");
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let w = 0, h = 0;
    let mouseX = -9999, mouseY = -9999;
    const isMobile = window.innerWidth <= 768;
    const COUNT = isMobile ? 22 : 42;
    const motes = [];

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    for (let i = 0; i < COUNT; i++) {
        motes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: 2 + Math.random() * (isMobile ? 4.5 : 7),
            vx: (Math.random() - 0.5) * 0.28,
            vy: -0.15 - Math.random() * 0.34,
            phase: Math.random() * Math.PI * 2,
            speed: 0.012 + Math.random() * 0.018,
            cIdx: Math.floor(Math.random() * 4)
        });
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

    function draw() {
        ctx.clearRect(0, 0, w, h);
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const colors = isDark
            ? ["0, 240, 255", "255, 46, 147", "168, 85, 247", "232, 255, 90"]
            : ["242, 139, 168", "105, 201, 182", "247, 206, 104", "182, 156, 245"];

        for (let i = 0; i < motes.length; i++) {
            const m = motes[i];
            m.phase += m.speed;
            m.x += m.vx + Math.sin(m.phase) * 0.16;
            m.y += m.vy;

            // 光标柔推微交互
            const dx = m.x - mouseX;
            const dy = m.y - mouseY;
            const dist = Math.hypot(dx, dy);
            if (dist < 130 && dist > 1) {
                const push = (130 - dist) / 130;
                m.x += (dx / dist) * push * 0.9;
                m.y += (dy / dist) * push * 0.9;
            }

            if (m.y < -20) { m.y = h + 20; m.x = Math.random() * w; }
            if (m.x < -20) m.x = w + 20;
            if (m.x > w + 20) m.x = -20;

            const breathe = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(m.phase));
            const rad = m.r * (0.85 + 0.3 * Math.sin(m.phase));
            const col = colors[m.cIdx];

            const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, rad * 2.4);
            grad.addColorStop(0, `rgba(${col}, ${(breathe * (isDark ? 0.65 : 0.48)).toFixed(3)})`);
            grad.addColorStop(1, `rgba(${col}, 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(m.x, m.y, rad * 2.4, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}
