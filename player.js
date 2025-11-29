document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 🔍 1. 检查数据源
    // ==========================================
    if (typeof MUSIC_DATA === 'undefined' || MUSIC_DATA.length === 0) {
        console.error("❌ 错误：未找到歌单数据，请确保 songs.js 已正确加载！");
        document.getElementById('current-song-title').innerText = "请检查 songs.js";
        return;
    }

    let myPlaylist = [...MUSIC_DATA];

    function shufflePlaylist() {
        for (let i = myPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [myPlaylist[i], myPlaylist[j]] = [myPlaylist[j], myPlaylist[i]];
        }
        console.log("🔀 歌单已随机重排");
    }
    shufflePlaylist();

    // ==========================================
    // 🎵 2. 核心变量
    // ==========================================
    const audio = new Audio();
    let currentSongIndex = 0;
    let isPlaying = false;

    // 全局状态标志
    let isPlayerDragging = false; // 播放器整体拖拽中
    let isKnobDragging = false;   // 旋钮拖拽中

    const player = document.getElementById('music-player');
    const titleEl = document.getElementById('current-song-title');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const playlistUl = document.getElementById('playlist-ul');
    const cover = document.querySelector('.cover-spin');
    const toggleListBtn = document.getElementById('toggle-playlist');
    const currTimeEl = document.getElementById('curr-time');
    const durTimeEl = document.getElementById('dur-time');

    // ==========================================
    // ✨ 3. 磁吸特效 (Magnetic Effect)
    // ==========================================
    function initMagneticEffect() {
        document.addEventListener('mousemove', (e) => {
            // 🚫 手机端/小屏禁用磁吸 (宽度小于 768px)
            if (window.innerWidth <= 768) return;

            // 如果正在拖拽播放器 或 正在调音量，不仅不磁吸，还要复位
            if (isPlayerDragging || isKnobDragging) {
                player.style.transform = 'translate(0, 0)';
                player.style.boxShadow = ''; 
                return;
            }

            const rect = player.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            const triggerRange = 300; 

            if (distance < triggerRange) {
                const power = (triggerRange - distance) / triggerRange;
                const maxMove = 20; 
                const moveX = distX * power * 0.3; 
                const moveY = distY * power * 0.3;

                player.style.transform = `translate(${moveX}px, ${moveY}px)`;
                
                const glowOpacity = power * 0.6; 
                player.style.borderColor = 'var(--accent-pink)';
                player.style.boxShadow = `0 15px 30px rgba(0,0,0,0.2), 
                                          0 0 20px rgba(250, 218, 221, ${glowOpacity})`;
            } else {
                player.style.transform = 'translate(0, 0)';
                player.style.borderColor = '';
                player.style.boxShadow = '';
            }
        });

        document.addEventListener('mouseleave', () => {
            player.style.transform = 'translate(0, 0)';
        });
    }

    // ==========================================
    // 🎵 4. 播放器逻辑
    // ==========================================
    
    // 点击外部自动收起列表
    document.addEventListener('click', (e) => {
        if (!player.contains(e.target) && playlistUl.classList.contains('show')) {
            playlistUl.classList.remove('show');
        }
    });

    function renderPlaylist() {
        playlistUl.innerHTML = '';
        myPlaylist.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerText = song.title;
            li.addEventListener('click', () => {
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
        titleEl.innerText = song.title;
        audio.src = song.src;
        updatePlaylistHighlight();
    }

    function updatePlaylistHighlight() {
        const items = playlistUl.querySelectorAll('li');
        items.forEach((item, i) => {
            if (i === currentSongIndex) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    function playSong() {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                playBtn.innerText = "⏸";
                cover.classList.add('playing');
            }).catch(err => console.log("等待交互:", err));
        }
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        playBtn.innerText = "▶";
        cover.classList.remove('playing');
    }

    playBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());

    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + myPlaylist.length) % myPlaylist.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    });

    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % myPlaylist.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    });

    audio.addEventListener('ended', () => nextBtn.click());

    audio.addEventListener('timeupdate', (e) => {
        const { currentTime, duration } = e.srcElement;
        if(duration) {
            const percent = (currentTime / duration) * 100;
            progressBar.style.width = `${percent}%`;
            currTimeEl.innerText = formatTime(currentTime);
            durTimeEl.innerText = formatTime(duration);
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    toggleListBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        playlistUl.classList.toggle('show');
    });

    function formatTime(time) {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }

    // ==========================================
    // 🖱️ 5. 播放器拖拽 (Fix: 与旋钮互斥)
    // ==========================================
    const handle = player.querySelector('.player-handle');
    let startX, startY, initialLeft, initialTop;

    handle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    
    // 手机端
    handle.addEventListener('touchstart', dragStart, {passive: false});
    document.addEventListener('touchmove', dragMove, {passive: false});
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        // 如果点的是按钮，不拖动
        if(e.target.tagName === 'BUTTON') return;
        
        isPlayerDragging = true;
        handle.style.cursor = "grabbing";
        
        // 清除磁吸的偏移，防止跳动
        player.style.transform = 'translate(0, 0)';

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        startX = clientX; startY = clientY;

        const rect = player.getBoundingClientRect();
        initialLeft = rect.left; initialTop = rect.top;

        // 切换为 absolute 定位
        player.style.bottom = 'auto'; player.style.right = 'auto';
        player.style.left = initialLeft + 'px'; player.style.top = initialTop + 'px';
    }

    function dragMove(e) {
        if (!isPlayerDragging) return;
        e.preventDefault();
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        const dx = clientX - startX; 
        const dy = clientY - startY;
        
        player.style.left = `${initialLeft + dx}px`; 
        player.style.top = `${initialTop + dy}px`;
    }

    function dragEnd() {
        isPlayerDragging = false;
        handle.style.cursor = "grab";
    }

    // ==========================================
    // 🎛️ 6. 音量旋钮逻辑 (Fix: stopPropagation)
    // ==========================================
    const knob = document.getElementById('volume-knob');
    const volumeContainer = document.querySelector('.volume-container');
    
    let knobStartY = 0;
    let currentVolume = 0.5;

    // 初始化
    updateKnobUI(currentVolume);
    audio.volume = currentVolume;

    volumeContainer.addEventListener('mousedown', startKnobDrag);
    volumeContainer.addEventListener('touchstart', startKnobDrag, {passive: false});

    window.addEventListener('mousemove', rotateKnob);
    window.addEventListener('mouseup', stopKnobDrag);
    
    window.addEventListener('touchmove', rotateKnob, {passive: false});
    window.addEventListener('touchend', stopKnobDrag);

    function startKnobDrag(e) {
        // ⭐ 关键修复：阻止事件冒泡，防止触发播放器的磁吸或拖拽
        e.stopPropagation(); 
        
        isKnobDragging = true;
        knobStartY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        // 拖动时禁用磁吸偏移
        player.style.transform = 'translate(0, 0)';
        
        e.preventDefault(); 
    }

    function rotateKnob(e) {
        if (!isKnobDragging) return;
        e.preventDefault();

        const clientY = e.type.includes('mouse') ? e.clientX : e.touches[0].clientY;
        
        // 修复：这里应该是 clientY (Y轴移动)
        // 重新获取实时的 Y
        const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        // 计算 Delta：向上拖是减小 Y，所以 (Start - Current)
        const delta = (knobStartY - currentY) / 100;
        
        let newVolume = currentVolume + delta;
        if (newVolume > 1) newVolume = 1;
        if (newVolume < 0) newVolume = 0;

        audio.volume = newVolume;
        updateKnobUI(newVolume);
    }

    function stopKnobDrag() {
        if (!isKnobDragging) return;
        isKnobDragging = false;
        currentVolume = audio.volume;
    }

    function updateKnobUI(vol) {
        // 角度
        const angle = (vol * 270) - 135;
        knob.style.transform = `rotate(${angle}deg)`;
        
        // 光效：音量越大，光晕越强
        const blur = 2 + (vol * 15);
        const spread = vol * 5;
        const opacity = 0.4 + (vol * 0.6); // 0.4 ~ 1.0

        // 使用 accent-pink 的颜色值 (这里写死RGB以便控制透明度)
        // Pink: 250, 218, 221
        knob.style.boxShadow = `0 0 ${blur}px ${spread}px rgba(250, 218, 221, ${opacity})`;
        
        volumeContainer.setAttribute('title', `音量: ${Math.round(vol * 100)}%`);
    }

    // 🏁 启动所有功能
    renderPlaylist();
    loadSong(0);
    initMagneticEffect(); // 启动磁吸
});