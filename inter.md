<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>임현교 키우기 - 돼지 다마고치</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
        
        body {
            font-family: 'Jua', sans-serif;
            background-color: #fce4ec;
            user-select: none;
            touch-action: manipulation;
        }

        .status-bar { transition: width 0.5s ease-in-out; }

        /* Character styling */
        #character-container {
            transition: transform 0.5s ease;
            position: relative;
        }

        .pig-wrapper {
            transition: filter 0.5s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .pig-head {
            width: 100px;
            height: 90px;
            background-color: #fbcfe8; /* pink-200 */
            border-radius: 50% 50% 40% 40%;
            border: 4px solid #f9a8d4; /* pink-300 */
            position: relative;
            z-index: 10;
        }

        /* Ears */
        .ear {
            position: absolute;
            top: -10px;
            width: 30px;
            height: 40px;
            background-color: #fbcfe8;
            border: 4px solid #f9a8d4;
            border-radius: 50% 50% 10% 10%;
            z-index: -1;
        }
        .ear.left { left: 0px; transform: rotate(-30deg); }
        .ear.right { right: 0px; transform: rotate(30deg); }

        /* Snout */
        .snout {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 30px;
            background-color: #f9a8d4;
            border-radius: 40%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border: 2px solid #f472b6;
        }
        .nostril { width: 6px; height: 10px; background-color: #ec4899; border-radius: 50%; }

        /* Eyes */
        .eyes {
            position: absolute;
            top: 25px;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        .eye {
            width: 10px;
            height: 10px;
            background-color: #333;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        /* Sleeping / Tired */
        .eye-tired { height: 4px; transform: translateY(3px); }
        .eye-sleep { height: 2px; width: 14px; background-color: transparent; border-bottom: 2px solid #333; border-radius: 0; transform: translateY(4px); }

        /* Mouth */
        .mouth {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 10px;
            border-bottom: 3px solid #333;
            border-radius: 0 0 10px 10px;
            transition: all 0.3s ease;
        }
        .mouth-sad {
            border-bottom: none;
            border-top: 3px solid #333;
            border-radius: 10px 10px 0 0;
            bottom: -3px; /* Ensure correct position when inverted */
        }

        /* Body */
        .pig-body {
            width: 110px;
            height: 90px;
            background-color: #fbcfe8;
            border-radius: 40% 40% 30% 30%;
            border: 4px solid #f9a8d4;
            margin-top: -15px;
            transition: transform 0.5s ease; /* For hunger */
            transform-origin: top center;
        }
        
        .dirty-filter { filter: sepia(0.6) hue-rotate(-20deg) brightness(0.8); }
        .very-dirty-filter { filter: sepia(0.8) hue-rotate(-30deg) brightness(0.6) contrast(1.2); }

        .floating { animation: floating 3s ease-in-out infinite; }
        @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .bounce { animation: bounce 0.5s ease-in-out; }
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .hidden { display: none !important; }
        
        .modal {
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
        }

        /* Speech Bubble */
        .speech-bubble {
            position: absolute;
            top: -50px;
            background: white;
            border-radius: 15px;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 20;
        }
        .speech-bubble::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 8px 8px 0;
            border-style: solid;
            border-color: white transparent transparent transparent;
        }

        .sleep-bg { background-color: #2d3436; }
        .sleep-opacity { opacity: 0.8; }
        
        @keyframes flyUp {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-100px); opacity: 0; }
        }
        .effect-particle {
            position: absolute;
            animation: flyUp 1s forwards;
            pointer-events: none;
            z-index: 30;
        }
    </style>
</head>
<body id="body-bg" class="flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-500">

    <!-- Game Container -->
    <div id="game-container" class="bg-white rounded-[40px] shadow-2xl p-6 w-full max-w-md border-8 border-pink-200 relative overflow-hidden transition-opacity duration-500">
        
        <!-- Header: Top Items -->
        <div class="flex justify-between items-center mb-4">
            <div class="bg-pink-100 px-3 py-1.5 rounded-full text-pink-600 font-bold text-sm">
                나이: <span id="age">0</span>살
            </div>
            <div class="bg-yellow-100 px-3 py-1.5 rounded-full text-yellow-600 font-bold text-sm">
                💰 <span id="money">0</span>원
            </div>
        </div>
        <div class="text-center mb-4">
            <span id="status-text" class="text-gray-500 text-sm italic">기분이 좋아요!</span>
        </div>

        <!-- Character Display Area -->
        <div class="relative h-64 flex flex-col items-center justify-end pb-8 bg-blue-50 rounded-3xl mb-6 border-4 border-dashed border-blue-100">
            <!-- Particles/Effects Container -->
            <div id="effect-layer" class="absolute inset-0 pointer-events-none flex items-center justify-center text-4xl overflow-hidden"></div>
            
            <div id="character-container" class="floating flex flex-col items-center">
                <!-- Speech Bubble -->
                <div id="speech-bubble" class="speech-bubble">안녕!</div>

                <!-- Pig SVG/CSS composite -->
                <div id="pig-wrapper" class="pig-wrapper cursor-pointer focus:outline-none" onclick="pokeCharacter()">
                    <div class="pig-head">
                        <div class="ear left"></div>
                        <div class="ear right"></div>
                        <div class="eyes">
                            <div id="eye-left" class="eye"></div>
                            <div id="eye-right" class="eye"></div>
                        </div>
                        <div class="snout">
                            <div class="nostril"></div>
                            <div class="nostril"></div>
                        </div>
                        <div id="mouth" class="mouth"></div>
                    </div>
                    <!-- Body scales with hunger -->
                    <div id="pig-body" class="pig-body"></div>
                </div>
            </div>
            
            <!-- Level Label -->
            <div id="stage-label" class="absolute bottom-2 bg-white/80 px-3 py-1 rounded-full text-xs text-blue-500 font-bold z-10 shadow-sm">
                아기 돼지
            </div>
        </div>

        <!-- Status Bars -->
        <div class="space-y-3 mb-6">
            <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                    <span>🍚 배고픔</span>
                    <span id="hunger-val">100%</span>
                </div>
                <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div id="hunger-bar" class="status-bar h-full bg-orange-400 w-full"></div>
                </div>
            </div>
            <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                    <span>🧼 청결도</span>
                    <span id="clean-val">100%</span>
                </div>
                <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div id="clean-bar" class="status-bar h-full bg-blue-400 w-full"></div>
                </div>
            </div>
            <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                    <span>⚡ 에너지</span>
                    <span id="energy-val">100%</span>
                </div>
                <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div id="energy-bar" class="status-bar h-full bg-yellow-400 w-full"></div>
                </div>
            </div>
            <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                    <span>❤️ 행복도</span>
                    <span id="happy-val">100%</span>
                </div>
                <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div id="happy-bar" class="status-bar h-full bg-pink-500 w-full"></div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <!-- Changed to a 5-column grid for the buttons -->
        <div class="grid grid-cols-5 gap-2">
            <!-- 1. Open Shop (instead of Feed) -->
            <button onclick="openShop()" class="flex flex-col items-center px-1 py-2 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                <span class="text-xl mb-1">🏪</span>
                <span class="text-[10px] font-bold text-orange-600">밥 구매</span>
            </button>
            <button onclick="interact('wash')" class="flex flex-col items-center px-1 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                <span class="text-xl mb-1">🧼</span>
                <span class="text-[10px] font-bold text-blue-600">씻기기</span>
            </button>
            <button onclick="interact('sleep')" class="flex flex-col items-center px-1 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                <span class="text-xl mb-1">💤</span>
                <span class="text-[10px] font-bold text-indigo-600">재우기</span>
            </button>
            <button onclick="interact('play')" class="flex flex-col items-center px-1 py-2 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors">
                <span class="text-xl mb-1">⚽</span>
                <span class="text-[10px] font-bold text-pink-600">놀기</span>
            </button>
            <!-- 5. Work Button -->
            <button onclick="interact('work')" class="flex flex-col items-center px-1 py-2 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                <span class="text-xl mb-1">💼</span>
                <span class="text-[10px] font-bold text-green-600">알바가기</span>
            </button>
        </div>
    </div>

    <!-- Shop Modal -->
    <div id="shop-modal" class="fixed inset-0 modal hidden flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-3xl w-80 shadow-2xl relative">
            <button onclick="closeShop()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold">✕</button>
            <h2 class="text-xl font-bold mb-4 text-center">음식 상점</h2>
            <div class="flex justify-between mb-4 bg-yellow-50 px-3 py-2 rounded-xl text-yellow-700 font-bold">
                <span>내 돈:</span>
                <span id="shop-money">0원</span>
            </div>
            <div class="space-y-3">
                <button onclick="buyFood('apple')" class="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🍎</span>
                        <div class="text-left">
                            <div class="font-bold text-sm text-gray-800">사과 (10원)</div>
                            <div class="text-[10px] text-gray-500">배고픔 +20, 행복 +5</div>
                        </div>
                    </div>
                </button>
                <button onclick="buyFood('burger')" class="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🍔</span>
                        <div class="text-left">
                            <div class="font-bold text-sm text-gray-800">햄버거 (30원)</div>
                            <div class="text-[10px] text-gray-500">배고픔 +50, 행복 +10</div>
                        </div>
                    </div>
                </button>
                <button onclick="buyFood('steak')" class="w-full flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🥩</span>
                        <div class="text-left">
                            <div class="font-bold text-sm text-gray-800">프리미엄 고기 (50원)</div>
                            <div class="text-[10px] text-gray-500">배고픔 +100, 행복 +30</div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <!-- Message Overlay (Game Over/Win) -->
    <div id="overlay" class="fixed inset-0 modal hidden flex flex-col items-center justify-center z-50">
        <div class="bg-white p-8 rounded-[30px] text-center max-w-xs shadow-2xl">
            <div id="overlay-icon" class="text-6xl mb-4 text-center flex justify-center w-full">💀</div>
            <h2 id="overlay-title" class="text-2xl font-bold mb-2">게임 오버</h2>
            <p id="overlay-desc" class="text-gray-600 mb-6 font-bold whitespace-pre-wrap">임현교가 너무 배고파서 떠났어요...</p>
            <button onclick="resetGame()" class="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition-transform active:scale-95 w-full">
                다시 키우기
            </button>
        </div>
    </div>

    <script>
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

        const charContainer = document.getElementById('character-container');
        const pigWrapper = document.getElementById('pig-wrapper');
        const pigBody = document.getElementById('pig-body');
        const eyeLeft = document.getElementById('eye-left');
        const eyeRight = document.getElementById('eye-right');
        const mouth = document.getElementById('mouth');
        const speechBubble = document.getElementById('speech-bubble');
        
        const ageEl = document.getElementById('age');
        const moneyEl = document.getElementById('money');
        const shopMoneyEl = document.getElementById('shop-money');
        const stageLabel = document.getElementById('stage-label');
        const statusText = document.getElementById('status-text');
        const effectLayer = document.getElementById('effect-layer');
        const overlay = document.getElementById('overlay');
        const shopModal = document.getElementById('shop-modal');

        function init() {
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
    </script>
</body>
</html>