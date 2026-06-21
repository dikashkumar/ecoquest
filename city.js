/* ==========================================================================
   ECOQUEST GREEN CITY SIMULATOR
   ========================================================================== */

let cityGrid = {}; // Keys: "row_col", Value: { type, level }
let selectedCellKey = null;

const BUILDING_TYPES = {
    "solar_panel": { name: "Solar Panel", cost: 40, emoji: "☀️", pollution: -8, happiness: 5, green: 0, sustainability: 15 },
    "wind_turbine": { name: "Wind Turbine", cost: 60, emoji: "🌀", pollution: -12, happiness: 8, green: 0, sustainability: 20 },
    "park": { name: "Eco Park", cost: 30, emoji: "🌳", pollution: -5, happiness: 15, green: 15, sustainability: 10 },
    "recycling_center": { name: "Recycling Center", cost: 50, emoji: "♻️", pollution: -15, happiness: 6, green: 0, sustainability: 18 },
    "eco_house": { name: "Eco House", cost: 25, emoji: "🏡", pollution: 2, happiness: 10, green: 2, sustainability: 8 },
    "coal_plant": { name: "Coal Plant", cost: 10, emoji: "🏭", pollution: 25, happiness: -15, green: 0, sustainability: -25 }
};

document.addEventListener('DOMContentLoaded', () => {
    initCity();
});

function initCity() {
    // Load city from database
    loadCityState();
    
    // Close build menu when clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('cityBuildMenu');
        const board = document.getElementById('cityBoardPanel');
        if (menu && menu.style.display === 'block' && !board.contains(e.target)) {
            menu.style.display = 'none';
        }
    });
}

function loadCityState() {
    fetch('/api/get_stats')
    .then(res => res.json())
    .then(data => {
        const state = JSON.parse(data.city_state || '{}');
        cityGrid = state.grid || {};
        renderCityBoard();
        recalculateCityMetrics(false); // Parse without saving on initial load
    });
}

function saveCityState(pollution, air_quality, green_coverage, happiness, sustainability) {
    const state = {
        grid: cityGrid,
        pollution: pollution,
        air_quality: air_quality,
        green_coverage: green_coverage,
        happiness: happiness,
        sustainability: sustainability
    };
    
    fetch('/api/save_city', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city_state: state })
    });
}

function renderCityBoard() {
    const gridEl = document.getElementById('cityGrid');
    if (!gridEl) return;
    
    gridEl.innerHTML = '';
    
    // Render 6x6 grid
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            const key = `${r}_${c}`;
            const cell = document.createElement('div');
            cell.className = 'city-cell';
            cell.setAttribute('data-key', key);
            
            if (cityGrid[key]) {
                const bType = cityGrid[key].type;
                const bInfo = BUILDING_TYPES[bType];
                cell.classList.add('built');
                cell.innerHTML = `
                    <span>${bInfo.emoji}</span>
                    <span style="position: absolute; bottom: 2px; font-size: 0.6rem; color: var(--text-secondary); text-overflow:ellipsis; overflow:hidden; width:90%; white-space:nowrap; text-align:center;">${bInfo.name}</span>
                `;
            } else {
                cell.innerHTML = `+`;
            }
            
            cell.addEventListener('click', (e) => handleCellClick(e, key));
            gridEl.appendChild(cell);
        }
    }
}

function handleCellClick(e, key) {
    e.stopPropagation();
    selectedCellKey = key;
    
    const cellEl = e.currentTarget;
    const rect = cellEl.getBoundingClientRect();
    const boardRect = document.getElementById('cityBoardPanel').getBoundingClientRect();
    
    const menu = document.getElementById('cityBuildMenu');
    
    // Position build menu close to cell
    const leftOffset = rect.left - boardRect.left;
    const topOffset = rect.bottom - boardRect.top;
    
    menu.style.left = `${Math.min(leftOffset, boardRect.width - 270)}px`;
    menu.style.top = `${Math.min(topOffset, boardRect.height - 200)}px`;
    menu.style.display = 'block';
    
    playSFX('click');
    
    // Configure menu items: If cell has building, show 'Demolish' option, else show build options
    const menuGrid = document.getElementById('buildMenuGrid');
    if (cityGrid[key]) {
        const bInfo = BUILDING_TYPES[cityGrid[key].type];
        menuGrid.innerHTML = `
            <div style="font-size: 0.85rem; font-weight:700; margin-bottom: 8px; border-bottom: 1px solid var(--glass-border); padding-bottom: 4px;">
                Inspect: ${bInfo.name} ${bInfo.emoji}
            </div>
            <button class="btn-secondary" onclick="demolishBuilding()" style="border-color: var(--accent-red); color: var(--accent-red); padding: 8px; font-size:0.8rem; justify-content:center;">Demolish Building 🗑️ (Refund 5c)</button>
        `;
    } else {
        let buildOptionsHtml = '';
        for (const [type, info] of Object.entries(BUILDING_TYPES)) {
            buildOptionsHtml += `
                <div class="build-option" onclick="constructBuilding('${type}')">
                    <div class="build-option-info">
                        <span style="font-size:1.3rem;">${info.emoji}</span>
                        <span>${info.name}</span>
                    </div>
                    <span class="build-cost">${info.cost}c</span>
                </div>
            `;
        }
        menuGrid.innerHTML = buildOptionsHtml;
    }
}

function constructBuilding(type) {
    const menu = document.getElementById('cityBuildMenu');
    menu.style.display = 'none';
    
    const cost = BUILDING_TYPES[type].cost;
    
    fetch('/api/get_stats')
    .then(res => res.json())
    .then(user => {
        if (user.eco_coins < cost) {
            showToast("Not enough Eco Coins! Complete daily challenges and quizzes.", "error");
            playSFX('error');
            return;
        }
        
        // Save building locally
        cityGrid[selectedCellKey] = { type: type, level: 1 };
        
        // Deduct coins & add mini-XP
        fetch('/api/update_stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp_gain: 15, coins_gain: -cost })
        })
        .then(res => res.json())
        .then(updatedUser => {
            const headerCoins = document.getElementById('header-coins');
            if (headerCoins) headerCoins.innerText = updatedUser.total_coins;
            
            renderCityBoard();
            recalculateCityMetrics(true);
            showToast(`Constructed ${BUILDING_TYPES[type].name}!`, "success");
            playSFX('success');
        });
    });
}

function demolishBuilding() {
    const menu = document.getElementById('cityBuildMenu');
    menu.style.display = 'none';
    
    if (confirm("Are you sure you want to demolish this building? You will get a 5 Eco Coins refund.")) {
        delete cityGrid[selectedCellKey];
        
        fetch('/api/update_stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp_gain: 5, coins_gain: 5 })
        })
        .then(res => res.json())
        .then(updatedUser => {
            const headerCoins = document.getElementById('header-coins');
            if (headerCoins) headerCoins.innerText = updatedUser.total_coins;
            
            renderCityBoard();
            recalculateCityMetrics(true);
            showToast("Building demolished. Cleaned up space.", "info");
            playSFX('click');
        });
    }
}

function recalculateCityMetrics(triggerSave = true) {
    // Starting base levels
    let pollution = 60;
    let green = 15;
    let happiness = 55;
    
    // Add cumulative impact of buildings
    for (const cell of Object.values(cityGrid)) {
        const info = BUILDING_TYPES[cell.type];
        if (info) {
            pollution += info.pollution;
            green += info.green;
            happiness += info.happiness;
        }
    }
    
    // Cap indices between 0 and 100
    pollution = Math.max(5, Math.min(100, pollution));
    green = Math.max(5, Math.min(100, green));
    happiness = Math.max(5, Math.min(100, happiness));
    
    // Calculate Air Quality derived from green and pollution
    // Higher green makes AQI better; higher pollution makes it worse
    let aqi = Math.round(100 - pollution + (green * 0.4));
    aqi = Math.max(10, Math.min(100, aqi));
    
    // Calculate overall sustainability
    let sustainability = Math.round((aqi + green + happiness - pollution + 100) / 4);
    sustainability = Math.max(5, Math.min(100, sustainability));
    
    // Update HTML bars
    updateBar('pollution-bar', pollution);
    updateBar('aqi-bar', aqi);
    updateBar('green-bar', green);
    updateBar('happiness-bar', happiness);
    updateBar('sustainability-bar', sustainability);
    
    if (triggerSave) {
        saveCityState(pollution, aqi, green, happiness, sustainability);
    }
}

function updateBar(elementId, value) {
    const fill = document.getElementById(elementId + '-fill');
    const text = document.getElementById(elementId + '-text');
    
    if (fill) fill.style.width = `${value}%`;
    if (text) text.innerText = `${value}%`;
}
