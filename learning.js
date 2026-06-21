/* ==========================================================================
   ECOQUEST LEARNING ZONE SYLLABUS & CONTROLLER
   ========================================================================== */

const MODULES_DATA = {
    "climate_change": {
        title: "Climate Change",
        icon: "🌍",
        slides: [
            {
                title: "What is Climate Change?",
                text: "Climate change refers to long-term shifts in temperatures and weather patterns. Since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil, and gas, which produces heat-trapping gases.",
                tip: "Burning fossil fuels releases greenhouse gases like carbon dioxide (CO2) which trap solar heat in the atmosphere.",
                svg: `<svg viewBox="0 0 200 200" width="100%"><circle cx="100" cy="100" r="60" fill="#00b0ff" opacity="0.2"/><circle cx="100" cy="100" r="50" fill="#00b0ff"/><path d="M70,100 Q100,70 130,100 T190,100" fill="none" stroke="#00e676" stroke-width="6"/><path d="M50,110 Q100,140 150,110" fill="none" stroke="#ff9100" stroke-width="4"/><circle cx="150" cy="60" r="15" fill="#ff9100"/></svg>`
            },
            {
                title: "The Greenhouse Effect",
                text: "Think of the Earth as a greenhouse. Solar radiation passes through the clear atmosphere and warms the Earth. Greenhouse gases (CO2, Methane, Nitrous Oxide) trap some of this heat, keeping the planet warm enough for life. However, burning fossil fuels adds too many gases, causing global warming.",
                tip: "Forests and oceans act as 'carbon sinks', absorbing massive amounts of CO2 from the atmosphere.",
                svg: `<svg viewBox="0 0 200 200" width="100%"><rect x="50" y="70" width="100" height="80" rx="10" fill="none" stroke="#00e676" stroke-width="4"/><line x1="50" y1="110" x2="150" y2="110" stroke="rgba(255,255,255,0.15)" stroke-width="2"/><path d="M30,50 L70,50 M50,30 L50,70" stroke="#ff9100" stroke-width="4"/><path d="M100,80 Q105,95 100,110 T100,140" fill="none" stroke="#ff1744" stroke-width="3"/></svg>`
            },
            {
                title: "Consequences & Action",
                text: "Global warming leads to melting glaciers, rising sea levels, severe droughts, and extreme weather events. To prevent catastrophic warming, we must shift our energy systems to clean, renewable sources and adopt sustainable consumption habits.",
                tip: "Planting trees is one of the easiest ways to fight climate change. A single tree can absorb up to 22kg of CO2 per year!",
                svg: `<svg viewBox="0 0 200 200" width="100%"><path d="M20,150 Q100,110 180,150 L180,180 L20,180 Z" fill="#00e676"/><rect x="90" y="80" width="20" height="70" fill="#a1887f"/><circle cx="100" cy="80" r="35" fill="#00c853" opacity="0.9"/></svg>`
            }
        ],
        quiz: [
            {
                question: "What is the primary driver of modern climate change?",
                options: [
                    "Volcanic eruptions",
                    "Burning fossil fuels",
                    "Changes in solar intensity",
                    "Earth's orbital alignment"
                ],
                answer: 1
            },
            {
                question: "Which gas is considered a major greenhouse gas?",
                options: [
                    "Oxygen",
                    "Hydrogen",
                    "Carbon Dioxide",
                    "Nitrogen"
                ],
                answer: 2
            }
        ]
    },
    "air_pollution": {
        title: "Air Pollution",
        icon: "💨",
        slides: [
            {
                title: "What is Air Pollution?",
                text: "Air pollution is the contamination of the indoor or outdoor environment by any chemical, physical, or biological agent that modifies the natural characteristics of the atmosphere. Common sources include motor vehicles, industrial facilities, and forest fires.",
                tip: "Fine particulate matter (PM2.5) can penetrate deep into lungs and enter the bloodstream, causing serious health issues.",
                svg: `<svg viewBox="0 0 200 200" width="100%"><rect x="40" y="110" width="50" height="60" fill="#546e7a"/><rect x="50" y="50" width="15" height="60" fill="#37474f"/><path d="M50,40 Q57,20 70,30 T90,15" fill="none" stroke="#78909c" stroke-width="8"/><circle cx="130" cy="120" r="10" fill="#ff1744" opacity="0.3"/><circle cx="150" cy="110" r="6" fill="#ff1744" opacity="0.3"/></svg>`
            },
            {
                title: "Smog & Acid Rain",
                text: "When pollutants like nitrogen oxides and sulfur dioxide mix with water droplets and sunlight, they create smog (which reduces visibility and hurts respiratory tracts) and acid rain (which damages aquatic life, soil nutrients, and architectural structures).",
                tip: "Improving fuel standards and using public transit reduces smog-forming chemicals.",
                svg: `<svg viewBox="0 0 200 200" width="100%"><circle cx="100" cy="60" r="30" fill="#90a4ae" opacity="0.5"/><path d="M100,90 L90,110 M110,95 L100,115" stroke="#00b0ff" stroke-width="3"/><path d="M70,120 Q100,100 130,120" fill="none" stroke="#00e676" stroke-width="4"/></svg>`
            }
        ],
        quiz: [
            {
                question: "What does 'PM2.5' refer to in air quality?",
                options: [
                    "Particulate matter smaller than 2.5 micrometers",
                    "Pollution index rating of 2.5",
                    "Pressure measurement of air molecules",
                    "Concentration of carbon monoxide in parts per million"
                ],
                answer: 0
            }
        ]
    },
    "water_pollution": {
        title: "Water Pollution",
        icon: "💧",
        slides: [
            {
                title: "Oceans & Freshwater At Risk",
                text: "Water pollution occurs when harmful substances—often chemicals or microorganisms—contaminate a stream, river, lake, ocean, or aquifer, degrading water quality and rendering it toxic to humans or the environment.",
                tip: "80% of marine pollution originates on land, primarily through agricultural runoff and plastic dumping.",
                svg: `<svg viewBox="0 0 200 200" width="100%"><path d="M10,130 Q50,110 100,130 T190,130 L190,180 L10,180 Z" fill="#00b0ff"/><path d="M80,100 L90,80 L110,90 L120,60" fill="none" stroke="#ff1744" stroke-width="3"/><rect x="100" y="115" width="20" height="20" rx="4" fill="#a1887f"/></svg>`
            }
        ],
        quiz: [
            {
                question: "What is the primary source of marine plastic pollution?",
                options: [
                    "Commercial cruise ships",
                    "Land-based activities and runoff",
                    "Deep-sea mineral drilling",
                    "Natural oil seeps"
                ],
                answer: 1
            }
        ]
    },
    "waste_management": {
        title: "Waste Management",
        icon: "♻️",
        slides: [
            {
                title: "The 3 R's: Reduce, Reuse, Recycle",
                text: "Solid waste takes up massive landfill space and leaks chemicals into groundwater. By applying the 3 R's, we cut waste. REDUCE packaging, REUSE containers, and RECYCLE materials like glass, metal, cardboard, and paper.",
                tip: "Always clean food residue off paperboard and plastics before throwing them into recycling bins!",
                svg: `<svg viewBox="0 0 200 200" width="100%"><path d="M100,30 L130,70 L70,70 Z" fill="#00e676"/><path d="M70,140 L100,100 L130,140 Z" fill="#00b0ff"/><circle cx="100" cy="90" r="20" fill="none" stroke="white" stroke-width="4"/></svg>`
            }
        ],
        quiz: [
            {
                question: "Which of the 3 R's is the most effective at conserving resources?",
                options: [
                    "Recycle",
                    "Reduce",
                    "Reuse",
                    "Recreate"
                ],
                answer: 1
            }
        ]
    },
    "renewable_energy": {
        title: "Renewable Energy",
        icon: "⚡",
        slides: [
            {
                title: "Green Energy Solutions",
                text: "Renewable energy is energy collected from renewable resources that are naturally replenished on a human timescale, such as sunlight, wind, rain, tides, waves, and geothermal heat.",
                tip: "Solar solar panels convert sunlight directly into electricity with zero operational carbon footprint.",
                svg: `<svg viewBox="0 0 200 200" width="100%"><circle cx="100" cy="100" r="40" fill="#ff9100"/><rect x="80" y="80" width="40" height="40" rx="8" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2"/><line x1="100" y1="30" x2="100" y2="70" stroke="#ff9100" stroke-width="4"/></svg>`
            }
        ],
        quiz: [
            {
                question: "Which energy source is infinite and does not emit carbon during operation?",
                options: [
                    "Natural Gas",
                    "Nuclear Fission",
                    "Solar Power",
                    "Coal Combustion"
                ],
                answer: 2
            }
        ]
    },
    "biodiversity": {
        title: "Biodiversity",
        icon: "🐝",
        slides: [
            {
                title: "The Web of Life",
                text: "Biodiversity is the biological variety and variability of life on Earth. A rich biodiversity provides vital ecosystem services, including pollination, soil fertility, food supply, and natural water purification systems.",
                tip: "Pollinators like bees are responsible for 1 in every 3 bites of food we eat!",
                svg: `<svg viewBox="0 0 200 200" width="100%"><circle cx="100" cy="100" r="50" fill="#81c784" opacity="0.3"/><circle cx="85" cy="90" r="10" fill="#ffd700"/><ellipse cx="110" cy="90" rx="15" ry="10" fill="#ffd700"/><line x1="110" y1="80" x2="110" y2="100" stroke="black" stroke-width="3"/></svg>`
            }
        ],
        quiz: [
            {
                question: "What ecosystem role do bees perform that is vital to agriculture?",
                options: [
                    "Carbon sequestration",
                    "Pest elimination",
                    "Crop pollination",
                    "Soil aeration"
                ],
                answer: 2
            }
        ]
    },
    "deforestation": {
        title: "Deforestation",
        icon: "🌳",
        slides: [
            {
                title: "Saving the Earth's Lungs",
                text: "Deforestation is the purposeful clearing of forested land. Throughout history and into modern times, forests have been razed to make space for agriculture and animal grazing, and to obtain wood for fuel, manufacturing, and construction.",
                tip: "Tropical rainforests cover only 6% of the Earth's land surface but house over half of all animal and plant species.",
                svg: `<svg viewBox="0 0 200 200" width="100%"><rect x="75" y="110" width="15" height="50" fill="#a1887f"/><path d="M50,110 L110,110 L80,50 Z" fill="#ef5350"/><circle cx="150" cy="80" r="25" fill="#4caf50"/></svg>`
            }
        ],
        quiz: [
            {
                question: "Why does clearing forests accelerate global warming?",
                options: [
                    "It stops carbon absorption and releases stored carbon",
                    "It directly cools the earth's mantle",
                    "It increases cloud cover reflections",
                    "It stops oxygen generation which warms the troposphere"
                ],
                answer: 0
            }
        ]
    },
    "sustainable_living": {
        title: "Sustainable Living",
        icon: "🏡",
        slides: [
            {
                title: "Eco-Friendly Habits",
                text: "Sustainable living describes a lifestyle that attempts to reduce an individual's or society's use of the Earth's natural resources. It involves choosing eco-friendly transit, buying local foods, reducing waste, and saving domestic energy.",
                tip: "Unplugging vampire electronics when not in use can shave up to 10% off your household energy bill!",
                svg: `<svg viewBox="0 0 200 200" width="100%"><rect x="60" y="100" width="80" height="60" rx="5" fill="none" stroke="#00e676" stroke-width="4"/><polygon points="50,100 100,60 150,100" fill="none" stroke="#00b0ff" stroke-dasharray="none" stroke-width="4"/><circle cx="100" cy="125" r="10" fill="#ff9100"/></svg>`
            }
        ],
        quiz: [
            {
                question: "What is a simple habit to reduce domestic electrical load?",
                options: [
                    "Leaving the television on standby 24/7",
                    "Running half-empty dishwasher cycles",
                    "Unplugging electronics when fully charged",
                    "Using incandescent bulbs instead of LEDs"
                ],
                answer: 2
            }
        ]
    }
};

let currentModuleId = null;
let currentSlideIndex = 0;
let quizScore = 0;
let activeQuizQuestions = [];
let currentQuizQuestionIndex = 0;

function openLesson(moduleId) {
    const data = MODULES_DATA[moduleId];
    if (!data) return;
    
    currentModuleId = moduleId;
    currentSlideIndex = 0;
    quizScore = 0;
    
    document.getElementById('modules-view').style.display = 'none';
    const viewer = document.getElementById('lesson-viewer-view');
    viewer.style.display = 'block';
    
    renderSlide();
    playSFX('click');
}

function closeLesson() {
    document.getElementById('lesson-viewer-view').style.display = 'none';
    document.getElementById('modules-view').style.display = 'block';
    currentModuleId = null;
    playSFX('click');
}

function renderSlide() {
    const mod = MODULES_DATA[currentModuleId];
    const totalSlides = mod.slides.length;
    
    // Progress
    const pct = ((currentSlideIndex) / (totalSlides)) * 100;
    document.getElementById('lesson-progress').style.width = `${pct}%`;
    
    const slide = mod.slides[currentSlideIndex];
    
    const container = document.getElementById('slide-container');
    container.innerHTML = `
        <div class="lesson-illustration">
            ${slide.svg}
        </div>
        <div class="lesson-content">
            <h2>${slide.title}</h2>
            <p>${slide.text}</p>
            <div class="tip-box">
                <svg viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-3.3l-.85-.6C8.89 11.3 8 10.24 8 9c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.24-.89 2.3-2.15 3.1z"/></svg>
                <p><strong>Eco Tip:</strong> ${slide.tip}</p>
            </div>
        </div>
    `;
    
    // Toggle nav buttons
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    
    if (currentSlideIndex === 0) {
        prevBtn.style.visibility = 'hidden';
    } else {
        prevBtn.style.visibility = 'visible';
    }
    
    if (currentSlideIndex === totalSlides - 1) {
        nextBtn.innerHTML = `Start Quiz Arena ⚡`;
    } else {
        nextBtn.innerHTML = `Next Slide &rarr;`;
    }
}

function nextSlide() {
    const mod = MODULES_DATA[currentModuleId];
    if (currentSlideIndex < mod.slides.length - 1) {
        currentSlideIndex++;
        renderSlide();
        playSFX('click');
    } else {
        // Start Quiz!
        startLessonQuiz();
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide();
        playSFX('click');
    }
}

function startLessonQuiz() {
    activeQuizQuestions = MODULES_DATA[currentModuleId].quiz;
    currentQuizQuestionIndex = 0;
    quizScore = 0;
    
    // Update progress bar to 100%
    document.getElementById('lesson-progress').style.width = `100%`;
    
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = activeQuizQuestions[currentQuizQuestionIndex];
    const container = document.getElementById('slide-container');
    
    let optionsHtml = '';
    q.options.forEach((opt, idx) => {
        optionsHtml += `
            <button class="option-btn" onclick="submitQuizAnswer(${idx})">
                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                <span>${opt}</span>
            </button>
        `;
    });
    
    container.innerHTML = `
        <div class="lesson-content">
            <h4 style="color: var(--accent-blue); margin-bottom: 10px; font-weight:700;">QUIZ ARENA - Question ${currentQuizQuestionIndex + 1} of ${activeQuizQuestions.length}</h4>
            <h2 style="margin-bottom: 25px;">${q.question}</h2>
            <div class="quiz-options-grid">
                ${optionsHtml}
            </div>
        </div>
    `;
    
    // Hide slide standard navigators
    document.getElementById('prev-slide-btn').style.visibility = 'hidden';
    document.getElementById('next-slide-btn').style.visibility = 'hidden';
}

function submitQuizAnswer(selectedIndex) {
    const q = activeQuizQuestions[currentQuizQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    
    // Disable all options
    options.forEach(opt => opt.removeAttribute('onclick'));
    
    if (selectedIndex === q.answer) {
        options[selectedIndex].classList.add('correct');
        quizScore++;
        playSFX('success');
        showToast("Correct Answer!", "success");
    } else {
        options[selectedIndex].classList.add('wrong');
        options[q.answer].classList.add('correct'); // Show correct one
        playSFX('error');
        showToast("Incorrect Answer!", "error");
    }
    
    // Next question delay
    setTimeout(() => {
        if (currentQuizQuestionIndex < activeQuizQuestions.length - 1) {
            currentQuizQuestionIndex++;
            renderQuizQuestion();
        } else {
            finishLesson();
        }
    }, 1500);
}

function finishLesson() {
    const container = document.getElementById('slide-container');
    const passes = quizScore === activeQuizQuestions.length; // Needs 100% or passing
    
    if (passes) {
        // Send completion API
        fetch('/api/complete_lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module_id: currentModuleId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.rewarded) {
                playSFX('levelUp');
                showToast(`Module Cleared! +${data.xp_gained} XP, +${data.coins_gained} Coins!`, "success");
                if (data.level_up) {
                    showToast(`LEVEL UP! You reached Level ${data.new_level}! 🚀`, "success");
                }
            } else {
                playSFX('success');
            }
        });
        
        container.innerHTML = `
            <div class="lesson-content" style="text-align: center; padding: 40px 10px;">
                <span style="font-size: 4rem;">🏆</span>
                <h2 style="margin: 20px 0 10px 0;">Module Mastered!</h2>
                <p style="color: var(--text-secondary); max-width:500px; margin: 0 auto 30px auto;">
                    You answered all questions correctly in the <strong>${MODULES_DATA[currentModuleId].title}</strong> module.
                </p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn-primary" onclick="generateModuleCertificate('${currentModuleId}')">Download Certificate 🎓</button>
                    <button class="btn-secondary" onclick="closeLesson()">Back to Syllabus</button>
                </div>
            </div>
        `;
    } else {
        playSFX('error');
        container.innerHTML = `
            <div class="lesson-content" style="text-align: center; padding: 40px 10px;">
                <span style="font-size: 4rem;">❌</span>
                <h2 style="margin: 20px 0 10px 0;">Quiz Incomplete</h2>
                <p style="color: var(--text-secondary); max-width:500px; margin: 0 auto 30px auto;">
                    You scored ${quizScore}/${activeQuizQuestions.length}. To master this module and earn rewards, you must answer all questions correctly!
                </p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn-primary" onclick="startLessonQuiz()">Try Quiz Again ⚡</button>
                    <button class="btn-secondary" onclick="closeLesson()">Back to Syllabus</button>
                </div>
            </div>
        `;
    }
}

// Certificate generating flow
function generateModuleCertificate(moduleId) {
    // Redirect to achievements page with query param
    window.location.href = `/achievements?cert=${moduleId}`;
}
