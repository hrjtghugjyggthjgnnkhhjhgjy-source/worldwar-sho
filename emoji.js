// --- دیتابیس کامل ایموجی‌ها (شبیه تلگرام) ---
const emojiCategories = {
    smileys: [
        '😀','😃','😄','😁','😆','😅','😂','🤣','🥲','☺️','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗',
        '😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕',
        '🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰',
        '😥','😓','🤗','🤔','🫣','🤭','🫢','🫡','🤫','🤥','😶','🫥','😐','🫤','😑','😬','🙄','😯','😦','😧'
    ],
    animals: [
        '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊',
        '🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌',
        '🐞','🐜','🪰','🪱','🦗','🕷','🕸','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠'
    ],
    food: [
        '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑',
        '🥦','🥬','🥒','🌶','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳',
        '🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗'
    ],
    sports: [
        '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳',
        '🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸','🥌','🎿','⛷','🏂','🪂','🏋️','🤼','🤸','⛹️',
        '🤺','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚵','🚴','🏆','🥇','🥈','🥉','🏅','🎖','🏵','🎗'
    ],
    objects: [
        '⌚','📱','📲','💻','⌨️','🖥','🖨','🖱','🖲','🕹','🗜','💽','💾','💿','📀','📼','📷','📸','📹','🎥',
        '📽','🎞','📞','☎️','📟','📠','📺','📻','🎙','🎚','🎛','🧭','⏱','⏲','⏰','🕰','⌛','⏳','📡','🔋',
        '🪫','🔌','💡','🔦','🕯','🪔','🧯','🛢','💸','💵','💴','💶','💷','🪙','💰','💳','💎','⚖️','🪜','🧰'
    ],
    symbols: [
        '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️',
        '✝️','☪️','🕉','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐',
        '♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️'
    ],
    flags: [
        '🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️','🇮🇷','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇯🇵','🇨🇳','🇷🇺','🇮🇳','🇸🇦','🇹🇷','🇦🇪',
        '🇨🇦','🇦🇺','🇧🇷','🇮🇹','🇪🇸','🇰🇷','🇲🇽','🇳🇱','🇨🇭','🇸🇪','🇳🇴','🇩🇰','🇫🇮','🇧🇪','🇦🇹','🇵🇹','🇬🇷','🇮🇪','🇳🇿','🇿🇦'
    ]
};

let currentCategory = 'smileys';

// ۱. ساخت نوار دسته‌بندی
function initEmojiTabs() {
    const emojiPanel = document.getElementById('emojiPanel');
    if (!emojiPanel) return;

    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'emoji-tabs';
    
    const tabs = [
        { id: 'smileys', icon: 'fa-smile' },
        { id: 'animals', icon: 'fa-paw' },
        { id: 'food', icon: 'fa-utensils' },
        { id: 'sports', icon: 'fa-futbol' },
        { id: 'objects', icon: 'fa-mobile-alt' },
        { id: 'symbols', icon: 'fa-heart' },
        { id: 'flags', icon: 'fa-flag' }
    ];

    tabs.forEach(tab => {
        const btn = document.createElement('button');
        btn.innerHTML = `<i class="fas ${tab.icon}"></i>`;
        btn.className = tab.id === currentCategory ? 'active' : '';
        btn.onclick = () => switchCategory(tab.id);
        tabsContainer.appendChild(btn);
    });

    emojiPanel.prepend(tabsContainer);
}

// ۲. ساخت لیست ایموجی‌ها
function renderEmojis(category) {
    const emojiGrid = document.querySelector('.emoji-grid');
    if (!emojiGrid) return;
    emojiGrid.innerHTML = ''; 

    emojiCategories[category].forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.onclick = () => addEmojiToInput(emoji);
        emojiGrid.appendChild(span);
    });
}

// ۳. تغییر دسته‌بندی
function switchCategory(category) {
    currentCategory = category;
    renderEmojis(category);

    const tabsContainer = document.querySelector('.emoji-tabs');
    if (tabsContainer) {
        Array.from(tabsContainer.children).forEach((btn, index) => {
            const tabIds = ['smileys', 'animals', 'food', 'sports', 'objects', 'symbols', 'flags'];
            btn.classList.toggle('active', tabIds[index] === category);
        });
    }
}

// ۴. اضافه کردن به کادر تایپ
function addEmojiToInput(emoji) {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const micBtn = document.getElementById('micBtn');

    if (messageInput) {
        messageInput.value += emoji;
        messageInput.focus();
        if (sendBtn && micBtn) {
            sendBtn.style.display = 'flex';
            micBtn.style.display = 'none';
        }
    }
}

// ۵. باز و بسته کردن پنل
function toggleEmojiPanel() {
    const emojiPanel = document.getElementById('emojiPanel');
    const messageInput = document.getElementById('messageInput');
    if (emojiPanel) {
        emojiPanel.classList.toggle('show');
        if (emojiPanel.classList.contains('show') && messageInput) {
            messageInput.blur();
        }
    }
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', () => {
    initEmojiTabs(); 
    renderEmojis('smileys');
});
