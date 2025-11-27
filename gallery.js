document.addEventListener("DOMContentLoaded", () => {
    shuffleArray(galleryConfig.images);
    renderGallery();
    initGallery();
});

const galleryConfig = {
    folderPath: "./Picture/Endless Gallery/",
    images: [
        { file: "1.png", text: "VRchat" },
        { file: "2.jpg", text: "シシ" },
        { file: "3.jpg", text: "喜欢睡觉" },
        { file: "4.jpg", text: "旅游" },
        { file: "5.jpg", text: "干饭" },
        { file: "6.jpg", text: "大窑最棒了！" },
        { file: "7.jpg", text: "Furry" },
        { file: "8.jpg", text: "玩原（）" },
        { file: "9.jpg", text: "还是火影男（）" },
        { file: "10.png", text: "玩崩铁（）" },
    ]
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderGallery() {
    const wrapper = document.getElementById('dynamic-gallery');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    const data = galleryConfig.images;
    const pool = [...data, ...data];

    pool.forEach(item => {
        const box = document.createElement('div');
        box.className = 'img-box';
        const img = document.createElement('img');
        img.src = `${galleryConfig.folderPath}${item.file}`; 
        img.alt = item.text;
        img.loading = "eager"; 
        
        const info = document.createElement('div');
        info.className = 'info';
        info.innerText = item.text;
        
        box.appendChild(img);
        box.appendChild(info);
        wrapper.appendChild(box);
    });
}

function initGallery() {
    const wrapper = document.querySelector('.img-wrapper');
    const prevBtn = document.querySelector('.btn-round.prev');
    const nextBtn = document.querySelector('.btn-round.next');
    const body = document.body;
    
    if (!wrapper || !prevBtn || !nextBtn) return;

    let isAnimating = false; 
    const BUFFER_SIZE = 6;
    let activeClone = null;     
    let activeOriginal = null;  

    const getStep = () => {
        const firstBox = wrapper.querySelector('.img-box');
        if (!firstBox) return 0;
        const style = window.getComputedStyle(firstBox);
        return firstBox.offsetWidth + parseFloat(style.marginRight);
    };

    const initLayout = () => {
        const step = getStep();
        if (step === 0) return;
        for (let i = 0; i < BUFFER_SIZE; i++) {
            wrapper.insertBefore(wrapper.lastElementChild, wrapper.firstElementChild);
        }
        wrapper.style.transition = 'none';
        wrapper.style.transform = `translateX(${-step * BUFFER_SIZE}px)`;
    };
    
    setTimeout(initLayout, 100);
    window.addEventListener('resize', () => {
        const step = getStep();
        wrapper.style.transition = 'none';
        wrapper.style.transform = `translateX(${-step * BUFFER_SIZE}px)`;
    });
    
    const movePhotos = (steps) => {
        if (activeClone) {
            deactivateImage();
            return;
        }
        if (isAnimating || steps === 0) return;

        isAnimating = true;
        const step = getStep();
        const currentTranslate = -step * BUFFER_SIZE;
        const targetTranslate = currentTranslate - (steps * step);
        const absSteps = Math.abs(steps);
        const duration = Math.min(0.5 + (absSteps * 0.1), 0.8);

        wrapper.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        wrapper.style.transform = `translateX(${targetTranslate}px)`;
        
        setTimeout(() => {
            wrapper.style.transition = "none";
            for (let i = 0; i < absSteps; i++) {
                if (steps > 0) { 
                    wrapper.appendChild(wrapper.firstElementChild); 
                } else { 
                    wrapper.insertBefore(wrapper.lastElementChild, wrapper.firstElementChild); 
                }
            }
            wrapper.style.transform = `translateX(${-step * BUFFER_SIZE}px)`;
            isAnimating = false;
        }, duration * 1000);
    };

    nextBtn.addEventListener('click', () => movePhotos(1));
    prevBtn.addEventListener('click', () => movePhotos(-1));

    // --- 英雄转场激活逻辑 ---

    const deactivateImage = () => {
        if (!activeClone) return;

        activeClone.classList.remove('active');
        body.classList.remove('has-focused-card'); 
        body.style.overflow = '';

        setTimeout(() => {
            if (activeClone) {
                activeClone.remove(); 
                activeClone = null;
            }
            if (activeOriginal) {
                activeOriginal.style.visibility = ''; 
                activeOriginal = null;
            }
        }, 500); 
    };

    const activateImage = (box) => {
        if (activeClone) {
            deactivateImage();
            return;
        }

        const rect = box.getBoundingClientRect();
        const img = box.querySelector('img');
        const text = box.querySelector('.info').innerText;

        const clone = document.createElement('div');
        clone.className = 'clone-overlay-img';
        
        clone.style.top = rect.top + 'px';
        clone.style.left = rect.left + 'px';
        clone.style.width = rect.width + 'px';
        clone.style.height = rect.height + 'px';

        const cloneImg = document.createElement('img');
        cloneImg.src = img.src;
        
        const cloneInfo = document.createElement('div');
        cloneInfo.className = 'info';
        cloneInfo.innerText = text;

        clone.appendChild(cloneImg);
        clone.appendChild(cloneInfo);
        document.body.appendChild(clone);
        
        activeClone = clone;
        activeOriginal = box;
        box.style.visibility = 'hidden'; 

        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;
        
        const tx = viewportCenterX - imgCenterX;
        const ty = viewportCenterY - imgCenterY;
        
        let scale = 1.2; 
        
        if (window.innerWidth < 768) {
            scale = (window.innerWidth * 0.75) / rect.width;
        } else {
            const maxScaleH = (window.innerHeight * 0.65) / rect.height;
            scale = Math.min(1.2, maxScaleH);
        }

        clone.style.setProperty('--tx', `${tx}px`);
        clone.style.setProperty('--ty', `${ty}px`);
        clone.style.setProperty('--scale', scale);

        body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            clone.classList.add('active');
            body.classList.add('has-focused-card');
        });
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('.img-box')) return; 

        if (activeClone) {
            deactivateImage();
        }
    });

    // --- 拖动逻辑 ---
    
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let startTime = 0;
    let hasMoved = false; 
    const momentumFactor = 400; 

    const dragStart = (e) => {
        if (activeClone) return; 
        if (isAnimating) return;

        isDragging = true;
        hasMoved = false;
        wrapper.style.cursor = 'grabbing'; 
        
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        currentX = startX;
        startTime = Date.now();
        
        wrapper.style.transition = 'none';
    };
    
    const dragMove = (e) => {
        if (!isDragging) return;
        
        currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const displacement = currentX - startX;
        
        if (Math.abs(displacement) > 5) {
            hasMoved = true;
            e.preventDefault(); 
            
            const step = getStep();
            const baseTranslate = -step * BUFFER_SIZE;
            wrapper.style.transform = `translateX(${baseTranslate + displacement}px)`;
        }
    };

    const dragEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        wrapper.style.cursor = 'grab';

        if (!hasMoved) {
            const clickedBox = e.target.closest('.img-box');
            if (clickedBox) {
                activateImage(clickedBox);
                // ⭐⭐⭐ 修复关键：手机端阻止幽灵点击 ⭐⭐⭐
                // 如果是触摸事件引起的打开，阻止后续的 click 事件，防止立刻关闭
                if (e.type === 'touchend' && e.cancelable) {
                    e.preventDefault();
                }
            }
            return;
        }

        const displacement = currentX - startX;
        const timeElapsed = Date.now() - startTime;
        const step = getStep();

        const velocity = displacement / (timeElapsed || 1); 
        const projectedDisplacement = displacement + (velocity * momentumFactor);
        
        let cardsToMove = -Math.round(projectedDisplacement / step);
        const maxFlick = 5; 
        cardsToMove = Math.max(-maxFlick, Math.min(cardsToMove, maxFlick));

        if (cardsToMove !== 0) {
            movePhotos(cardsToMove);
        } else {
            wrapper.style.transition = 'transform 0.3s ease';
            wrapper.style.transform = `translateX(${-step * BUFFER_SIZE}px)`;
        }
    };

    wrapper.addEventListener('mousedown', dragStart);
    wrapper.addEventListener('touchstart', dragStart, { passive: true });
    
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    
    document.addEventListener('touchmove', dragMove, { passive: false }); 
    document.addEventListener('touchend', dragEnd);
    
    wrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            const step = getStep();
            wrapper.style.transition = 'transform 0.3s ease';
            wrapper.style.transform = `translateX(${-step * BUFFER_SIZE}px)`;
        }
    });
}