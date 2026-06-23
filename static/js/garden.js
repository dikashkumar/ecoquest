/* ==========================================================================
   ECOQUEST VIRTUAL ECO GARDEN CONTROLLER
   ========================================================================== */

let canvas = null;
let ctx = null;
let plants = []; // Array of plant objects: { id, type, x, y, stage, water, date }
let selectedPlantIndex = -1;

const PLANT_TYPES = {
    "pine": { name: "Pine Tree", cost: 30, color: "#2e7d32", label: "🌲" },
    "oak": { name: "Oak Tree", cost: 50, color: "#1b5e20", label: "🌳" },
    "rose": { name: "Rose Flower", cost: 20, color: "#e91e63", label: "🌹" },
    "lavender": { name: "Lavender", cost: 15, color: "#9c27b0", label: "🪻" }
};

document.addEventListener('DOMContentLoaded', () => {
    initGarden();
});

function initGarden() {
    canvas = document.getElementById('gardenCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Fit canvas to parent container width
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Load existing garden state from database
    loadGardenState();
    
    // Add Click listener to select plants or plant seeds
    canvas.addEventListener('click', handleGardenClick);
}

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 450;
    drawGarden();
}

function loadGardenState() {
    // Fetch stats and garden state from server
    fetch('/api/get_stats')
    .then(res => res.json())
    .then(data => {
        plants = JSON.parse(data.garden_state || '[]');
        drawGarden();
        updateGardenHUD();
    });
}

function saveGardenState() {
    fetch('/api/save_garden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garden_state: plants })
    });
}

// Draw the garden scene on Canvas
function drawGarden() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw Ground (Soft grassy green gradient)
    const grassGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grassGrad.addColorStop(0, '#2e5a44');
    grassGrad.addColorStop(1, '#1b3b2b');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw soil rows/patches
    ctx.fillStyle = '#4e3629';
    // Draw 3 rows of soil beds
    for (let r = 0; r < 3; r++) {
        const y = 180 + (r * 100);
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, y, canvas.width * 0.4, 25, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 2. Draw Plants
    plants.forEach((plant, idx) => {
        drawPlant(plant, idx === selectedPlantIndex);
    });
    
    // 3. Draw instructions if empty
    if (plants.length === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Your garden is empty. Buy seeds from the shop and click the soil to plant them!", canvas.width / 2, canvas.height / 2 - 40);
    }
}

// Vector rendering for plants
function drawPlant(p, isSelected) {
    const x = p.x;
    const y = p.y;
    const stage = p.stage; // 0=Seed, 1=Sprout, 2=Young, 3=Mature
    
    // Selection outline glow
    if (isSelected) {
        ctx.shadowColor = '#00ff87';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = 'rgba(0, 255, 135, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI*2);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow
    }
    
    // Draw base soil mount for each plant
    ctx.fillStyle = '#3c2415';
    ctx.beginPath();
    ctx.ellipse(x, y + 5, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    if (stage === 0) {
        // Draw Seed
        ctx.fillStyle = '#ffb74d';
        ctx.beginPath();
        ctx.arc(x, y - 2, 4, 0, Math.PI * 2);
        ctx.fill();
    } 
    else if (stage === 1) {
        // Draw Sprout
        ctx.strokeStyle = '#81c784';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x - 5, y - 15, x - 2, y - 20);
        ctx.stroke();
        
        // Draw leaf
        ctx.fillStyle = '#81c784';
        ctx.beginPath();
        ctx.ellipse(x - 4, y - 18, 5, 2, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
    } 
    else if (stage === 2) {
        // Draw Young Stalk
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 35);
        ctx.stroke();
        
        // Leaves
        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.ellipse(x - 8, y - 25, 8, 3, -Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(x + 8, y - 20, 8, 3, Math.PI/6, 0, Math.PI*2);
        ctx.fill();
    } 
    else if (stage === 3) {
        // Draw Mature Plants depending on type
        if (p.type === 'pine') {
            // Pine Tree
            ctx.fillStyle = '#5d4037'; // Trunk
            ctx.fillRect(x - 4, y - 15, 8, 20);
            
            ctx.fillStyle = '#1b5e20'; // Needles
            ctx.beginPath();
            ctx.moveTo(x, y - 75);
            ctx.lineTo(x - 25, y - 45);
            ctx.lineTo(x - 15, y - 45);
            ctx.lineTo(x - 30, y - 20);
            ctx.lineTo(x + 30, y - 20);
            ctx.lineTo(x + 15, y - 45);
            ctx.lineTo(x + 25, y - 45);
            ctx.closePath();
            ctx.fill();
        } 
        else if (p.type === 'oak') {
            // Oak Tree
            ctx.fillStyle = '#4e342e'; // Trunk
            ctx.fillRect(x - 6, y - 20, 12, 25);
            
            ctx.fillStyle = '#2e7d32'; // Fluffy canopy
            ctx.beginPath();
            ctx.arc(x, y - 50, 30, 0, Math.PI * 2);
            ctx.arc(x - 20, y - 40, 22, 0, Math.PI * 2);
            ctx.arc(x + 20, y - 40, 22, 0, Math.PI * 2);
            ctx.fill();
        } 
        else if (p.type === 'rose') {
            // Rose Flower
            ctx.strokeStyle = '#388e3c'; // Stem
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + 5, y - 25, x, y - 40);
            ctx.stroke();
            
            ctx.fillStyle = '#e91e63'; // Flower head
            ctx.beginPath();
            ctx.arc(x, y - 40, 10, 0, Math.PI * 2);
            ctx.arc(x - 6, y - 45, 8, 0, Math.PI * 2);
            ctx.arc(x + 6, y - 45, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffd54f'; // Center
            ctx.beginPath();
            ctx.arc(x, y - 42, 5, 0, Math.PI * 2);
            ctx.fill();
        } 
        else if (p.type === 'lavender') {
            // Lavender
            ctx.strokeStyle = '#2e7d32'; // Stems
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y); ctx.lineTo(x - 8, y - 40);
            ctx.moveTo(x, y); ctx.lineTo(x, y - 45);
            ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 40);
            ctx.stroke();
            
            ctx.fillStyle = '#9c27b0'; // Purple buds
            ctx.beginPath();
            ctx.arc(x - 8, y - 35, 4, 0, Math.PI * 2);
            ctx.arc(x - 8, y - 42, 3, 0, Math.PI * 2);
            ctx.arc(x, y - 40, 4, 0, Math.PI * 2);
            ctx.arc(x, y - 47, 3, 0, Math.PI * 2);
            ctx.arc(x + 8, y - 35, 4, 0, Math.PI * 2);
            ctx.arc(x + 8, y - 42, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function handleGardenClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Check if clicked an existing plant
    let clickedIndex = -1;
    plants.forEach((plant, idx) => {
        const dist = Math.hypot(plant.x - clickX, plant.y - clickY);
        if (dist < 35) {
            clickedIndex = idx;
        }
    });
    
    if (clickedIndex !== -1) {
        selectedPlantIndex = clickedIndex;
        drawGarden();
        updateGardenHUD();
        playSFX('click');
        return;
    }
    
    // If we didn't click an existing plant, check if we're trying to plant a selected seed
    const activeSeedBtn = document.querySelector('.seed-card.selected');
    if (activeSeedBtn) {
        const type = activeSeedBtn.getAttribute('data-seed-type');
        const cost = PLANT_TYPES[type].cost;
        
        // Check if clicked in a valid ground row (y > 150)
        if (clickY > 150) {
            // Deduct coins & add plant
            fetch('/api/get_stats')
            .then(res => res.json())
            .then(user => {
                if (user.eco_coins < cost) {
                    showToast("Not enough Eco Coins! Complete quizzes to earn more.", "error");
                    playSFX('error');
                    return;
                }
                
                // Add new plant
                const newPlant = {
                    id: 'p_' + Date.now(),
                    type: type,
                    x: Math.round(clickX),
                    y: Math.round(clickY),
                    stage: 0,
                    water: 0,
                    date: new Date().toISOString().split('T')[0]
                };
                
                plants.push(newPlant);
                selectedPlantIndex = plants.length - 1;
                
                // Deduct coins on backend
                fetch('/api/update_stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ xp_gain: 10, coins_gain: -cost })
                })
                .then(res => res.json())
                .then(updatedUser => {
                    // Update header coin balance
                    const headerCoins = document.getElementById('header-coins');
                    if (headerCoins) headerCoins.innerText = updatedUser.total_coins;
                    
                    saveGardenState();
                    drawGarden();
                    updateGardenHUD();
                    showToast(`${PLANT_TYPES[type].name} Seed planted! -${cost} Coins.`, "success");
                    playSFX('success');
                });
            });
        }
    } else {
        // Deselect
        selectedPlantIndex = -1;
        drawGarden();
        updateGardenHUD();
    }
}

function selectSeed(element, seedType) {
    document.querySelectorAll('.seed-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    playSFX('click');
    showToast(`Seed selected. Click on the soil beds to plant it!`, "info");
}

function updateGardenHUD() {
    const panel = document.getElementById('plant-actions-panel');
    if (!panel) return;
    
    if (selectedPlantIndex === -1) {
        panel.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); padding: 20px 0;">
                <p>Select a plant in the garden to inspect details, water, or fertilize it.</p>
            </div>
        `;
        return;
    }
    
    const p = plants[selectedPlantIndex];
    const typeInfo = PLANT_TYPES[p.type];
    
    let growthText = "Seed 🌰";
    if (p.stage === 1) growthText = "Sprout 🌱";
    if (p.stage === 2) growthText = "Young Stalk 🌿";
    if (p.stage === 3) growthText = "Fully Grown 🌲";
    
    panel.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 2rem;">${typeInfo.label}</span>
                <div>
                    <h3 style="margin:0;">${typeInfo.name}</h3>
                    <p style="font-size:0.8rem; color: var(--text-secondary); margin:0;">Status: ${growthText}</p>
                </div>
            </div>
            
            <div class="metric-bar-item">
                <div class="metric-bar-header">
                    <span>Moisture Level</span>
                    <span>${p.water}%</span>
                </div>
                <div class="metric-bar-container">
                    <div class="metric-bar-fill blue" style="width: ${p.water}%;"></div>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="btn-primary" onclick="waterPlant()" style="flex:1; padding: 10px 0; justify-content:center;">Water 💧</button>
                <button class="btn-secondary" onclick="fertilizePlant()" style="flex:1; padding: 10px 0; justify-content:center;">Fertilize 🧪 (5c)</button>
            </div>
            <button class="btn-secondary" onclick="uprootPlant()" style="border-color: var(--accent-red); color: var(--accent-red); margin-top: 10px; font-size: 0.8rem; padding: 8px 0; justify-content:center;">Remove Plant 🗑️</button>
        </div>
    `;
}

function waterPlant() {
    if (selectedPlantIndex === -1) return;
    const p = plants[selectedPlantIndex];
    
    if (p.stage === 3) {
        showToast("Plant is already fully mature! 🌲", "info");
        playSFX('click');
        return;
    }
    
    p.water = Math.min(100, p.water + 34);
    
    // Check if water causes growth stage advancement
    let grew = false;
    if (p.water >= 100) {
        p.stage++;
        p.water = 0; // reset
        grew = true;
    }
    
    playSFX('success');
    
    if (grew) {
        showToast("Your plant grew to the next stage! 🚀", "success");
        // Reward XP for growing
        fetch('/api/update_stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp_gain: 20, coins_gain: 0 })
        });
    } else {
        showToast("Gave plant some water! 💧", "success");
    }
    
    saveGardenState();
    drawGarden();
    updateGardenHUD();
}

function fertilizePlant() {
    if (selectedPlantIndex === -1) return;
    const p = plants[selectedPlantIndex];
    
    if (p.stage === 3) {
        showToast("Plant is already fully mature!", "info");
        return;
    }
    
    fetch('/api/get_stats')
    .then(res => res.json())
    .then(user => {
        if (user.eco_coins < 5) {
            showToast("Not enough Eco Coins for fertilizer!", "error");
            playSFX('error');
            return;
        }
        
        // Deduct 5 coins, advance stage instantly
        p.stage++;
        p.water = 0;
        
        fetch('/api/update_stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp_gain: 20, coins_gain: -5 })
        })
        .then(res => res.json())
        .then(updatedUser => {
            const headerCoins = document.getElementById('header-coins');
            if (headerCoins) headerCoins.innerText = updatedUser.total_coins;
            
            saveGardenState();
            drawGarden();
            updateGardenHUD();
            showToast("Used Fertilizer! Stage Advanced! 🚀", "success");
            playSFX('levelUp');
        });
    });
}

function uprootPlant() {
    if (selectedPlantIndex === -1) return;
    
    if (confirm("Are you sure you want to remove this plant? You will not get your coins back.")) {
        plants.splice(selectedPlantIndex, 1);
        selectedPlantIndex = -1;
        saveGardenState();
        drawGarden();
        updateGardenHUD();
        showToast("Plant removed.", "info");
        playSFX('click');
    }
}
