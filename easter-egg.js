// ============================================================
// ✨ 惊艳全屏彩蛋逻辑：KōShun 秘密星海音乐盒 (easter-egg.js)
// 连击充能反馈 + 全屏物理烟花音符画布 + 星光八音盒旋律 + 3D 全息典藏卡
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    initAvatarEasterEgg();
});

let eggAudioCtx = null;
function getEggAudioCtx() {
    try {
        if (!eggAudioCtx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            eggAudioCtx = new AC();
        }
        if (eggAudioCtx.state === "suspended") eggAudioCtx.resume();
        return eggAudioCtx;
    } catch (e) {
        return null;
    }
}

function playBellNote(freq, delaySec, volume) {
    const ctx = getEggAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime + (delaySec || 0);
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    overtone.type = "triangle";
    overtone.frequency.setValueAtTime(freq * 2, now);

    const ovGain = ctx.createGain();
    ovGain.gain.setValueAtTime(0.18, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume || 0.11, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

    osc.connect(gain);
    overtone.connect(ovGain);
    ovGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 1.2);
    overtone.stop(now + 1.2);
}

function playMusicBoxMelody() {
    // 温暖梦幻五声星光八音盒旋律 (C major / pentatonic sparkle)
    const melody = [
        [523.25, 0.00], [659.25, 0.18], [783.99, 0.36], [1046.50, 0.54],
        [987.77, 0.78], [783.99, 0.96], [659.25, 1.14], [880.00, 1.38],
        [783.99, 1.62], [659.25, 1.84], [587.33, 2.06], [1046.50, 2.34]
    ];
    melody.forEach(([f, t]) => playBellNote(f, t, 0.10));
}

function initAvatarEasterEgg() {
    const avatar = document.querySelector(".avatar");
    if (!avatar) return;

    let clickCount = 0;
    let clickTimer = null;

    const comboHints = [
        "✨ 戳了一下~ (1/5)",
        "🎵 好像有星光在聚集！(2/5)",
        "💫 能量正在共鸣… (3/5)",
        "🔥 再点最后一下！！(4/5)"
    ];
    const comboNotes = [523.25, 587.33, 659.25, 783.99];

    avatar.addEventListener("click", () => {
        avatar.classList.remove("popping");
        void avatar.offsetWidth;
        avatar.classList.add("popping");

        clickCount++;
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 2500);

        const rect = avatar.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        if (clickCount < 5) {
            playBellNote(comboNotes[clickCount - 1], 0, 0.08);
            showComboFloat(cx, rect.top - 10, comboHints[clickCount - 1]);
            spawnMiniSparks(cx, cy, 10 + clickCount * 4);
        } else {
            clickCount = 0;
            openStarlightStage();
        }
    });
}

function showComboFloat(x, y, text) {
    const el = document.createElement("div");
    el.className = "avatar-combo-toast";
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    const anim = el.animate(
        [
            { opacity: 0, transform: "translate(-50%, 8px) scale(0.75)" },
            { opacity: 1, transform: "translate(-50%, -14px) scale(1.04)", offset: 0.28 },
            { opacity: 0, transform: "translate(-50%, -44px) scale(0.95)" }
        ],
        { duration: 920, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
    anim.onfinish = () => el.remove();
}

function spawnMiniSparks(x, y, count) {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const palette = isDark
        ? ["#00F0FF", "#FF2E93", "#E8FF5A", "#A855F7"]
        : ["#F28BA8", "#69C9B6", "#F7CE68", "#B69CF5"];

    for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        p.style.position = "fixed";
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.width = "7px";
        p.style.height = "7px";
        p.style.borderRadius = "50%";
        p.style.pointerEvents = "none";
        p.style.zIndex = "9999";
        p.style.background = palette[Math.floor(Math.random() * palette.length)];
        document.body.appendChild(p);

        const ang = Math.random() * Math.PI * 2;
        const dist = 55 + Math.random() * 90;
        const anim = p.animate(
            [
                { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
                { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(0)`, opacity: 0 }
            ],
            { duration: 550 + Math.random() * 250, easing: "cubic-bezier(0, .9, .57, 1)" }
        );
        anim.onfinish = () => p.remove();
    }
}

/**
 * 打开全屏星海烟花 + 3D 全息典藏卡彩蛋舞台
 */
function openStarlightStage() {
    const modal = document.getElementById("easter-egg-modal");
    const canvas = document.getElementById("easter-canvas");
    const card = document.getElementById("easter-card");
    const closeBtn = modal ? modal.querySelector(".easter-close-btn") : null;
    const replayBtn = document.getElementById("easter-replay-btn");
    const fireworkBtn = document.getElementById("easter-firework-btn");

    if (!modal || !canvas) return;
    if (modal.classList.contains("active")) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.classList.add("active");
    playMusicBoxMelody();

    const ctx = canvas.getContext("2d");
    let rafId = null;
    let autoTimer = null;
    let particles = [];
    let notes = [];
    let w = 0;
    let h = 0;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function getPalette() {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        return isDark
            ? ["#00F0FF", "#FF2E93", "#E8FF5A", "#A855F7", "#FFFFFF"]
            : ["#F28BA8", "#69C9B6", "#F7CE68", "#B69CF5", "#FF9E80", "#FFFFFF"];
    }

    function burstAt(x, y, count) {
        const palette = getPalette();
        const n = count || 52;
        for (let i = 0; i < n; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 1.6 + Math.random() * 5.6;
            particles.push({
                x, y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - 0.8,
                alpha: 1,
                decay: 0.012 + Math.random() * 0.014,
                size: 2 + Math.random() * 3.2,
                color: palette[Math.floor(Math.random() * palette.length)]
            });
        }
        const symbols = ["♪", "♫", "✦", "★"];
        for (let i = 0; i < 4; i++) {
            notes.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 20,
                vy: -0.9 - Math.random() * 1.1,
                vx: (Math.random() - 0.5) * 0.8,
                alpha: 1,
                char: symbols[Math.floor(Math.random() * symbols.length)],
                color: palette[Math.floor(Math.random() * palette.length)]
            });
        }
    }

    function launchWave() {
        burstAt(w * 0.24, h * 0.30, 56);
        setTimeout(() => burstAt(w * 0.76, h * 0.28, 56), 180);
        setTimeout(() => burstAt(w * 0.50, h * 0.18, 68), 360);
    }

    launchWave();
    autoTimer = setInterval(() => {
        if (!modal.classList.contains("active")) return;
        burstAt(w * (0.15 + Math.random() * 0.7), h * (0.14 + Math.random() * 0.45), 42);
    }, 1700);

    function render() {
        ctx.clearRect(0, 0, w, h);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.065;
            p.vx *= 0.985;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.font = "700 20px sans-serif";
        ctx.textAlign = "center";
        for (let i = notes.length - 1; i >= 0; i--) {
            const nt = notes[i];
            nt.x += nt.vx;
            nt.y += nt.vy;
            nt.alpha -= 0.011;
            if (nt.alpha <= 0) {
                notes.splice(i, 1);
                continue;
            }
            ctx.globalAlpha = nt.alpha;
            ctx.fillStyle = nt.color;
            ctx.fillText(nt.char, nt.x, nt.y);
        }

        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);

    // 点击夜空发射专属烟花 + 弹奏随机星光音符
    const sparkleScale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const onCanvasClick = (e) => {
        burstAt(e.clientX, e.clientY, 58);
        const f = sparkleScale[Math.floor(Math.random() * sparkleScale.length)];
        playBellNote(f, 0, 0.09);
    };
    canvas.addEventListener("click", onCanvasClick);

    // 3D 全息典藏卡鼠标追踪倾斜
    const onCardMove = (e) => {
        if (!card || window.innerWidth <= 768) return;
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${(-py * 14).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg) scale(1.02)`;
    };
    const onCardLeave = () => {
        if (card) card.style.transform = "";
    };
    if (card) {
        card.addEventListener("mousemove", onCardMove);
        card.addEventListener("mouseleave", onCardLeave);
    }

    if (replayBtn) {
        replayBtn.onclick = (e) => {
            e.stopPropagation();
            playMusicBoxMelody();
            launchWave();
        };
    }

    if (fireworkBtn) {
        fireworkBtn.onclick = (e) => {
            e.stopPropagation();
            launchWave();
            playBellNote(1046.5, 0, 0.09);
        };
    }

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = previousBodyOverflow;
        if (rafId) cancelAnimationFrame(rafId);
        if (autoTimer) clearInterval(autoTimer);
        window.removeEventListener("resize", resize);
        canvas.removeEventListener("click", onCanvasClick);
        window.removeEventListener("keydown", onEsc, true);
        if (card) {
            card.removeEventListener("mousemove", onCardMove);
            card.removeEventListener("mouseleave", onCardLeave);
            card.style.transform = "";
        }
    };

    const onEsc = (e) => {
        if (e.key === "Escape") closeModal();
    };
    // 用捕获阶段监听，避免页面其他键盘处理影响 Esc 关闭
    window.addEventListener("keydown", onEsc, true);
    if (closeBtn) closeBtn.onclick = closeModal;
}
