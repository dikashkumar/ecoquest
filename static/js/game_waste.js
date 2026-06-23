/* ==========================================================================
   ECOQUEST WASTE SEGREGATION GAME
   ========================================================================== */

const WASTE_ITEMS = [
    { name: "Banana Peel", type: "organic", icon: "🍌" },
    { name: "Apple Core", type: "organic", icon: "🍎" },
    { name: "Eggshells", type: "organic", icon: "🥚" },
    { name: "Old Bread", type: "organic", icon: "🍞" },
    { name: "Dry Leaves", type: "organic", icon: "🍂" },
    
    { name: "Plastic Bottle", type: "recyclable", icon: "🥤" },
    { name: "Soda Can", type: "recyclable", icon: "🥫" },
    { name: "Newspaper", type: "recyclable", icon: "📰" },
    { name: "Cardboard Box", type: "recyclable", icon: "📦" },
    { name: "Glass Jar", type: "recyclable", icon: "🏺" },
    
    { name: "Dead Battery", type: "hazardous", icon: "🔋" },
    { name: "Old Cellphone", type: "hazardous", icon: "📱" },
    { name: "Broken Bulb", type: "hazardous", icon: "💡" },
    { name: "Spray Can", type: "hazardous", icon: "💨" },
    { name: "Toxin Bottle", type: "hazardous", icon: "🧪" }
];

let currentLevel = 1;
let score = 0;
let timeRemaining = 45;
let timerInterval = null;
let currentItemIndex = 0;
let levelItems = [];
let gameActive = false;

function startGame(level = 1) {
    currentLevel = level;
    score = 0;
    gameActive = true;
    currentItemIndex = 0;
    
    // Level configuration
    let itemCount = 6;
    if (level === 2) {
        itemCount = 10;
        timeRemaining = 35;
    } else if (level === 3) {
        itemCount = 14;
        timeRemaining = 25;
    } else {
        timeRemaining = 45;
    }
    
    // Choose random items and shuffle
    const shuffled = [...WASTE_ITEMS].sort(() => 0.5 - Math.random());
    levelItems = shuffled.slice(0, itemCount);
    
    // Update DOM
    document.getElementById('level-val').innerText = currentLevel;
    document.getElementById('score-val').innerText = score;
    document.getElementById('time-val').innerText = timeRemaining;
    
    // Hide startup screens
    const startScreen = document.getElementById('game-start-screen');
    if (startScreen) startScreen.style.display = 'none';
    
    const winScreen = document.getElementById('game-win-screen');
    if (winScreen) winScreen.style.display = 'none';
    
    // Show game HUD & Board
    document.getElementById('game-hud').style.display = 'flex';
    document.getElementById('game-play-area').style.display = 'block';
    
    // Start countdown
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!gameActive) return;
        timeRemaining--;
        document.getElementById('time-val').innerText = timeRemaining;
        
        if (timeRemaining <= 0) {
            endGame(false);
        }
    }, 1000);
    
    // Spawn first item
    spawnItem();
    playSFX('click');
}

function spawnItem() {
    if (currentItemIndex >= levelItems.length) {
        endGame(true);
        return;
    }
    
    const item = levelItems[currentItemIndex];
    const spawnArea = document.getElementById('waste-spawn-container');
    spawnArea.innerHTML = '';
    
    const itemEl = document.createElement('div');
    itemEl.className = 'waste-item-spawn';
    itemEl.id = 'draggable-waste';
    itemEl.draggable = true;
    itemEl.setAttribute('data-type', item.type);
    
    itemEl.innerHTML = `
        <span style="font-size: 2.8rem; line-height: 1;">${item.icon}</span>
        <span style="position: absolute; bottom: -24px; font-size: 0.8rem; font-weight: 700; white-space: nowrap; color: var(--text-primary);">${item.name}</span>
    `;
    
    // Drag Start
    itemEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.type);
        itemEl.style.opacity = '0.5';
    });
    
    itemEl.addEventListener('dragend', () => {
        itemEl.style.opacity = '1';
    });
    
    // Mobile Touch support (Simulation of Drag-and-Drop)
    setupTouchControls(itemEl);
    
    spawnArea.appendChild(itemEl);
}

function setupTouchControls(element) {
    let startX = 0;
    let startY = 0;
    let originalX = 0;
    let originalY = 0;
    
    element.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = element.getBoundingClientRect();
        originalX = rect.left;
        originalY = rect.top;
        element.style.position = 'fixed';
        element.style.left = `${rect.left}px`;
        element.style.top = `${rect.top}px`;
        element.style.zIndex = '1000';
    }, { passive: true });
    
    element.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        element.style.left = `${originalX + deltaX}px`;
        element.style.top = `${originalY + deltaY}px`;
        
        // Check which bin is under the touch
        const bins = document.querySelectorAll('.waste-bin');
        bins.forEach(bin => {
            const rect = bin.getBoundingClientRect();
            if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                bin.classList.add('drag-over');
            } else {
                bin.classList.remove('drag-over');
            }
        });
    }, { passive: true });
    
    element.addEventListener('touchend', (e) => {
        element.style.position = '';
        element.style.left = '';
        element.style.top = '';
        element.style.zIndex = '';
        
        const touch = e.changedTouches[0];
        const bins = document.querySelectorAll('.waste-bin');
        let dropped = false;
        
        bins.forEach(bin => {
            bin.classList.remove('drag-over');
            const rect = bin.getBoundingClientRect();
            if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                const targetType = bin.getAttribute('data-bin-type');
                const itemType = element.getAttribute('data-type');
                verifyDrop(itemType, targetType);
                dropped = true;
            }
        });
        
        if (!dropped) {
            // Respawn to reset position
            spawnItem();
        }
    });
}

// Enable Drag events on Bins (Desktop)
document.addEventListener('DOMContentLoaded', () => {
    const bins = document.querySelectorAll('.waste-bin');
    bins.forEach(bin => {
        bin.addEventListener('dragover', (e) => {
            e.preventDefault();
            bin.classList.add('drag-over');
        });
        
        bin.addEventListener('dragleave', () => {
            bin.classList.remove('drag-over');
        });
        
        bin.addEventListener('drop', (e) => {
            e.preventDefault();
            bin.classList.remove('drag-over');
            const itemType = e.dataTransfer.getData('text/plain');
            const targetType = bin.getAttribute('data-bin-type');
            verifyDrop(itemType, targetType);
        });
    });
});

function verifyDrop(itemType, binType) {
    if (itemType === binType) {
        score += 10;
        document.getElementById('score-val').innerText = score;
        playSFX('success');
        showToast("Correct Bin!", "success");
        currentItemIndex++;
        spawnItem();
    } else {
        score = Math.max(0, score - 5);
        document.getElementById('score-val').innerText = score;
        playSFX('error');
        showToast("Wrong Bin! Try again.", "error");
    }
}

function endGame(isWin) {
    gameActive = false;
    clearInterval(timerInterval);
    
    document.getElementById('game-play-area').style.display = 'none';
    document.getElementById('game-hud').style.display = 'none';
    
    const winScreen = document.getElementById('game-win-screen');
    winScreen.style.display = 'block';
    
    const title = winScreen.querySelector('h2');
    const desc = winScreen.querySelector('p');
    const nextBtn = document.getElementById('game-win-action-btn');
    
    if (isWin) {
        playSFX('levelUp');
        const xpGain = currentLevel * 30;
        const coinsGain = currentLevel * 20;
        
        title.innerText = "Level Complete! 🎉";
        desc.innerHTML = `Awesome sorting! You processed all waste correctly.<br><br><strong>Rewards:</strong> +${xpGain} XP, +${coinsGain} Eco Coins.`;
        
        // Save stats to database
        fetch('/api/update_stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                xp_gain: xpGain,
                coins_gain: coinsGain,
                game_complete: true
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.level_up) {
                showToast(`LEVEL UP! You reached Level ${data.new_level}! 🚀`, "success");
            }
        });
        
        if (currentLevel < 3) {
            nextBtn.innerText = `Start Level ${currentLevel + 1} ⚡`;
            nextBtn.setAttribute('onclick', `startGame(${currentLevel + 1})`);
        } else {
            nextBtn.innerText = "Play Again (Level 1) ⚡";
            nextBtn.setAttribute('onclick', "startGame(1)");
        }
    } else {
        playSFX('error');
        title.innerText = "Time's Up! ⏰";
        desc.innerText = "You ran out of time! Sort items quickly to clean the arena.";
        nextBtn.innerText = "Try Level Again ⚡";
        nextBtn.setAttribute('onclick', `startGame(${currentLevel})`);
    }
}
