// --- فایل اختصاصی مدیریت ایموجی‌ها (شبیه تلگرام) ---

// دیتابیس ایموجی‌ها به تفکیک دسته‌بندی
const emojiCategories = {
    smileys: ['😀', '😂', '❤️', '👍', '🔥', '😍', '🙏', '💔', '😎', '😢', '🎉', '👏', '✨', '💯', '😡', '😱', '🤔', '😴', '🤝', '💪', '👀', '🤯', '🥶', '🤩'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽'],
    sports: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️'],
    objects: ['📱', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠']
};

let currentCategory = 'smileys'; // دسته پیش‌فرض

// ۱. ساخت نوار دسته‌بندی (بالای پنل)
function initEmojiTabs() {
    const emojiPanel = document.getElementById('emojiPanel');
    if (!emojiPanel) return;

    // ساخت کانتینر تب‌ها
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'emoji-tabs';
    
    // ساخت آیکون‌های تب
    const tabs = [
        { id: 'smileys', icon: 'fa-smile' },
        { id: 'animals', icon: 'fa-paw' },
        { id: 'food', icon: 'fa-utensils' },
        { id: 'sports', icon: 'fa-futbol' },
        { id: 'symbols', icon: 'fa-heart' },
        { id: 'objects', icon: 'fa-mobile-alt' }
    ];

    tabs.forEach(tab => {
        const btn = document.createElement('button');
        btn.innerHTML = `<i class="fas ${tab.icon}"></i>`;
        btn.className = tab.id === currentCategory ? 'active' : '';
        btn.onclick = () => switchCategory(tab.id);
        tabsContainer.appendChild(btn);
    });

    // اضافه کردن تب‌ها به بالای پنل ایموجی
    emojiPanel.prepend(tabsContainer);
}

// ۲. ساخت لیست ایموجی‌ها
function renderEmojis(category) {
    const emojiGrid = document.querySelector('.emoji-grid');
    if (!emojiGrid) return;

    emojiGrid.innerHTML = ''; // پاک کردن قبلی‌ها

    emojiCategories[category].forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.onclick = () => addEmojiToInput(emoji);
        emojiGrid.appendChild(span);
    });
}

// ۳. تغییر دسته‌بندی با کلیک روی تب‌ها
function switchCategory(category) {
    currentCategory = category;
    renderEmojis(category);

    // آپدیت کردن ظاهر تب‌ها (فعال/غیرفعال)
    const tabsContainer = document.querySelector('.emoji-tabs');
    if (tabsContainer) {
        Array.from(tabsContainer.children).forEach((btn, index) => {
            const tabIds = ['smileys', 'animals', 'food', 'sports', 'symbols', 'objects'];
            if (tabIds[index] === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// ۴. اضافه کردن ایموجی به کادر تایپ
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

// --- راه‌اندازی اولیه ---
document.addEventListener('DOMContentLoaded', () => {
    initEmojiTabs();       // ساخت تب‌ها
    renderEmojis('smileys'); // نمایش ایموجی‌های دسته اول
});
