// ============================================================
// 🎵 旗舰级悬浮黑胶唱机播放器逻辑 (player.js)
// 唱臂联动 · 12段动态频谱 · SVG弧形音量环(含滚轮调节) · 循环模式 · 手机端自动胶囊收纳
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const titleEl = document.getElementById("current-song-title");
    if (typeof MUSIC_DATA === "undefined" || !Array.isArray(MUSIC_DATA) || MUSIC_DATA.length === 0) {
        if (titleEl) titleEl.innerText = "请检查 songs.js";
        return;
    }

    const myPlaylist = [...MUSIC_DATA];
    for (let i = myPlaylist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [myPlaylist[i], myPlaylist[j]] = [myPlaylist[j], myPlaylist[i]];
    }

    const audio = new Audio();
    audio.preload = "none";
    let currentSongIndex = 0;
    let currentSongTitle = "";
    let loopMode = "list"; // "list" | "single"

    let isPlayerDragging = false;
    let isKnobDragging = false;
    let spectrumTimer = null;

    const player = document.getElementById("music-player");
    const playBtn = document.getElementById("play-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const modeBtn = document.getElementById("mode-btn");
    const collapseBtn = document.getElementById("collapse-player");
    const miniExpandBtn = document.getElementById("mini-expand-btn");
    const miniPlayBtn = document.getElementById("mini-play-btn");
    const miniTitleEl = document.getElementById("mini-song-title");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");
    const playlistUl = document.getElementById("playlist-ul");
    const cover = document.querySelector(".cover-spin");
    const toggleListBtn = document.getElementById("toggle-playlist");
    const currTimeEl = document.getElementById("curr-time");
    const durTimeEl = document.getElementById("dur-time");
    const spectrumBars = Array.from(document.querySelectorAll("#player-spectrum span"));
    const volumeArcFill = document.getElementById("volume-arc-fill");

    const isDarkTheme = () => document.documentElement.getAttribute("data-theme") === "dark";

    // 移动端默认收起为右下角胶囊，绝不遮挡正文
    if (window.innerWidth <= 768 && player) {
        player.classList.add("is-collapsed");
    }

    function startSpectrum() {
        if (spectrumTimer) clearInterval(spectrumTimer);
        spectrumTimer = setInterval(() => {
            spectrumBars.forEach((bar, idx) => {
                const wave = Math.sin(Date.now() * 0.008 + idx * 0.65) * 0.5 + 0.5;
                const h = 4 + Math.round((wave * 0.6 + Math.random() * 0.4) * 12);
                bar.style.height = `${h}px`;
            });
        }, 120);
    }

    function stopSpectrum() {
        if (spectrumTimer) {
            clearInterval(spectrumTimer);
            spectrumTimer = null;
        }
        spectrumBars.forEach((bar) => { bar.style.height = "3px"; });
    }

    audio.addEventListener("play", () => {
        player.classList.add("is-playing");
        if (cover) cover.classList.add("playing");
        startSpectrum();
    });

    audio.addEventListener("pause", () => {
        player.classList.remove("is-playing");
        if (cover) cover.classList.remove("playing");
        stopSpectrum();
    });

    audio.addEventListener("error", () => {
        const song = myPlaylist[currentSongIndex];
        const msg = song ? `${song.title}（加载失败）` : "音频加载失败";
        if (titleEl) titleEl.innerText = msg;
        if (miniTitleEl) miniTitleEl.innerText = msg;
        player.classList.remove("is-playing");
        if (cover) cover.classList.remove("playing");
        stopSpectrum();
    });

    // 折叠 / 展开胶囊
    const setCollapsed = (collapsed) => {
        player.classList.toggle("is-collapsed", collapsed);
        if (collapsed) {
            playlistUl.classList.remove("show");
        } else {
            requestAnimationFrame(renderSongTitle);
        }
    };
    if (collapseBtn) collapseBtn.addEventListener("click", (e) => { e.stopPropagation(); setCollapsed(true); });
    if (miniExpandBtn) miniExpandBtn.addEventListener("click", (e) => { e.stopPropagation(); setCollapsed(false); });
    if (miniTitleEl) miniTitleEl.addEventListener("click", () => setCollapsed(false));

    // 从手机宽度拉回桌面时自动展开，避免桌面端一直停在胶囊态
    const mobileMedia = window.matchMedia("(max-width: 768px)");
    const onViewportChange = (e) => { if (!e.matches) setCollapsed(false); };
    if (mobileMedia.addEventListener) mobileMedia.addEventListener("change", onViewportChange);
    else if (mobileMedia.addListener) mobileMedia.addListener(onViewportChange);

    // 循环模式切换
    if (modeBtn) {
        modeBtn.addEventListener("click", () => {
            loopMode = loopMode === "list" ? "single" : "list";
            modeBtn.classList.toggle("is-active-mode", loopMode === "single");
            modeBtn.setAttribute("title", loopMode === "single" ? "当前：单曲循环" : "当前：列表顺序");
            if (typeof showToast === "function") {
                showToast(loopMode === "single" ? "🔂 已切换为单曲循环" : "🔁 已切换为列表循环");
            }
        });
    }

    // 磁吸特效
    function initMagneticEffect() {
        document.addEventListener("mousemove", (e) => {
            if (window.innerWidth <= 768) return;
            if (isPlayerDragging || isKnobDragging || playlistUl.classList.contains("show")) {
                player.style.transform = "translate(0, 0)";
                player.style.boxShadow = "";
                player.style.borderColor = "";
                return;
            }
            const rect = player.getBoundingClientRect();
            const distX = e.clientX - (rect.left + rect.width / 2);
            const distY = e.clientY - (rect.top + rect.height / 2);
            const distance = Math.hypot(distX, distY);
            const triggerRange = 280;

            if (distance < triggerRange) {
                const power = (triggerRange - distance) / triggerRange;
                const moveX = Math.max(-15, Math.min(15, distX * power * 0.22));
                const moveY = Math.max(-15, Math.min(15, distY * power * 0.22));
                player.style.transform = `translate(${moveX}px, ${moveY}px)`;
                const g = (power * 0.55).toFixed(2);
                player.style.borderColor = isDarkTheme() ? "var(--accent-green)" : "var(--accent-pink)";
                player.style.boxShadow = isDarkTheme()
                    ? `0 22px 54px rgba(0, 0, 0, 0.72), 0 0 30px rgba(0, 240, 255, ${g})`
                    : `0 18px 42px rgba(172, 132, 122, 0.24), 0 0 26px rgba(242, 139, 168, ${g})`;
            } else {
                player.style.transform = "translate(0, 0)";
                player.style.borderColor = "";
                player.style.boxShadow = "";
            }
        });
    }

    document.addEventListener("click", (e) => {
        if (!player.contains(e.target) && playlistUl.classList.contains("show")) {
            playlistUl.classList.remove("show");
        }
    });

    function renderPlaylist() {
        playlistUl.innerHTML = "";
        myPlaylist.forEach((song, index) => {
            const li = document.createElement("li");
            const num = String(index + 1).padStart(2, "0");
            li.innerHTML = `<span class="track-num">${num}</span><span class="track-name">${song.title}</span>`;
            li.addEventListener("click", () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            playlistUl.appendChild(li);
        });
        updatePlaylistHighlight();
    }

    function loadSong(index) {
        if (index < 0 || index >= myPlaylist.length) return;
        const song = myPlaylist[index];
        setSongTitle(song.title);
        if (miniTitleEl) miniTitleEl.innerText = song.title;
        audio.src = song.src;
        progressBar.style.width = "0%";
        currTimeEl.innerText = "0:00";
        durTimeEl.innerText = "0:00";
        if (progressContainer) {
            progressContainer.setAttribute("aria-valuenow", "0");
            progressContainer.setAttribute("aria-valuetext", "0:00 / 0:00");
        }
        updatePlaylistHighlight();
    }

    function updatePlaylistHighlight() {
        playlistUl.querySelectorAll("li").forEach((item, i) => {
            item.classList.toggle("active", i === currentSongIndex);
        });
    }

    // 超出显示宽度时，像音乐软件一样循环滚动歌名
    function setSongTitle(text) {
        currentSongTitle = text || "";
        renderSongTitle();
    }

    function renderSongTitle() {
        if (!titleEl) return;
        titleEl.classList.remove("is-marquee");
        titleEl.textContent = currentSongTitle;

        requestAnimationFrame(() => {
            if (!currentSongTitle) return;
            const available = titleEl.clientWidth;
            if (!available || titleEl.scrollWidth <= available + 1) return;

            const fullWidth = titleEl.scrollWidth;
            const track = document.createElement("span");
            track.className = "title-track";
            for (let i = 0; i < 2; i++) {
                const copy = document.createElement("span");
                copy.textContent = currentSongTitle;
                track.appendChild(copy);
            }

            titleEl.textContent = "";
            titleEl.appendChild(track);
            titleEl.classList.add("is-marquee");

            const duration = Math.max(7, Math.min(24, fullWidth / 26));
            track.style.setProperty("--marquee-duration", `${duration.toFixed(1)}s`);
        });
    }

    window.addEventListener("resize", renderSongTitle, { passive: true });

    const playSong = () => audio.play().catch(() => {});
    const pauseSong = () => audio.pause();
    const togglePlay = () => (audio.paused ? playSong() : pauseSong());

    function switchSong(step, autoPlay) {
        const wasPlaying = !audio.paused;
        currentSongIndex = (currentSongIndex + step + myPlaylist.length) % myPlaylist.length;
        loadSong(currentSongIndex);
        if (autoPlay || wasPlaying) playSong();
    }

    if (playBtn) playBtn.addEventListener("click", togglePlay);
    if (miniPlayBtn) miniPlayBtn.addEventListener("click", (e) => { e.stopPropagation(); togglePlay(); });
    if (prevBtn) prevBtn.addEventListener("click", () => switchSong(-1, false));
    if (nextBtn) nextBtn.addEventListener("click", () => switchSong(1, false));
    audio.addEventListener("ended", () => {
        if (loopMode === "single") {
            audio.currentTime = 0;
            playSong();
        } else {
            switchSong(1, true);
        }
    });

    function formatTime(time) {
        if (!Number.isFinite(time) || time < 0) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? "0" + sec : sec}`;
    }

    function updateProgress() {
        const { duration, currentTime } = audio;
        if (!Number.isFinite(duration) || duration <= 0) return;
        const percent = Math.min(100, Math.max(0, (currentTime / duration) * 100));
        progressBar.style.width = `${percent}%`;
        currTimeEl.innerText = formatTime(currentTime);
        durTimeEl.innerText = formatTime(duration);
        if (progressContainer) {
            progressContainer.setAttribute("aria-valuenow", String(Math.round(percent)));
            progressContainer.setAttribute("aria-valuetext", `${formatTime(currentTime)} / ${formatTime(duration)}`);
        }
    }

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    progressContainer.addEventListener("click", (e) => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const rect = progressContainer.getBoundingClientRect();
        if (!rect.width) return;
        audio.currentTime = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) * audio.duration;
    });

    progressContainer.addEventListener("keydown", (e) => {
        const duration = audio.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;
        const step = e.shiftKey ? 15 : 5;
        let nextTime = null;

        if (e.key === "ArrowRight" || e.key === "ArrowUp") nextTime = Math.min(duration, audio.currentTime + step);
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") nextTime = Math.max(0, audio.currentTime - step);
        else if (e.key === "Home") nextTime = 0;
        else if (e.key === "End") nextTime = duration;

        if (nextTime === null) return;
        e.preventDefault();
        audio.currentTime = nextTime;
    });

    if (toggleListBtn) {
        toggleListBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playlistUl.classList.toggle("show");
        });
    }

    // 拖拽
    const handle = player.querySelector(".player-handle");
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
    const DRAG_EDGE = 10;

    function clampPlayerPosition(left, top) {
        return {
            left: Math.min(Math.max(DRAG_EDGE, left), Math.max(DRAG_EDGE, window.innerWidth - player.offsetWidth - DRAG_EDGE)),
            top: Math.min(Math.max(DRAG_EDGE, top), Math.max(DRAG_EDGE, window.innerHeight - player.offsetHeight - DRAG_EDGE))
        };
    }

    if (handle) {
        handle.addEventListener("mousedown", (e) => {
            if (window.innerWidth <= 768 || e.target.closest("button")) return;
            isPlayerDragging = true;
            handle.style.cursor = "grabbing";
            player.style.transform = "translate(0, 0)";
            startX = e.clientX; startY = e.clientY;
            const rect = player.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            player.style.bottom = "auto"; player.style.right = "auto";
            player.style.left = `${initialLeft}px`; player.style.top = `${initialTop}px`;
        });
    }

    document.addEventListener("mousemove", (e) => {
        if (!isPlayerDragging) return;
        const pos = clampPlayerPosition(initialLeft + (e.clientX - startX), initialTop + (e.clientY - startY));
        player.style.left = `${pos.left}px`;
        player.style.top = `${pos.top}px`;
    });

    document.addEventListener("mouseup", () => {
        if (!isPlayerDragging) return;
        isPlayerDragging = false;
        if (handle) handle.style.cursor = "grab";
    });

    window.addEventListener("resize", () => {
        if (!player.style.left || window.innerWidth <= 768) return;
        const pos = clampPlayerPosition(parseFloat(player.style.left) || 0, parseFloat(player.style.top) || 0);
        player.style.left = `${pos.left}px`;
        player.style.top = `${pos.top}px`;
    });

    // SVG 弧形刻度音量旋钮（支持上下拖拽 + 鼠标滚轮）
    const knob = document.getElementById("volume-knob");
    const volumeContainer = document.querySelector(".volume-container");
    let knobStartY = 0;
    let knobStartVolume = 0.55;

    audio.volume = 0.55;

    function updateKnobUI(vol) {
        if (!knob) return;
        const angle = vol * 270 - 135;
        knob.style.transform = `rotate(${angle}deg)`;
        const rgb = isDarkTheme() ? "0, 240, 255" : "242, 139, 168";
        knob.style.boxShadow = `0 0 ${3 + vol * 14}px ${vol * 4}px rgba(${rgb}, ${(0.35 + vol * 0.55).toFixed(2)})`;
        if (volumeArcFill) {
            volumeArcFill.style.strokeDasharray = `${(vol * 82).toFixed(1)} 120`;
        }
        if (volumeContainer) volumeContainer.setAttribute("title", `音量: ${Math.round(vol * 100)}%（可拖拽或滚轮调节）`);
    }

    updateKnobUI(audio.volume);
    audio.addEventListener("volumechange", () => updateKnobUI(audio.volume));

    if (volumeContainer) {
        volumeContainer.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            isKnobDragging = true;
            knobStartY = e.clientY;
            knobStartVolume = audio.volume;
            player.style.transform = "translate(0, 0)";
            e.preventDefault();
        });
        volumeContainer.addEventListener("wheel", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const next = Math.max(0, Math.min(1, audio.volume + (e.deltaY < 0 ? 0.06 : -0.06)));
            audio.volume = next;
            updateKnobUI(next);
        }, { passive: false });
    }

    window.addEventListener("mousemove", (e) => {
        if (!isKnobDragging) return;
        const next = Math.max(0, Math.min(1, knobStartVolume + (knobStartY - e.clientY) / 100));
        audio.volume = next;
        updateKnobUI(next);
    });
    window.addEventListener("mouseup", () => { isKnobDragging = false; });

    renderPlaylist();
    loadSong(0);
    initMagneticEffect();
});
