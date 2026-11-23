// ============================================================
// 📂 资源小仓库 V2 逻辑 (download/script.js)
// 实时搜索 · 分类计数 · 滑动排序 · RGB 流光 FLIP 展开 · 打字机 · 智能导航栏
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    initAmbientCanvas();
    setTimeout(() => document.body.classList.remove("preload"), 60);
    initVaultThemeToggle();
    initSmartNavbar();
    if (typeof resources !== "undefined") {
        initResourceManager();
    }
});

let vaultToastTimer = null;
function showVaultToast(msg) {
    const toast = document.getElementById("site-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    if (vaultToastTimer) clearTimeout(vaultToastTimer);
    vaultToastTimer = setTimeout(() => toast.classList.remove("show"), 2100);
}

function initVaultThemeToggle() {
    const themeBtn = document.getElementById("theme-toggle");
    const html = document.documentElement;
    if (!themeBtn) return;

    themeBtn.addEventListener("click", () => {
        themeBtn.classList.remove("animate-bounce");
        void themeBtn.offsetWidth;
        themeBtn.classList.add("animate-bounce");
        setTimeout(() => themeBtn.classList.remove("animate-bounce"), 540);

        if (html.getAttribute("data-theme") === "dark") {
            html.removeAttribute("data-theme");
            try { localStorage.setItem("theme", "light"); } catch (e) {}
            showVaultToast("☀️ 已切换至温暖马卡龙白昼");
        } else {
            html.setAttribute("data-theme", "dark");
            try { localStorage.setItem("theme", "dark"); } catch (e) {}
            showVaultToast("🌙 已切换至赛博霓虹夜境");
        }
    });
}

function initSmartNavbar() {
    const header = document.querySelector("header");
    if (!header) return;
    let lastScrollY = window.scrollY;
    let isHeaderVisible = true;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 70) {
            if (isHeaderVisible) {
                header.style.transform = "translate(-50%, -180%)";
                isHeaderVisible = false;
            }
        } else if (currentScrollY < lastScrollY) {
            if (!isHeaderVisible) {
                header.style.transform = "translate(-50%, 0)";
                isHeaderVisible = true;
            }
        }
        lastScrollY = currentScrollY;
    }, { passive: true });
}

function initResourceManager() {
    const grid = document.getElementById("resource-grid");
    const categoryContainer = document.getElementById("category-group");
    const sortSwitch = document.getElementById("sort-switch");
    const searchInput = document.getElementById("resource-search");
    const statsEl = document.getElementById("vault-stats");
    const backdrop = document.querySelector(".overlay-backdrop");

    if (!grid || !categoryContainer) return;

    let appState = "IDLE";
    let activeCardInfo = null;
    let activeOverlay = null;
    let activeAura = null;
    let typewriterTimer = null;

    let currentFilter = "all";
    let currentSort = "newest";
    let searchQuery = "";

    const toPlainText = (html) => (html || "").replace(/<[^>]*>/g, "");
    const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[ch]));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const overlayFx = createOverlayFx();
    const typeNameMap = {};
    categoryConfig.forEach((c) => { typeNameMap[c.type] = c.name; });

    const renderButtons = () => {
        categoryContainer.innerHTML = categoryConfig.map((cat) => {
            const count = cat.type === "all"
                ? resources.length
                : resources.filter((r) => r.type === cat.type).length;
            const activeClass = cat.type === currentFilter ? "active" : "";
            return `<button type="button" class="filter-btn ${activeClass}" data-type="${cat.type}"><span>${cat.name}</span><span class="cat-count">${count}</span></button>`;
        }).join("");

        categoryContainer.querySelectorAll(".filter-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                categoryContainer.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.dataset.type;
                renderCards();
            });
        });
    };

    const toggleSort = () => {
        currentSort = currentSort === "newest" ? "oldest" : "newest";
        sortSwitch.setAttribute("data-val", currentSort);
        sortSwitch.querySelectorAll(".switch-opt").forEach((opt) => {
            opt.classList.toggle("active", opt.dataset.type === currentSort);
        });
        renderCards();
    };

    if (sortSwitch) {
        sortSwitch.addEventListener("click", toggleSort);
        sortSwitch.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSort();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            searchQuery = searchInput.value.trim().toLowerCase();
            renderCards();
        });
    }

    const parseDateNum = (d) => {
        const parts = String(d || "").split("-").map((n) => parseInt(n, 10) || 0);
        return new Date(parts[0] || 2000, (parts[1] || 1) - 1, parts[2] || 1).getTime();
    };

    const renderCards = () => {
        let filtered = resources.filter((item) => {
            const matchCat = currentFilter === "all" || item.type === currentFilter;
            if (!matchCat) return false;
            if (!searchQuery) return true;
            const hay = `${item.title} ${toPlainText(item.desc)} ${item.date} ${item.size}`.toLowerCase();
            return hay.includes(searchQuery);
        });

        filtered.sort((a, b) => {
            const da = parseDateNum(a.date);
            const db = parseDateNum(b.date);
            return currentSort === "newest" ? db - da : da - db;
        });

        if (statsEl) {
            statsEl.textContent = searchQuery || currentFilter !== "all"
                ? `当前筛选命中 ${filtered.length} / ${resources.length} 份资源`
                : `共收录 ${resources.length} 份声音与数据碎片 · 点击卡片展开详情`;
        }

        if (filtered.length === 0) {
            const emptyMsg = searchQuery
                ? `🔍 没有找到匹配 “${escapeHtml(searchQuery)}” 的资源，换个关键词试试吧~`
                : "📂 这个分类暂时还没有内容~";
            grid.innerHTML = `<div class="empty-state">${emptyMsg}</div>`;
            return;
        }

        grid.innerHTML = filtered.map((item, idx) => {
            const previewHtml = item.cover
                ? `<img src="${item.cover}" alt="${item.title}" loading="lazy">`
                : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">${item.emoji || "📦"}</div>`;
            const badgeText = (typeNameMap[item.type] || item.type).slice(0, 6);
            const delay = Math.min(idx * 24, 360);

            return `<article class="resource-card spotlight-card animate-in" style="animation-delay:${delay}ms" data-id="${item.id}" tabindex="0" role="button">
                <div class="card-preview">
                    ${previewHtml}
                    <span class="type-badge">${badgeText}</span>
                </div>
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <p class="date-tag">📅 ${item.date}</p>
                    <p class="note">${toPlainText(item.desc)}</p>
                </div>
                <div class="card-footer">
                    <span class="file-info">${item.size}</span>
                    <span class="card-arrow" aria-hidden="true">→</span>
                </div>
            </article>`;
        }).join("");

        grid.querySelectorAll(".resource-card").forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty("--mx", `${e.clientX - r.left}px`);
                card.style.setProperty("--my", `${e.clientY - r.top}px`);
            });
            card.addEventListener("click", (e) => {
                if (e.target.closest("a")) return;
                openCard(card);
            });
            card.addEventListener("keydown", (e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                openCard(card);
            });
        });
    };

    const startTypewriter = (htmlContent, element) => {
        element.innerHTML = htmlContent;
        if (reduceMotion) {
            element.querySelectorAll("a").forEach((link) => {
                link.style.setProperty("pointer-events", "auto", "important");
            });
            return;
        }

        element.querySelectorAll("a").forEach((link) => {
            link.style.setProperty("pointer-events", "none", "important");
        });

        const getTextNodes = (node) => {
            let textNodes = [];
            if (node.nodeType === 3) {
                if (node.nodeValue.replace(/\n/g, "").length > 0) textNodes.push(node);
            } else {
                node.childNodes.forEach((child) => {
                    textNodes = textNodes.concat(getTextNodes(child));
                });
            }
            return textNodes;
        };

        const allSpans = [];
        getTextNodes(element).forEach((node) => {
            const frag = document.createDocumentFragment();
            for (const ch of node.nodeValue) {
                const span = document.createElement("span");
                span.textContent = ch;
                span.style.opacity = "0";
                frag.appendChild(span);
                allSpans.push(span);
            }
            node.parentNode.replaceChild(frag, node);
        });

        let i = 0;
        const step = allSpans.length > 260 ? 3 : 1;
        const reveal = () => {
            if (i < allSpans.length) {
                for (let k = 0; k < step && i < allSpans.length; k++, i++) {
                    allSpans[i].style.opacity = "1";
                }
                typewriterTimer = setTimeout(reveal, 16);
            } else {
                element.querySelectorAll("a").forEach((link) => {
                    link.style.setProperty("pointer-events", "auto", "important");
                });
            }
        };
        reveal();
    };

    const openCard = (card) => {
        if (appState !== "IDLE") return;
        appState = "OPENING";

        const id = card.dataset.id;
        const data = resources.find((r) => String(r.id) === String(id));
        if (!data) { appState = "IDLE"; return; }

        const startRect = card.getBoundingClientRect();
        activeCardInfo = { card, startRect };

        const aura = document.createElement("div");
        aura.className = "resource-overlay-aura";
        aura.setAttribute("aria-hidden", "true");
        aura.style.top = `${startRect.top}px`;
        aura.style.left = `${startRect.left}px`;
        aura.style.width = `${startRect.width}px`;
        aura.style.height = `${startRect.height}px`;
        document.body.appendChild(aura);
        activeAura = aura;
        overlayFx.start();

        const overlay = document.createElement("div");
        overlay.className = "resource-overlay";
        overlay.style.top = `${startRect.top}px`;
        overlay.style.left = `${startRect.left}px`;
        overlay.style.width = `${startRect.width}px`;
        overlay.style.height = `${startRect.height}px`;

        const previewHtml = data.cover
            ? `<img src="${data.cover}" alt="${data.title}">`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4.5rem;">${data.emoji || "📦"}</div>`;

        overlay.innerHTML = `
            <button class="close-btn" aria-label="关闭">&times;</button>
            <div class="overlay-preview">${previewHtml}</div>
            <div class="overlay-content">
                <div class="overlay-scroll">
                    <h2>${data.title}</h2>
                    <p class="meta">📅 发布于 ${data.date} &nbsp; · &nbsp; 📦 ${data.size}</p>
                    <div class="desc"></div>
                </div>
                <div class="overlay-footer">
                    <a href="${data.link}" class="btn-large" target="_blank" rel="noopener noreferrer" download>⬇ 立即下载资源</a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        activeOverlay = overlay;

        card.classList.add("is-hidden");
        if (backdrop) backdrop.classList.add("active");
        document.body.classList.add("lock-scroll");

        let targetWidth, targetHeight;
        if (window.innerWidth > 768) {
            targetWidth = Math.min(900, window.innerWidth * 0.9);
            targetHeight = Math.min(540, window.innerHeight * 0.84);
        } else {
            targetWidth = window.innerWidth * 0.92;
            targetHeight = window.innerHeight * 0.76;
        }
        const targetLeft = (window.innerWidth - targetWidth) / 2;
        const targetTop = (window.innerHeight - targetHeight) / 2;

        requestAnimationFrame(() => {
            overlay.classList.add("active");
            overlay.style.width = `${targetWidth}px`;
            overlay.style.height = `${targetHeight}px`;
            overlay.style.top = `${targetTop}px`;
            overlay.style.left = `${targetLeft}px`;

            aura.classList.add("active");
            aura.style.width = `${targetWidth}px`;
            aura.style.height = `${targetHeight}px`;
            aura.style.top = `${targetTop}px`;
            aura.style.left = `${targetLeft}px`;

            setTimeout(() => {
                appState = "OPEN";
                const descBox = overlay.querySelector(".desc");
                if (descBox && data.desc) startTypewriter(data.desc, descBox);
            }, 440);
        });

        overlay.querySelector(".close-btn").onclick = closeCard;
    };

    const closeCard = () => {
        if (appState !== "OPEN") return;
        if (typewriterTimer) clearTimeout(typewriterTimer);
        appState = "CLOSING";

        const overlay = activeOverlay;
        const { card, startRect } = activeCardInfo;

        overlayFx.stop();

        const aura = activeAura;
        activeAura = null;
        if (aura) {
            aura.classList.remove("active");
            aura.style.width = `${startRect.width}px`;
            aura.style.height = `${startRect.height}px`;
            aura.style.top = `${startRect.top}px`;
            aura.style.left = `${startRect.left}px`;
            setTimeout(() => aura.remove(), 620);
        }

        overlay.classList.remove("active");
        overlay.classList.add("closing");
        if (backdrop) backdrop.classList.remove("active");

        overlay.style.width = `${startRect.width}px`;
        overlay.style.height = `${startRect.height}px`;
        overlay.style.top = `${startRect.top}px`;
        overlay.style.left = `${startRect.left}px`;

        setTimeout(() => {
            if (card) card.classList.remove("is-hidden");
            overlay.classList.add("fading-out");
            setTimeout(() => {
                if (overlay && overlay.parentNode) overlay.remove();
                document.body.classList.remove("lock-scroll");
                activeCardInfo = null;
                activeOverlay = null;
                appState = "IDLE";
            }, 260);
        }, 360);
    };

    if (backdrop) {
        backdrop.onclick = () => {
            if (appState === "OPEN") closeCard();
        };
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && appState === "OPEN") closeCard();
    });

    renderButtons();
    renderCards();
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

/**
 * 展开卡片时，在模糊背景层里运行的粒子漩涡
 * 只在详情打开期间启动，关闭立即停止，避免常驻占用
 */
function createOverlayFx() {
    const canvas = document.getElementById("vault-particles");
    const noop = { start() {}, stop() {} };
    if (!canvas) return noop;

    const ctx = canvas.getContext("2d");
    if (!ctx) return noop;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spiral = [];
    const dust = [];
    let rafId = null;
    let running = false;
    let w = 0;
    let h = 0;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spiralParticle(initial) {
        const maxR = Math.hypot(w, h) * 0.55;
        return {
            angle: Math.random() * Math.PI * 2,
            radius: initial ? 80 + Math.random() * maxR : maxR * (0.72 + Math.random() * 0.28),
            speed: 0.006 + Math.random() * 0.014,
            pull: 0.5 + Math.random() * 1.1,
            size: 1.3 + Math.random() * 2.2,
            hue: Math.floor(Math.random() * 4),
            alpha: 0.45 + Math.random() * 0.5
        };
    }

    function dustParticle() {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.22,
            vy: -0.08 - Math.random() * 0.22,
            size: 1 + Math.random() * 1.8,
            hue: Math.floor(Math.random() * 4),
            alpha: 0.2 + Math.random() * 0.35
        };
    }

    function initParticles() {
        spiral.length = 0;
        dust.length = 0;
        const mobile = w <= 768;
        const spiralCount = mobile ? 56 : 110;
        const dustCount = mobile ? 30 : 54;

        for (let i = 0; i < spiralCount; i++) spiral.push(spiralParticle(true));
        for (let i = 0; i < dustCount; i++) dust.push(dustParticle());
    }

    function colorsFor(isDark) {
        return isDark
            ? ["0, 240, 255", "255, 46, 147", "168, 85, 247", "232, 255, 90"]
            : ["242, 139, 168", "105, 201, 182", "247, 206, 104", "182, 156, 245"];
    }

    function drawFrame() {
        if (!w || !h) return;
        ctx.clearRect(0, 0, w, h);

        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const colors = colorsFor(isDark);
        const cx = w / 2;
        const cy = h / 2;

        // 叠加混合，让粒子在暗色模糊背景上有星门般的发光感
        ctx.globalCompositeOperation = "lighter";

        for (const d of dust) {
            d.x += d.vx;
            d.y += d.vy;
            if (d.y < -20) { d.y = h + 20; d.x = Math.random() * w; }
            if (d.x < -20) d.x = w + 20;
            if (d.x > w + 20) d.x = -20;

            const dustAlpha = d.alpha * (isDark ? 0.95 : 0.7);
            ctx.beginPath();
            ctx.fillStyle = `rgba(${colors[d.hue]}, ${(dustAlpha * 0.18).toFixed(3)})`;
            ctx.arc(d.x, d.y, d.size * 3.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = `rgba(${colors[d.hue]}, ${dustAlpha.toFixed(3)})`;
            ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 0; i < spiral.length; i++) {
            const p = spiral[i];
            const prevAngle = p.angle;
            const prevR = p.radius;
            p.angle += p.speed;
            p.radius -= p.pull;

            if (p.radius < 54) {
                spiral[i] = spiralParticle(false);
                continue;
            }

            const x = cx + Math.cos(p.angle) * p.radius;
            const y = cy + Math.sin(p.angle) * p.radius * 0.62;
            const px = cx + Math.cos(prevAngle) * prevR;
            const py = cy + Math.sin(prevAngle) * prevR * 0.62;
            const fade = Math.min(1, (p.radius - 54) / 90);
            const alpha = p.alpha * fade * (isDark ? 1 : 0.72);

            // 粒子自带柔光
            ctx.beginPath();
            ctx.fillStyle = `rgba(${colors[p.hue]}, ${(alpha * 0.16).toFixed(3)})`;
            ctx.arc(x, y, p.size * 3.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `rgba(${colors[p.hue]}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = p.size * 1.1;
            ctx.lineCap = "round";
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = `rgba(${colors[p.hue]}, ${Math.min(1, alpha * 1.8).toFixed(3)})`;
            ctx.arc(x, y, p.size * 0.85, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = "source-over";
    }

    function loop() {
        drawFrame();
        rafId = requestAnimationFrame(loop);
    }

    function start() {
        if (running) return;
        running = true;
        resize();
        initParticles();
        if (reduceMotion) {
            drawFrame();
            return;
        }
        loop();
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    window.addEventListener("resize", () => {
        resize();
        if (!running) return;
        initParticles();
        if (reduceMotion) drawFrame();
    }, { passive: true });

    return { start, stop };
}
