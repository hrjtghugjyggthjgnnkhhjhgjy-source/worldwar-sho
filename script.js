// --- 1. مدیریت ورود ---
const welcomeScreen = document.getElementById('welcomeScreen');
const appContainer = document.getElementById('appContainer');

function startApp() {
    localStorage.setItem('nexUser', 'true');
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        appContainer.style.display = 'flex';
        if (!localStorage.getItem('welcomeShown')) {
            openChat('تیم NEX', 'nex');
            localStorage.setItem('welcomeShown', 'true');
        }
    }, 500);
}

if (localStorage.getItem('nexUser')) {
    welcomeScreen.style.display = 'none';
    appContainer.style.display = 'flex';
}

// --- 2. منوی کشویی ---
function toggleMenu() {
    document.getElementById('drawerMenu').classList.toggle('show');
}
document.addEventListener('click', function(event) {
    const menu = document.getElementById('drawerMenu');
    const menuBtn = document.querySelector('.header-menu-btn');
    if (menu && menuBtn && !menu.contains(event.target) && !menuBtn.contains(event.target)) {
        menu.classList.remove('show');
    }
});

// --- 3. ساخت گروه و کانال (از منو یا مخاطبین) ---
function createNewChat(type) {
    const name = prompt(`اسم ${type === 'group' ? 'گروه' : 'کانال'} جدیدت رو وارد کن:`);
    if (name && name.trim() !== "") {
        const chatList = document.getElementById('mainChatList');
        const newChat = document.createElement('div');
        newChat.className = 'chat-item';
        newChat.onclick = () => openChat(name, 'normal');
        
        const icon = type === 'group' ? 'fa-users' : 'fa-bullhorn';
        const bg = type === 'group' ? 'bg-blue' : 'bg-orange';
        
        newChat.innerHTML = `
            <div class="chat-avatar ${bg}"><i class="fas ${icon}"></i></div>
            <div class="chat-info">
                <div class="chat-top">
                    <h4>${name}</h4>
                    <span class="chat-time">اکنون</span>
                </div>
                <p>${type === 'group' ? 'گروه' : 'کانال'} جدید ایجاد شد.</p>
            </div>
        `;
        chatList.prepend(newChat); // اضافه شدن به بالای لیست
        alert(`${type === 'group' ? 'گروه' : 'کانال'} با موفقیت ساخته شد!`);
        
        // بستن منو و رفتن به تب چت
        document.getElementById('drawerMenu').classList.remove('show');
        switchTab('chats');
    }
}

// --- 4. مدیریت تب‌ها ---
function switchTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    const targetTab = document.getElementById('tab-' + tabName);
    const targetNav = document.getElementById('nav-' + tabName);
    
    if (targetTab && targetNav) {
        targetTab.classList.add('active');
        targetNav.classList.add('active');
    }
    closeChat();
    document.getElementById('drawerMenu').classList.remove('show');
}

// --- 5. مدیریت چت و ارسال پیام ---
const chatRoom = document.getElementById('chatRoom');
const chatBox = document.getElementById('chatBox');
const chatTitle = document.getElementById('chatRoomTitle');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const chatInputContainer = document.getElementById('chatInputContainer');

function openChat(name, type) {
    chatTitle.textContent = name;
    chatRoom.style.display = 'flex';
    chatBox.innerHTML = ''; 

    if (type === 'nex' || type === 'saved') {
        chatInputContainer.classList.add('disabled');
    } else {
        chatInputContainer.classList.remove('disabled');
    }

    if (type === 'nex') {
        chatBox.innerHTML = `<div class="message msg-received" style="background: #2a9df4; color: white;">سلام! به پیام‌رسان <b>NEX</b> خوش آمدید. 🎉<br>اینجا فضای امن و خصوصی شماست.</div>`;
    } else if (type === 'saved') {
        chatBox.innerHTML = `<div class="message msg-received" style="background: transparent; color: #7f91a4; text-align: center; align-self: center; margin-top: 50px;"><i class="fas fa-bookmark" style="font-size: 30px; margin-bottom: 10px;"></i><br>هر چیزی که می‌خواهید اینجا ذخیره کنید.</div>`;
    } else {
        chatBox.innerHTML = '<div class="message msg-received">سلام! این یک پیام تستی است.</div>';
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

function closeChat() { chatRoom.style.display = 'none'; }

messageInput.addEventListener('input', function() {
    if (this.value.trim().length > 0) {
        sendBtn.style.display = 'flex';
        micBtn.style.display = 'none';
    } else {
        sendBtn.style.display = 'none';
        micBtn.style.display = 'flex';
    }
});

function sendMessage() {
    const text = messageInput.value.trim();
    if (text === '') return;

    const newMsg = document.createElement('div');
    newMsg.classList.add('message', 'msg-sent');
    newMsg.textContent = text;
    chatBox.appendChild(newMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    messageInput.value = '';
    sendBtn.style.display = 'none';
    micBtn.style.display = 'flex';

    if (chatTitle.textContent !== 'تیم NEX' && chatTitle.textContent !== 'پیام‌های ذخیره شده') {
        setTimeout(() => {
            const replyMsg = document.createElement('div');
            replyMsg.classList.add('message', 'msg-received');
            replyMsg.textContent = "پیامت رسید! (پاسخ خودکار)";
            chatBox.appendChild(replyMsg);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1500);
    }
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
});

// --- 6. مدیریت پنل ایموجی ---
const emojiPanel = document.getElementById('emojiPanel');
function toggleEmojiPanel() {
    emojiPanel.classList.toggle('show');
    if (emojiPanel.classList.contains('show')) messageInput.blur();
}
function addEmoji(emoji) {
    messageInput.value += emoji;
    messageInput.focus();
    sendBtn.style.display = 'flex';
    micBtn.style.display = 'none';
}

// --- 7. خروج ---
function logout() {
    localStorage.removeItem('nexUser');
    localStorage.removeItem('welcomeShown');
    location.reload();
        }
