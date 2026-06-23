/* ==========================================================================
   ECOQUEST POSTER CREATION CORNER
   ========================================================================== */

let pCanvas = null;
let pCtx = null;
let isDrawing = false;
let drawMode = 'draw'; // 'draw', 'text', 'sticker'
let brushColor = '#00e676';
let brushSize = 5;
let activeSticker = null;

const TEMPLATES = {
    "clean_oceans": {
        bg: "#0d47a1",
        title: "SAVE OUR OCEANS",
        slogan: "Plastic doesn't belong in the water.",
        stickers: [{ char: "🐋", x: 200, y: 350, size: 80 }]
    },
    "go_green": {
        bg: "#1b5e20",
        title: "ACT NOW: GO GREEN",
        slogan: "Plant trees, breathe clean, save Earth.",
        stickers: [{ char: "🌳", x: 200, y: 340, size: 80 }]
    },
    "recycle_all": {
        bg: "#f57c00",
        title: "RECYCLE EVERYTHING",
        slogan: "Reduce your waste, sort correctly.",
        stickers: [{ char: "♻️", x: 200, y: 330, size: 80 }]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initPoster();
});

function initPoster() {
    pCanvas = document.getElementById('posterCanvas');
    if (!pCanvas) return;
    
    pCtx = pCanvas.getContext('2d');
    
    // Set canvas dimensions explicitly
    pCanvas.width = 400;
    pCanvas.height = 565; // A4 Aspect Ratio
    
    clearPoster(false);
    
    // Add Mouse drawing listeners
    pCanvas.addEventListener('mousedown', startDraw);
    pCanvas.addEventListener('mousemove', draw);
    pCanvas.addEventListener('mouseup', stopDraw);
    pCanvas.addEventListener('mouseleave', stopDraw);
    
    // Brush settings listeners
    const colorPicker = document.getElementById('poster-color');
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            brushColor = e.target.value;
        });
    }
    
    const sizeSlider = document.getElementById('poster-size');
    if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
            brushSize = parseInt(e.target.value);
            const valBox = document.getElementById('poster-size-val');
            if (valBox) valBox.innerText = brushSize;
        });
    }
}

function clearPoster(playClick = true) {
    if (!pCtx) return;
    
    pCtx.fillStyle = '#ffffff';
    pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
    
    // Draw simple frame border
    pCtx.strokeStyle = '#e2e8f0';
    pCtx.lineWidth = 10;
    pCtx.strokeRect(5, 5, pCanvas.width - 10, pCanvas.height - 10);
    
    if (playClick) playSFX('click');
}

function startDraw(e) {
    if (drawMode !== 'draw') return;
    isDrawing = true;
    
    const rect = pCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    pCtx.beginPath();
    pCtx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing || drawMode !== 'draw') return;
    
    const rect = pCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    pCtx.lineTo(x, y);
    pCtx.strokeStyle = brushColor;
    pCtx.lineWidth = brushSize;
    pCtx.lineCap = 'round';
    pCtx.lineJoin = 'round';
    pCtx.stroke();
}

function stopDraw() {
    isDrawing = false;
}

function setDrawMode(mode) {
    drawMode = mode;
    
    // Toggle active classes on tools
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById(`tool-${mode}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    playSFX('click');
}

function selectSticker(stickerChar) {
    activeSticker = stickerChar;
    setDrawMode('sticker');
    showToast(`Sticker selected: ${stickerChar}. Click on canvas to stamp it!`, "info");
}

function applyStickerToCanvas(x, y) {
    if (!activeSticker) return;
    
    pCtx.font = '60px Arial';
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    pCtx.fillText(activeSticker, x, y);
    
    playSFX('success');
    showToast("Sticker stamped!", "success");
}

// Click on Canvas handles sticker stamps or text addition
document.addEventListener('DOMContentLoaded', () => {
    const canvasEl = document.getElementById('posterCanvas');
    if (!canvasEl) return;
    
    canvasEl.addEventListener('click', (e) => {
        const rect = canvasEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (drawMode === 'sticker') {
            applyStickerToCanvas(x, y);
        } else if (drawMode === 'text') {
            applyTextToCanvas(x, y);
        }
    });
});

function applyTextToCanvas(x, y) {
    const txtInput = document.getElementById('poster-text-input');
    if (!txtInput || !txtInput.value.trim()) {
        showToast("Enter text in the sidebar field first!", "error");
        playSFX('error');
        return;
    }
    
    const textVal = txtInput.value.trim();
    
    pCtx.fillStyle = brushColor;
    pCtx.font = `bold ${brushSize * 3}px 'Outfit', sans-serif`;
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    pCtx.fillText(textVal, x, y);
    
    playSFX('success');
    showToast("Text added to poster!", "success");
}

function applyTemplate(templateId) {
    const temp = TEMPLATES[templateId];
    if (!temp) return;
    
    // Clear & draw colored background
    pCtx.fillStyle = temp.bg;
    pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
    
    // Draw Simple Frame Border
    pCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    pCtx.lineWidth = 10;
    pCtx.strokeRect(5, 5, pCanvas.width - 10, pCanvas.height - 10);
    
    // Draw Title
    pCtx.fillStyle = '#ffffff';
    pCtx.font = "bold 26px 'Outfit', sans-serif";
    pCtx.textAlign = 'center';
    pCtx.fillText(temp.title, pCanvas.width / 2, 70);
    
    // Draw Slogan
    pCtx.font = "14px 'Inter', sans-serif";
    pCtx.fillText(temp.slogan, pCanvas.width / 2, 110);
    
    // Draw Stickers
    pCtx.font = '80px Arial';
    temp.stickers.forEach(stk => {
        pCtx.fillText(stk.char, stk.x, stk.y);
    });
    
    playSFX('success');
    showToast("Template applied!", "success");
}

function downloadPoster() {
    playSFX('levelUp');
    
    const link = document.createElement('a');
    link.download = 'ecoquest-poster.png';
    link.href = pCanvas.toDataURL();
    link.click();
    
    showToast("Poster downloaded successfully! 🎨", "success");
}
