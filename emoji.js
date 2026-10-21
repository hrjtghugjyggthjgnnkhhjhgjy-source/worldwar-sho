// --- فایل اختصاصی مدیریت ایموجی‌ها ---

const emojiList = [
    '😀', '😂', '❤️', '👍', '🔥', '😍', '🙏', '💔', 
    '😎', '😢', '🎉', '👏', '✨', '💯', '🚀', '🌹',
    '😡', '😱', '🤔', '😴', '🤝', '💪', '👀', '🤯'
];

function initEmojiPanel() {
    const emojiGrid = document.querySelector('.emoji-grid');
    if (!emojiGrid) return; 

    emojiGrid.innerHTML = ''; 

    emojiList.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.onclick = () => addEmojiToInput(emoji);
        emojiGrid.appendChild(span);
    });
}

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

document.addEventListener('DOMContentLoaded', () => {
    initEmojiPanel();
});
