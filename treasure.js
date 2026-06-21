/* ==========================================================================
   ECOQUEST ENVIRONMENTAL TREASURE HUNT
   ========================================================================== */

const RIDDLES_DATA = {
    1: {
        clue: "Clue #1: The Invisible Gas",
        riddle: "I turn yellow leaves green, but too much of me turns oceans warm. I flow out of factories and exhaust pipes, invisible yet heavy. What carbon chemical formula am I?",
        hint: "Two letters and a number. Representing carbon and oxygen.",
        answers: ["co2", "carbon dioxide", "carbon-dioxide"],
        rewardXp: 20,
        rewardCoins: 15
    },
    2: {
        clue: "Clue #2: The Wind Spinner",
        riddle: "I have blades but no knives. I spin in the gust but do not dance. I capture the breeze to light your street. What structure am I?",
        hint: "A turbine powered by air currents.",
        answers: ["wind turbine", "wind-turbine", "wind turbine", "wind power", "windmill", "wind turbines"],
        rewardXp: 25,
        rewardCoins: 20
    },
    3: {
        clue: "Clue #3: The Marine Choker",
        riddle: "I take centuries to decompose, yet humans discard me in minutes. I choke marine life and degrade into micro-particles. What polymer material am I?",
        hint: "Used for bags, bottles, straws, and packaging.",
        answers: ["plastic", "plastics", "polythene", "pet"],
        rewardXp: 30,
        rewardCoins: 25
    },
    4: {
        clue: "Clue #4: The Organic Bin Color",
        riddle: "I am the organic waste bin color in your sorting game. I represent forests, foliage, photosynthesis, and clean cities. What primary color am I?",
        hint: "The color of grass and chlorophyll.",
        answers: ["green"],
        rewardXp: 20,
        rewardCoins: 15
    },
    5: {
        clue: "Clue #5: The Flowing Power",
        riddle: "I am the renewable energy source that gathers power from flowing streams, rivers, dams, and waterfalls. What energy type am I?",
        hint: "Hydro-power or related term.",
        answers: ["hydroelectric", "hydroelectricity", "hydro power", "hydropower", "hydro", "water power", "water"],
        rewardXp: 40,
        rewardCoins: 30
    }
};

let currentRiddleLevel = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadTreasureState();
});

function loadTreasureState() {
    const savedLevel = localStorage.getItem('treasure_riddle_level') || '1';
    currentRiddleLevel = parseInt(savedLevel);
    renderRiddle();
}

function renderRiddle() {
    const level = currentRiddleLevel;
    const data = RIDDLES_DATA[level];
    
    const panel = document.getElementById('treasure-riddle-panel');
    if (!panel) return;
    
    if (level > 5) {
        panel.innerHTML = `
            <div style="text-align: center; padding: 40px 10px;">
                <span style="font-size: 4rem;">🏆</span>
                <h2 style="margin: 20px 0 10px 0;">Treasure Discovered!</h2>
                <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 30px auto;">
                    Outstanding! You solved all the environmental riddles and cracked the vault code. You are officially an Eco Legend!
                </p>
                <button class="btn-primary" onclick="resetTreasureHunt()">Reset Treasure Hunt 🔄</button>
            </div>
        `;
        return;
    }
    
    panel.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px;">
                <h3 style="color: var(--accent-blue); margin: 0;">${data.clue}</h3>
                <span class="status-badge xp">Level ${level} of 5</span>
            </div>
            
            <p style="font-size: 1.1rem; line-height: 1.6; font-style: italic; margin: 15px 0;">
                "${data.riddle}"
            </p>
            
            <div id="hint-box" style="display: none; background: rgba(255, 145, 0, 0.05); border: 1px dashed rgba(255, 145, 0, 0.2); padding: 12px; border-radius: 8px; font-size: 0.85rem;">
                💡 <strong>Hint:</strong> ${data.hint}
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 15px;">
                <input type="text" id="riddle-answer-input" placeholder="Type your answer here..." style="
                    flex-grow: 1;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    padding: 12px 18px;
                    border-radius: 12px;
                    color: var(--text-primary);
                    outline: none;
                    font-size: 0.95rem;
                ">
                <button class="btn-primary" onclick="checkRiddleAnswer()">Submit ⚡</button>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <button onclick="toggleHint()" style="background: none; border: none; color: var(--accent-orange); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Need a hint? 💡</button>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Rewards: 🌱 ${data.rewardXp} XP | 🪙 ${data.rewardCoins} Coins</span>
            </div>
        </div>
    `;
    
    // Add Enter key listener
    document.getElementById('riddle-answer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkRiddleAnswer();
        }
    });
}

function toggleHint() {
    const hintBox = document.getElementById('hint-box');
    if (hintBox) {
        hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none';
        playSFX('click');
    }
}

function checkRiddleAnswer() {
    const input = document.getElementById('riddle-answer-input');
    if (!input) return;
    
    const val = input.value.trim().toLowerCase();
    const data = RIDDLES_DATA[currentRiddleLevel];
    
    if (data.answers.includes(val)) {
        // Success
        playSFX('levelUp');
        showToast("Riddle Solved! Correct! 🎉", "success");
        
        // Save stats to database
        fetch('/api/update_stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp_gain: data.rewardXp, coins_gain: data.rewardCoins })
        })
        .then(res => res.json())
        .then(updatedUser => {
            const headerCoins = document.getElementById('header-coins');
            if (headerCoins) headerCoins.innerText = updatedUser.total_coins;
            
            // Advance level
            currentRiddleLevel++;
            localStorage.setItem('treasure_riddle_level', currentRiddleLevel.toString());
            renderRiddle();
        });
    } else {
        // Incorrect
        playSFX('error');
        showToast("Wrong Answer! Try again or reveal the hint.", "error");
        input.classList.add('wrong');
        setTimeout(() => input.classList.remove('wrong'), 500);
    }
}

function resetTreasureHunt() {
    if (confirm("Are you sure you want to reset your puzzle progress?")) {
        currentRiddleLevel = 1;
        localStorage.setItem('treasure_riddle_level', '1');
        renderRiddle();
        playSFX('click');
    }
}
