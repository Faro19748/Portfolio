// ==========================================
// COPY TO CLIPBOARD & TOAST
// ==========================================
let toastTimeout;
function copyText(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast-notice');
        const toastMsg = document.getElementById('toast-message');
        toastMsg.textContent = successMsg;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
    }).catch(err => console.error('Failed to copy', err));
}

// ==========================================
// SKILL ROTATOR CAROUSEL
// ==========================================
function initSkillRotator() {
    const categories = [
        { id: 'languages', label: 'Languages' },
        { id: 'tool',      label: 'Tools'     },
        { id: 'database',  label: 'Database'  }
    ];
    let currentIndex = 0;

    const itemPrev    = document.getElementById('item-prev');
    const itemActive  = document.getElementById('item-active');
    const itemNext    = document.getElementById('item-next');
    const btnLeft     = document.getElementById('rotator-prev');
    const btnRight    = document.getElementById('rotator-next');
    const tabContents = document.querySelectorAll('.skill-tab-content');

    if (!itemPrev || !btnLeft) return;

    function updateRotator() {
        const total     = categories.length;
        const prevIndex = (currentIndex - 1 + total) % total;
        const nextIndex = (currentIndex + 1) % total;
        itemPrev.textContent   = categories[prevIndex].label;
        itemActive.textContent = categories[currentIndex].label;
        itemNext.textContent   = categories[nextIndex].label;
        tabContents.forEach(c => c.classList.remove('active'));
        const activeContent = document.getElementById(categories[currentIndex].id);
        if (activeContent) activeContent.classList.add('active');
    }

    function rotateLeft()  { currentIndex = (currentIndex - 1 + categories.length) % categories.length; updateRotator(); }
    function rotateRight() { currentIndex = (currentIndex + 1) % categories.length; updateRotator(); }

    btnLeft.addEventListener('click', rotateLeft);
    btnRight.addEventListener('click', rotateRight);
    itemPrev.addEventListener('click', rotateLeft);
    itemNext.addEventListener('click', rotateRight);

    const rotator = document.querySelector('.skill-rotator');
    if (rotator) {
        let wheelTimeout;
        rotator.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (wheelTimeout) return;
            if (e.deltaX < 0 || e.deltaY < 0) rotateLeft();
            else rotateRight();
            wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 200);
        }, { passive: false });
    }
}

// ==========================================
// PROJECT IMAGE SLIDER
// ==========================================
function setupProjectSlider({ images, imgId, prevId, nextId, dotsSelector }) {
    let currentImgIndex = 0;
    const imgEl   = document.getElementById(imgId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dots    = document.querySelectorAll(dotsSelector);

    if (!imgEl || !prevBtn || !nextBtn) return;

    function update(index) {
        currentImgIndex = (index + images.length) % images.length;
        imgEl.style.opacity = '0';
        setTimeout(() => {
            imgEl.src = images[currentImgIndex];
            imgEl.style.opacity = '1';
            // Sync lightbox if open on same gallery
            const lbImg = document.getElementById('lightbox-img');
            if (lbImg && document.getElementById('lightbox').classList.contains('active')) {
                if (lbImg.dataset.gallery === imgId) {
                    lbImg.src = images[currentImgIndex];
                    lbImg.dataset.index = currentImgIndex;
                }
            }
        }, 140);
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentImgIndex));
    }

    prevBtn.addEventListener('click', () => update(currentImgIndex - 1));
    nextBtn.addEventListener('click', () => update(currentImgIndex + 1));
    dots.forEach(dot => {
        dot.addEventListener('click', () => update(parseInt(dot.getAttribute('data-index'), 10)));
    });

    // Click image to open lightbox
    imgEl.addEventListener('click', () => openLightbox(images, currentImgIndex, imgId));
}

// ==========================================
// LIGHTBOX
// ==========================================
let lbImages = [];
let lbIndex  = 0;
let lbGalleryId = '';

function openLightbox(images, index, galleryId) {
    lbImages    = images;
    lbIndex     = index;
    lbGalleryId = galleryId;

    const overlay = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lightbox-img');
    lbImg.src          = images[index];
    lbImg.dataset.index   = index;
    lbImg.dataset.gallery = galleryId;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function lbNavigate(direction) {
    lbIndex = (lbIndex + direction + lbImages.length) % lbImages.length;
    const lbImg = document.getElementById('lightbox-img');
    lbImg.style.opacity = '0';
    setTimeout(() => {
        lbImg.src = lbImages[lbIndex];
        lbImg.style.opacity = '1';
    }, 120);
}

function initLightbox() {
    const overlay = document.getElementById('lightbox');
    if (!overlay) return;

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', () => lbNavigate(-1));
    document.getElementById('lightbox-next').addEventListener('click', () => lbNavigate(1));

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   lbNavigate(-1);
        if (e.key === 'ArrowRight')  lbNavigate(1);
    });
}

// ==========================================
// INIT ALL
// ==========================================
function initAll() {
    initSkillRotator();
    initLightbox();

    setupProjectSlider({
        images:       ['Pic/STA1.png', 'Pic/STA2.png', 'Pic/STA3.png'],
        imgId:        'project1-img',
        prevId:       'proj1-prev',
        nextId:       'proj1-next',
        dotsSelector: '#proj1-dots .gallery-dot'
    });

    setupProjectSlider({
        images:       ['Pic/SN1.jpg', 'Pic/SN2.jpg', 'Pic/SN3.jpg'],
        imgId:        'project2-img',
        prevId:       'proj2-prev',
        nextId:       'proj2-next',
        dotsSelector: '#proj2-dots .gallery-dot'
    });

    setupProjectSlider({
        images:       ['Pic/BRS1.png', 'Pic/BRS2.png', 'Pic/BRS3.png'],
        imgId:        'project3-img',
        prevId:       'proj3-prev',
        nextId:       'proj3-next',
        dotsSelector: '#proj3-dots .gallery-dot'
    });
}

document.addEventListener('DOMContentLoaded', initAll);
