/* ==========================================================================
   ECOQUEST STORY ADVENTURE MODE
   ========================================================================== */

const STORY_DATA = {
    1: {
        title: "Clean The River",
        character: {
            name: "Marina (Marine Biologist)",
            avatar: `<svg viewBox="0 0 100 100" width="100%"><circle cx="50" cy="40" r="25" fill="#4fc3f7"/><ellipse cx="50" cy="85" rx="35" ry="20" fill="#0288d1"/><circle cx="43" cy="35" r="3" fill="black"/><circle cx="57" cy="35" r="3" fill="black"/><path d="M45,50 Q50,55 55,50" fill="none" stroke="black" stroke-width="2"/></svg>`
        },
        steps: [
            {
                text: "Hi there! Our local river is choked with plastic and trash. Aquatic life is struggling, and toxic chemicals are leaking. We need an immediate action plan. What should we do first?",
                choices: [
                    {
                        text: "Organize a volunteer clean-up drive this weekend.",
                        feedback: "Great choice! Local citizens join in, collecting 200kg of garbage. The river flows cleaner, but we need long-term preventions.",
                        xp: 20, coins: 15, next: 1
                    },
                    {
                        text: "Install mesh trash barriers at storm drain outlets.",
                        feedback: "Excellent! The meshes capture incoming floating trash before it enters the main river system. A great structural start!",
                        xp: 25, coins: 20, next: 1
                    }
                ]
            },
            {
                text: "A local manufacturing plant is dumping thermal water into the river, depleting oxygen. How do we address this industrial pollution?",
                choices: [
                    {
                        text: "Draft a petition to the city council to enforce cooling basins.",
                        feedback: "Success! The council mandates cooling ponds, cooling the water before discharge. Ecosystem oxygen levels restore!",
                        xp: 30, coins: 25, next: 2
                    },
                    {
                        text: "Confront the factory management directly and suggest eco-audits.",
                        feedback: "Good, but factory management delays action. Direct policy works faster here. However, they agree to do basic testing.",
                        xp: 15, coins: 10, next: 2
                    }
                ]
            },
            {
                text: "The river looks beautiful again, but how do we prevent future littering by tourists and citizens?",
                choices: [
                    {
                        text: "Install clear signs, recycling bins, and fine warning boards.",
                        feedback: "Perfect! Fines and accessible recycling bins keep littering to a minimum. Mission fully accomplished!",
                        xp: 30, coins: 20, next: "win"
                    },
                    {
                        text: "Hire full-time security guards to patrol the banks.",
                        feedback: "Effective, but extremely expensive for the community long-term. Signs and public awareness are more sustainable.",
                        xp: 20, coins: 10, next: "win"
                    }
                ]
            }
        ]
    },
    2: {
        title: "Save The Forest",
        character: {
            name: "Ranger Oak (Forest Guardian)",
            avatar: `<svg viewBox="0 0 100 100" width="100%"><circle cx="50" cy="40" r="25" fill="#a1887f"/><ellipse cx="50" cy="85" rx="35" ry="20" fill="#2e7d32"/><circle cx="43" cy="35" r="3" fill="black"/><circle cx="57" cy="35" r="3" fill="black"/><path d="M45,48 Q50,52 55,48" fill="none" stroke="black" stroke-width="2"/></svg>`
        },
        steps: [
            {
                text: "Welcome to the Whispering Woods. Illegal logging and wildfire risks are destroying our old-growth trees. What action should we take to counter loggers?",
                choices: [
                    {
                        text: "Deploy acoustic sensors to detect chainsaws in real-time.",
                        feedback: "Brilliant! The sensors alert rangers instantly, catching illegal logging operations on day one. Forest cleared area drops by 80%!",
                        xp: 30, coins: 25, next: 1
                    },
                    {
                        text: "Build physical fences around the forest border.",
                        feedback: "Loggers find gaps or cut the fences. Fencing such a massive perimeter is slow and expensive. Acoustic monitoring is smarter.",
                        xp: 15, coins: 10, next: 1
                    }
                ]
            },
            {
                text: "Dry brush has accumulated, posing massive forest fire hazards. How do we safeguard the ecosystem?",
                choices: [
                    {
                        text: "Perform controlled, supervised burning of dry ground leaves.",
                        feedback: "Correct! Controlled burns remove fire fuel safely, preventing catastrophic high-canopy fires. A proven forest management tactic.",
                        xp: 25, coins: 20, next: 2
                    },
                    {
                        text: "Water the entire forest using helicopters.",
                        feedback: "Very inefficient! Helicopters cannot carry enough water to damp down a massive forest. Controlled burns are the standard.",
                        xp: 10, coins: 5, next: 2
                    }
                ]
            },
            {
                text: "Many areas are now barren. How should we reforest to restore the natural biodiversity?",
                choices: [
                    {
                        text: "Plant a single fast-growing eucalyptus tree species everywhere.",
                        feedback: "Oh no! Monoculture planting makes forests vulnerable to pests and doesn't support local wildlife. We need native variety.",
                        xp: 10, coins: 5, next: 3
                    },
                    {
                        text: "Plant a diverse mix of native deciduous and fruit-bearing trees.",
                        feedback: "Excellent! Native variety restores soil quality, invites insect and animal pollinators, and mimics natural forests. Mission won!",
                        xp: 35, coins: 30, next: "win"
                    }
                ]
            },
            {
                // Fallback step if they failed the biodiversity tree choice
                text: "You realized the monoculture eucalyptus wasn't working. Let's fix it by adding native wild oak, pine, and maples. Agreed?",
                choices: [
                    {
                        text: "Yes, replace and diversify the forest floor.",
                        feedback: "Great recovery! The forest thrives, native animals return, and our canopy stands strong. Forest mission complete!",
                        xp: 20, coins: 15, next: "win"
                    }
                ]
            }
        ]
    },
    3: {
        title: "Reduce Plastics",
        character: {
            name: "Eco-Ella (Green Youth Leader)",
            avatar: `<svg viewBox="0 0 100 100" width="100%"><circle cx="50" cy="40" r="25" fill="#e1bee7"/><ellipse cx="50" cy="85" rx="35" ry="20" fill="#9c27b0"/><circle cx="43" cy="35" r="3" fill="black"/><circle cx="57" cy="35" r="3" fill="black"/><path d="M45,50 Q50,55 55,50" fill="none" stroke="black" stroke-width="2"/></svg>`
        },
        steps: [
            {
                text: "Hey! Our school is overflowing with plastic bottles and styrofoam trays. What's our first green campaign?",
                choices: [
                    {
                        text: "Install reverse-vending recycling machines that give coupons.",
                        feedback: "Brilliant! Students eagerly collect bottles to earn coupons. Recycling rates double overnight!",
                        xp: 30, coins: 25, next: 1
                    },
                    {
                        text: "Ban all plastics on campus immediately by decree.",
                        feedback: "A sudden ban causes outrage and resistance because students have no immediate alternatives. Incentives work better!",
                        xp: 15, coins: 10, next: 1
                    }
                ]
            },
            {
                text: "We need alternatives for single-use plastic in the canteen. What should we supply?",
                choices: [
                    {
                        text: "Provide reusable metal cutlery and compostable paper plates.",
                        feedback: "Excellent choice! Reusables decrease trash volumes significantly. The canteen staff composts paper waste easily.",
                        xp: 30, coins: 20, next: "win"
                    },
                    {
                        text: "Use thicker, heavier plastic utensils that can be washed.",
                        feedback: "Heavier plastic still breaks and ends up in landfills. Compostable and metallic alternatives are much cleaner.",
                        xp: 15, coins: 10, next: "win"
                    }
                ]
            }
        ]
    },
    4: {
        title: "Protect Wildlife",
        character: {
            name: "Zoe (Wildlife Officer)",
            avatar: `<svg viewBox="0 0 100 100" width="100%"><circle cx="50" cy="40" r="25" fill="#c8e6c9"/><ellipse cx="50" cy="85" rx="35" ry="20" fill="#ffb74d"/><circle cx="43" cy="35" r="3" fill="black"/><circle cx="57" cy="35" r="3" fill="black"/><path d="M45,50 Q50,54 55,50" fill="none" stroke="black" stroke-width="2"/></svg>`
        },
        steps: [
            {
                text: "A highway cut through the animal reserve has resulted in frequent animal accidents. How can we ensure safe animal migration?",
                choices: [
                    {
                        text: "Build a vegetated overpass bridge (ecoduct) over the highway.",
                        feedback: "Superb! Animals walk across the green bridge without noticing the highway below. Vehicle collisions drop to zero!",
                        xp: 35, coins: 30, next: 1
                    },
                    {
                        text: "Put up high electric fences along the highway banks.",
                        feedback: "Fences trap animals in small areas, splitting their populations and gene pools. Green overpasses are much better.",
                        xp: 15, coins: 10, next: 1
                    }
                ]
            },
            {
                text: "Poaching traps have been reported inside the deep reserve. How do we patrol the vast territory?",
                choices: [
                    {
                        text: "Deploy drone thermal cameras and train local community guards.",
                        feedback: "Fantastic! Drones spot traps and poachers in hours, and community guards remove traps. Wildlife is safe once more!",
                        xp: 30, coins: 25, next: "win"
                    },
                    {
                        text: "Scatter bear traps to catch the poachers.",
                        feedback: "Absolutely not! Bear traps pose massive safety hazards to the wild animals we are trying to protect. Drones are much safer.",
                        xp: 5, coins: 0, next: "win"
                    }
                ]
            }
        ]
    },
    5: {
        title: "Build Green City",
        character: {
            name: "Archy (Urban Ecologist)",
            avatar: `<svg viewBox="0 0 100 100" width="100%"><circle cx="50" cy="40" r="25" fill="#d1c4e9"/><ellipse cx="50" cy="85" rx="35" ry="20" fill="#00e676"/><circle cx="43" cy="35" r="3" fill="black"/><circle cx="57" cy="35" r="3" fill="black"/><path d="M45,50 Q50,54 55,50" fill="none" stroke="black" stroke-width="2"/></svg>`
        },
        steps: [
            {
                text: "Our city generates electricity from a coal plant, resulting in high carbon output. How do we start our grid clean-up?",
                choices: [
                    {
                        text: "Subsidize solar panel installations for all domestic roofs.",
                        feedback: "Brilliant! Citizens generate solar power, feeding excess back into the city grid. Coal usage drops by 30%!",
                        xp: 30, coins: 25, next: 1
                    },
                    {
                        text: "Construct a massive offshore wind farm.",
                        feedback: "A massive clean energy boost! Wind farms provide reliable, high-yield electricity, cutting coal dependency immediately.",
                        xp: 35, coins: 30, next: 1
                    }
                ]
            },
            {
                text: "Concrete heat islands are causing urban temperatures to surge. How do we cool the streets?",
                choices: [
                    {
                        text: "Incorporate rooftop gardens and vertical green walls on buildings.",
                        feedback: "Spectacular! Green vegetation cools structures naturally, filters air toxins, and makes the city look futuristic and clean.",
                        xp: 35, coins: 30, next: "win"
                    },
                    {
                        text: "Install giant air conditioners on street lamp posts.",
                        feedback: "Inefficient and counterproductive! Air conditioners consume massive power and vent more heat outside. Green cover is the solution.",
                        xp: 10, coins: 5, next: "win"
                    }
                ]
            }
        ]
    }
};

let currentActiveLevel = 1;
let currentStoryStep = 0;
let storyTotalXp = 0;
let storyTotalCoins = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadStoryState();
});

function loadStoryState() {
    const savedLevel = localStorage.getItem('story_level_unlocked') || '1';
    currentActiveLevel = parseInt(savedLevel);
    
    // Disable locked nodes visually
    const nodes = document.querySelectorAll('.story-node');
    nodes.forEach(node => {
        const lvl = parseInt(node.getAttribute('data-level'));
        if (lvl <= currentActiveLevel) {
            node.classList.remove('locked');
            node.classList.add('unlocked');
            node.setAttribute('onclick', `startStory(${lvl})`);
        } else {
            node.classList.remove('unlocked');
            node.classList.add('locked');
            node.removeAttribute('onclick');
        }
    });
}

function startStory(levelId) {
    const story = STORY_DATA[levelId];
    if (!story) return;
    
    currentActiveLevel = levelId;
    currentStoryStep = 0;
    storyTotalXp = 0;
    storyTotalCoins = 0;
    
    document.getElementById('story-map-view').style.display = 'none';
    const dialogueView = document.getElementById('story-dialogue-view');
    dialogueView.style.display = 'block';
    
    renderStoryStep();
    playSFX('click');
}

function renderStoryStep() {
    const story = STORY_DATA[currentActiveLevel];
    const step = story.steps[currentStoryStep];
    
    // Character Avatar and Speaker
    document.getElementById('char-avatar-container').innerHTML = story.character.avatar;
    document.getElementById('dialogue-speaker-name').innerText = story.character.name;
    document.getElementById('dialogue-content-text').innerText = step.text;
    
    // Render Choices
    const choicesBox = document.getElementById('choices-container');
    choicesBox.innerHTML = '';
    
    step.choices.forEach((ch, idx) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = ch.text;
        btn.addEventListener('click', () => makeStoryChoice(ch));
        choicesBox.appendChild(btn);
    });
}

function makeStoryChoice(choice) {
    playSFX('click');
    storyTotalXp += choice.xp;
    storyTotalCoins += choice.coins;
    
    // Render feedback screen
    const choicesBox = document.getElementById('choices-container');
    choicesBox.innerHTML = '';
    
    document.getElementById('dialogue-content-text').innerHTML = `
        <strong>Action feedback:</strong><br>
        ${choice.feedback}<br><br>
        <span style="color: var(--accent-blue); font-weight:700;">+${choice.xp} XP | +${choice.coins} Coins</span>
    `;
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-primary';
    
    if (choice.next === "win") {
        nextBtn.innerText = "Finish Mission 🏆";
        nextBtn.addEventListener('click', finishStoryMission);
    } else {
        nextBtn.innerText = "Next Challenge &rarr;";
        nextBtn.addEventListener('click', () => {
            currentStoryStep = choice.next;
            renderStoryStep();
            playSFX('click');
        });
    }
    
    choicesBox.appendChild(nextBtn);
}

function finishStoryMission() {
    playSFX('levelUp');
    
    // Send completion API rewards
    fetch('/api/update_stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            xp_gain: storyTotalXp,
            coins_gain: storyTotalCoins
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.level_up) {
            showToast(`LEVEL UP! You reached Level ${data.new_level}! 🚀`, "success");
        }
    });
    
    // Unlock next level locally
    const nextLvl = currentActiveLevel + 1;
    if (nextLvl <= 5) {
        localStorage.setItem('story_level_unlocked', nextLvl.toString());
    }
    
    const choicesBox = document.getElementById('choices-container');
    choicesBox.innerHTML = '';
    
    document.getElementById('dialogue-content-text').innerHTML = `
        <h3 style="color: var(--accent-green); margin-bottom: 12px;">MISSION ACCOMPLISHED!</h3>
        Congratulations, you have completed the <strong>${STORY_DATA[currentActiveLevel].title}</strong> quest!<br><br>
        <strong>Total Quest Earnings:</strong><br>
        🌱 ${storyTotalXp} XP Points<br>
        🪙 ${storyTotalCoins} Eco Coins
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-secondary';
    closeBtn.innerText = "Return to Adventure Map";
    closeBtn.addEventListener('click', () => {
        document.getElementById('story-dialogue-view').style.display = 'none';
        document.getElementById('story-map-view').style.display = 'block';
        loadStoryState();
        playSFX('click');
    });
    
    choicesBox.appendChild(closeBtn);
}
