// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Navbar Scroll Effect
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'py-3');
            nav.classList.remove('bg-transparent', 'py-5');
        } else {
            nav.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'py-3');
            nav.classList.add('bg-transparent', 'py-5');
        }
    });

    // 3. Mobile Menu Toggle Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if(isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(isMenuOpen) toggleMenu();
        });
    });
});

// 4. AI Chatbot Logic
function addMessage(text, isUser) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    
    if (isUser) {
        msgDiv.className = 'bg-gray-100 p-4 rounded-3xl rounded-tr-none ml-auto max-w-[85%] border border-gray-200 shadow-sm mt-4';
        msgDiv.innerHTML = `<p class="text-sm font-medium text-gray-800 leading-relaxed">${text}</p>`;
    } else {
        msgDiv.className = 'bg-blue-50 p-4 rounded-3xl rounded-tl-none mr-auto max-w-[90%] border border-blue-100 shadow-sm mt-4';
        msgDiv.innerHTML = `<p class="text-sm font-medium text-blue-900 leading-relaxed">${text}</p>`;
    }
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Refresh newly added icons if there are any
    lucide.createIcons();
}

function showTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.id = 'typing-indicator';
    msgDiv.className = 'bg-blue-50 p-4 rounded-3xl rounded-tl-none mr-auto max-w-[50%] border border-blue-100 shadow-sm mt-4 flex items-center space-x-2';
    msgDiv.innerHTML = `
        <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
        <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
    `;
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function generateAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    let response = "";

    if (msg.includes("바다") || msg.includes("강릉") || msg.includes("동해")) {
        response = "현재 출발지(서울)에서 KTX로 2시간이면 도착하는 <strong>🌊 강릉 오션 블루 패스</strong>를 추천합니다! <br/><br/>산지에서 바로 올라온 싱싱한 오징어를 특산물 마켓에서 만나보시겠어요?<br/><a href='market-detail.html' class='inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 font-bold bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm transition-all'><i data-lucide=\"shopping-bag\" class=\"w-4 h-4 mr-1\"></i> 특산물 마켓 구경하기</a>";
    } else if (msg.includes("산") || msg.includes("힐링") || msg.includes("부모님")) {
        response = "조용하고 걷기 평온한 <strong>🌲 평창 힐링 포레스트 패스</strong>는 어떠신가요? KTX 왕복권과 숲속 한옥 숙박이 포함되어 있습니다. <br/><br/>평창 농가에서 진행하는 달콤한 과일 펀딩도 구경해 보세요!<br/><a href='funding-detail.html' class='inline-flex items-center mt-3 text-orange-600 hover:text-orange-800 font-bold bg-white px-3 py-1.5 rounded-lg border border-orange-200 shadow-sm transition-all'><i data-lucide=\"heart-handshake\" class=\"w-4 h-4 mr-1\"></i> 펀딩 참여하기</a>";
    } else {
        response = "입력해주신 취향을 바탕으로 전국 로컬 데이터를 검색해 보았습니다! ✨ 지금 당장 떠나기 좋은 <strong>🍊 제주도 미식 투어 패스</strong>를 추천해 드릴게요.<br/><br/>제주 현지 농부님이 직배송하는 100% 무농약 한라봉 펀딩 마감도 얼마 남지 않았어요!<br/><a href='funding-detail.html' class='inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 font-bold bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm transition-all'><i data-lucide=\"chevron-right\" class=\"w-4 h-4 mr-1\"></i> 펀딩 상세 보기</a>";
    }
    
    return response;
}

window.sendMessage = function() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    // Add user message to chat
    addMessage(text, true);
    input.value = '';
    
    // Show AI typing indicator
    showTypingIndicator();
    
    // Simulate network delay for AI response
    setTimeout(() => {
        removeTypingIndicator();
        const reply = generateAIResponse(text);
        addMessage(reply, false);
    }, 1500);
}

window.handleEnter = function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}
