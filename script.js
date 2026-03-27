let state = {
    age: 0,
    hunger: 100,
    clean: 100,
    energy: 100,
    happy: 100,
    money: 50, // Start with some money
    isSleeping: false,
    lastTick: Date.now()
};

const phrases = {
    hungry: ["배고파요!", "밥 주세요!", "꼬르륵..."],
    dirty: ["더러워요...", "씻고 싶어요", "냄새나는 것 같아요"],
    tired: ["졸려요...", "피곤해요", "눈이 감겨요.."],
    sad: ["심심해요...", "우울해요", "놀아주세요"],
    happy: ["기분 최고예요!", "꿀꿀!", "행복해요~"],
    work: ["열심히 일하는 중!", "돈 벌자!", "아자아자!"],
    sleep: ["Zzz...", "드르렁...", "음냐음냐..."],
    eat: ["냠냠 맛있다!", "최고의 식사!", "배부르다~"]
};

let speechTimeout = null;

let charContainer, pigWrapper, pigBody, eyeLeft, eyeRight, mouth, speechBubble;
let ageEl, moneyEl, shopMoneyEl, stageLabel, statusText, effectLayer, overlay, shopModal;

function init() {
    // Determine DOM elements after load
    charContainer = document.getElementById('character-container');
    pigWrapper = document.getElementById('pig-wrapper');
    pigBody = document.getElementById('pig-body');
    eyeLeft = document.getElementById('eye-left');
    eyeRight = document.getElementById('eye-right');
    mouth = document.getElementById('mouth');
    speechBubble = document.getElementById('speech-bubble');
    
    ageEl = document.getElementById('age');
    moneyEl = document.getElementById('money');
    shopMoneyEl = document.getElementById('shop-money');
    stageLabel = document.getElementById('stage-label');
    statusText = document.getElementById('status-text');
    effectLayer = document.getElementById('effect-layer');
    overlay = document.getElementById('overlay');
    shopModal = document.getElementById('shop-modal');

    updateUI();
    randomSpeechLoop();
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (state.hunger <= 0 || state.clean <= 0) {
        gameOver();
        return;
    }

    const now = Date.now();
    const delta = (now - state.lastTick) / 1000;
    state.lastTick = now;

    if (!state.isSleeping) {
        state.hunger = Math.max(0, state.hunger - 0.5 * delta);
        state.clean = Math.max(0, state.clean - 0.3 * delta);
        state.energy = Math.max(0, state.energy - 0.4 * delta);
        state.happy = Math.max(0, state.happy - 0.2 * delta);
    } else {
        state.energy = Math.min(100, state.energy + 2 * delta);
        state.hunger = Math.max(0, state.hunger - 0.2 * delta);
        state.clean = Math.max(0, state.clean - 0.1 * delta);
        if (state.energy >= 100) interact('sleep'); // wake up automatically
        
        // Keep showing Zzz particles occasionally while sleeping
        if (Math.random() < 0.05) showEffect('💤');
    }

    const oldAge = state.age;
    state.age += (1/30) * delta;
    
    if (Math.floor(state.age) > Math.floor(oldAge)) {
        showEffect('🎂');
        if (Math.floor(state.age) === 21) {
            winGame();
        }
    }

    updateUI();
    requestAnimationFrame(gameLoop);
}

function updateUI() {
    updateBar('hunger', state.hunger);
    updateBar('clean', state.clean);
    updateBar('energy', state.energy);
    updateBar('happy', state.happy);

    ageEl.innerText = Math.floor(state.age);
    moneyEl.innerText = state.money;
    shopMoneyEl.innerText = `${state.money}원`;

    let label = "아기 돼지";
    let scale = 1;

    const ageInt = Math.floor(state.age);
    if (ageInt >= 5 && ageInt < 13) {
        label = "어린이 돼지";
        scale = 1.1;
    } else if (ageInt >= 13 && ageInt < 20) {
        label = "청소년 돼지";
        scale = 1.25;
    } else if (ageInt >= 20) {
        label = "성인 임현교";
        scale = 1.4;
    }
    charContainer.style.transform = `scale(${scale})`;
    stageLabel.innerText = label;

    // Stats to visual translation
    // 1. Hunger -> Body Width (100% hunger = 1 scaleX, 0% = 0.5 scaleX)
    const bodyScale = 0.5 + (state.hunger / 100) * 0.5;
    pigBody.style.transform = `scaleX(${bodyScale})`;

    // 2. Cleanliness -> Dirty Filter
    pigWrapper.className = 'pig-wrapper cursor-pointer focus:outline-none'; // Reset
    if (state.clean < 25) {
        pigWrapper.classList.add('very-dirty-filter');
    } else if (state.clean < 50) {
        pigWrapper.classList.add('dirty-filter');
    }

    // 3. Energy -> Eyes
    eyeLeft.className = 'eye';
    eyeRight.className = 'eye';
    if (state.isSleeping) {
        eyeLeft.classList.add('eye-sleep');
        eyeRight.classList.add('eye-sleep');
    } else if (state.energy < 30) {
        eyeLeft.classList.add('eye-tired');
        eyeRight.classList.add('eye-tired');
    }

    // 4. Happy -> Mouth
    mouth.className = 'mouth';
    if (!state.isSleeping && (state.happy < 30 || state.hunger < 30 || state.clean < 30)) {
        mouth.classList.add('mouth-sad');
    }

    // Status text
    if (state.isSleeping) {
        statusText.innerText = "Zzz...";
    } else if (state.hunger < 20) {
        statusText.innerText = "너무 배고파요...";
    } else if (state.energy < 20) {
        statusText.innerText = "에너지가 없어요...";
    } else if (state.clean < 20) {
        statusText.innerText = "꼬질꼬질해요...";
    } else if (state.happy < 20) {
        statusText.innerText = "우울해요...";
    } else {
        statusText.innerText = "기분이 좋아요!";
    }
}

function say(message, duration = 2000) {
    if (speechTimeout) clearTimeout(speechTimeout);
    speechBubble.innerText = message;
    speechBubble.style.opacity = '1';
    speechTimeout = setTimeout(() => {
        speechBubble.style.opacity = '0';
    }, duration);
}

function randomSpeechLoop() {
    if (Math.random() < 0.4 && !state.isSleeping) {
        let category = 'happy';
        if (state.hunger < 30) category = 'hungry';
        else if (state.clean < 30) category = 'dirty';
        else if (state.energy < 30) category = 'tired';
        else if (state.happy < 30) category = 'sad';

        const choices = phrases[category];
        say(choices[Math.floor(Math.random() * choices.length)]);
    }
    setTimeout(randomSpeechLoop, 4000 + Math.random() * 4000); // 4-8 seconds
}

function interact(type) {
    if (state.isSleeping && type !== 'sleep') {
        showEffect('🤫');
        say("쉿! 자고있어요.");
        return;
    }

    triggerBounce();

    switch(type) {
        case 'wash':
            state.clean = Math.min(100, state.clean + 40);
            showEffect('🫧');
            say("상쾌해요!");
            break;
        case 'sleep':
            state.isSleeping = !state.isSleeping;
            if (state.isSleeping) {
                document.getElementById('body-bg').classList.add('sleep-bg');
                document.getElementById('game-container').classList.add('sleep-opacity');
                showEffect('🌙');
                say("안녕히 주무세요...", 3000);
            } else {
                document.getElementById('body-bg').classList.remove('sleep-bg');
                document.getElementById('game-container').classList.remove('sleep-opacity');
                showEffect('☀️');
                say("잘 잤다!");
            }
            break;
        case 'play':
            if (state.energy < 20) {
                showEffect('🥱');
                say("힘들어서 못 놀겠어요...");
                return;
            }
            state.happy = Math.min(100, state.happy + 25);
            state.energy = Math.max(0, state.energy - 20);
            state.clean = Math.max(0, state.clean - 10);
            showEffect('⚽');
            say("우와 재밌다!");
            break;
        case 'work':
            if (state.energy < 30) {
                showEffect('🥱');
                say("너무 피곤해요...");
                return;
            }
            state.energy = Math.max(0, state.energy - 30);
            state.happy = Math.max(0, state.happy - 15);
            state.clean = Math.max(0, state.clean - 10);
            
            // Earn money Action (10 ~ 20)
            const earned = 10 + Math.floor(Math.random() * 11);
            
            // Simple working task minigame simulation (just gives money)
            let clickCount = 0;
            const maxClicks = 5;
            const workOverlay = document.createElement('div');
            workOverlay.className = 'fixed inset-0 modal z-50 flex items-center justify-center';
            workOverlay.innerHTML = `
                <div class="bg-white p-6 rounded-3xl w-64 text-center cursor-pointer select-none" id="work-btn">
                    <div class="text-4xl mb-4">⛏️</div>
                    <h3 class="font-bold text-lg mb-2 text-green-600">열심히 일하는 중...</h3>
                    <p class="text-sm text-gray-500 mb-4">광클해서 일을 끝내세요! (<span id="clicks-left">${maxClicks}</span>)</p>
                    <div class="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                        <div id="work-bar" class="status-bar h-full bg-green-500 w-0"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(workOverlay);
            
            const workBtn = document.getElementById('work-btn');
            const clicksLeft = document.getElementById('clicks-left');
            const workBar = document.getElementById('work-bar');
            
            workBtn.onclick = () => {
                clickCount++;
                clicksLeft.innerText = maxClicks - clickCount;
                workBar.style.width = `${(clickCount / maxClicks) * 100}%`;
                
                // Shake effect
                workBtn.style.transform = `scale(${1 - clickCount*0.02}) rotate(${(Math.random()-0.5)*10}deg)`;
                setTimeout(() => workBtn.style.transform = 'scale(1) rotate(0deg)', 50);

                if (clickCount >= maxClicks) {
                    workOverlay.remove();
                    state.money += earned;
                    showEffect('💰');
                    say(`일해서 ${earned}원을 벌었어요!`);
                    updateUI();
                }
            };
            return; // exit early, handled by minigame
            break;
    }
    updateUI();
}

function triggerBounce() {
    pigWrapper.classList.remove('bounce');
    void pigWrapper.offsetWidth; 
    pigWrapper.classList.add('bounce');
}

function openShop() {
    if (state.isSleeping) {
        showEffect('🤫');
        say("자는 중...");
        return;
    }
    updateUI(); // update shop money
    shopModal.classList.remove('hidden');
}

function closeShop() {
    shopModal.classList.add('hidden');
}

function buyFood(foodType) {
    let cost = 0;
    let hungerRestore = 0;
    let happyRestore = 0;
    let emoji = '';

    switch(foodType) {
        case 'apple': cost = 10; hungerRestore = 20; happyRestore = 5; emoji = '🍎'; break;
        case 'burger': cost = 30; hungerRestore = 50; happyRestore = 10; emoji = '🍔'; break;
        case 'steak': cost = 50; hungerRestore = 100; happyRestore = 30; emoji = '🥩'; break;
    }

    if (state.money < cost) {
        say("돈이 모자라요!");
        triggerBounce();
        return;
    }

    state.money -= cost;
    state.hunger = Math.min(100, state.hunger + hungerRestore);
    state.happy = Math.min(100, state.happy + happyRestore);
    
    showEffect(emoji);
    
    const choices = phrases['eat'];
    say(choices[Math.floor(Math.random() * choices.length)]);
    closeShop();
    updateUI();
}

function pokeCharacter() {
    if (!state.isSleeping) {
        triggerBounce();
        say(["왜요!", "간지러워요!", "꿀꿀!"][Math.floor(Math.random()*3)]);
        state.happy = Math.min(100, state.happy + 2);
        updateUI();
    }
}

function updateBar(id, val) {
    document.getElementById(`${id}-bar`).style.width = `${val}%`;
    document.getElementById(`${id}-val`).innerText = `${Math.round(val)}%`;
}

function showEffect(emoji) {
    const el = document.createElement('div');
    el.innerText = emoji;
    el.className = 'effect-particle text-3xl font-normal tracking-normal';
    const randomX = (Math.random() - 0.5) * 80;
    el.style.left = `calc(50% + ${randomX}px)`;
    el.style.bottom = '120px'; 
    effectLayer.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function gameOver() {
    document.getElementById('overlay-title').innerText = '게임 오버';
    document.getElementById('overlay-desc').innerText = `임현교가 ${Math.floor(state.age)}살에 하늘나라로 갔어요...\n남은 재산: ${state.money}원\n\n지저분하면 병에 걸리고, 배고프면 굶습니다.`;
    overlay.classList.remove('hidden');
}

function winGame() {
    document.getElementById('overlay-icon').innerText = '👑';
    document.getElementById('overlay-title').innerText = '축하합니다!';
    document.getElementById('overlay-desc').innerText = `임현교를 21살 성인까지 훌륭하게 키워내셨군요!\n모은 자산: ${state.money}원\n\n정말 대단합니다!🥳`;
    overlay.classList.remove('hidden');
}

function resetGame() {
    state = {
        age: 0,
        hunger: 100,
        clean: 100,
        energy: 100,
        happy: 100,
        money: 50,
        isSleeping: false,
        lastTick: Date.now()
    };
    overlay.classList.add('hidden');
    shopModal.classList.add('hidden');
    document.getElementById('body-bg').classList.remove('sleep-bg');
    document.getElementById('game-container').classList.remove('sleep-opacity');
    updateUI();
}

window.onload = init;
