/* ==========================================================================
   ECOQUEST CARBON FOOTPRINT CALCULATOR
   ========================================================================== */

let activeStep = 1;

document.addEventListener('DOMContentLoaded', () => {
    initSliders();
});

function initSliders() {
    // Add real-time slider value counters
    const sliders = document.querySelectorAll('.calculator-slider');
    sliders.forEach(slider => {
        const valBox = document.getElementById(slider.id + '-val');
        if (valBox) {
            valBox.innerText = slider.value;
            slider.addEventListener('input', () => {
                valBox.innerText = slider.value;
            });
        }
    });
}

function setStep(stepNum) {
    if (stepNum < 1 || stepNum > 4) return;
    
    // Hide all steps
    document.querySelectorAll('.calculator-step-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
    
    // Show active step
    document.getElementById(`step-${stepNum}`).classList.add('active');
    document.getElementById(`wizard-step-${stepNum}`).classList.add('active');
    
    // Complete previous steps visually
    for (let s = 1; s < stepNum; s++) {
        document.getElementById(`wizard-step-${s}`).classList.add('completed');
    }
    for (let s = stepNum; s <= 4; s++) {
        document.getElementById(`wizard-step-${s}`).classList.remove('completed');
    }
    
    activeStep = stepNum;
    playSFX('click');
}

function calculateFootprint() {
    // 1. Gather Inputs
    const kmDriven = parseFloat(document.getElementById('km-driven').value || '0');
    const flights = parseFloat(document.getElementById('flights').value || '0');
    const transit = parseFloat(document.getElementById('transit').value || '0');
    
    const electricity = parseFloat(document.getElementById('electricity').value || '0');
    const gas = parseFloat(document.getElementById('gas').value || '0');
    
    const diet = document.getElementById('diet-type').value;
    const wasteBags = parseFloat(document.getElementById('waste-bags').value || '0');
    const recycling = document.getElementById('recycling-habit').checked;
    
    // 2. Perform math calculations (in metric tons CO2 / year)
    // Car: ~180g CO2 per km
    const carCo2 = kmDriven * 0.00018; 
    
    // Flight: ~900kg CO2 per flight
    const flightCo2 = flights * 0.9; 
    
    // Transit: public transit is cleaner (~40g/km), let's say 0.03 tons CO2 per hour of weekly use
    const transitCo2 = transit * 52 * 0.0015; 
    
    // Electricity: ~0.4 kg CO2 per kWh
    const electCo2 = electricity * 12 * 0.0004; 
    
    // Gas: ~5 kg CO2 per therm/unit
    const gasCo2 = gas * 12 * 0.005; 
    
    // Diet factors:
    let dietCo2 = 1.8; // default moderate meat
    if (diet === 'heavy_meat') dietCo2 = 3.0;
    if (diet === 'vegetarian') dietCo2 = 0.8;
    if (diet === 'vegan') dietCo2 = 0.5;
    
    // Waste: each bag approx 0.015 tons CO2 per year
    let wasteCo2 = wasteBags * 52 * 0.002;
    if (recycling) {
        wasteCo2 = Math.max(0, wasteCo2 - 0.4); // Recycling credit
    }
    
    // Sum
    const totalFootprint = (carCo2 + flightCo2 + transitCo2 + electCo2 + gasCo2 + dietCo2 + wasteCo2).toFixed(1);
    
    // Display results
    renderResults(parseFloat(totalFootprint));
    setStep(4);
    
    // Award standard XP/Coins for calculating footprint
    fetch('/api/update_stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp_gain: 25, coins_gain: 15 })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast("Calculated Carbon Footprint! +25 XP, +15 Coins.", "success");
        }
    });
}

function renderResults(score) {
    const scoreVal = document.getElementById('carbon-result-score');
    const badgeEl = document.getElementById('carbon-result-badge');
    const suggestionsEl = document.getElementById('carbon-result-suggestions');
    
    scoreVal.innerText = `${score} Tons`;
    
    let levelClass = '';
    let rating = '';
    let suggestions = [];
    
    if (score < 2.0) {
        levelClass = 'status-badge xp';
        rating = 'Earth Protector (Excellent) 🌱';
        suggestions = [
            "Outstanding job! Your carbon footprint is below the global target of 2.0 tons. Keep advocating!",
            "Consider organizing local school campaigns to share your low-impact lifestyle habits.",
            "Water your plants in the Virtual Garden to offset the tiny footprint you have remaining."
        ];
    } else if (score < 4.5) {
        levelClass = 'status-badge coins';
        rating = 'Sustainable Advocate (Good) 👍';
        suggestions = [
            "Good effort! You are matching the average global footprint, but we can do better.",
            "Try cutting down on beef or dairy consumption by participating in 'Meatless Mondays'.",
            "Unplug power strips and chargers to eliminate standby energy draw in your household."
        ];
    } else {
        levelClass = 'status-badge streak';
        rating = 'Heavy Impact (Action Needed) ⚠️';
        suggestions = [
            "Your footprint is higher than sustainable limits. Small adjustments can make a massive difference!",
            "Walk, cycle, or use public transit instead of driving for short local errands.",
            "Switch to LED energy-efficient bulbs to reduce your domestic power usage by up to 80%."
        ];
    }
    
    badgeEl.className = levelClass;
    badgeEl.innerText = rating;
    
    let suggestionsHtml = '';
    suggestions.forEach(s => {
        suggestionsHtml += `<li>${s}</li>`;
    });
    suggestionsEl.innerHTML = suggestionsHtml;
}
