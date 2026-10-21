// --- 1. تب‌ها و منو ---
function switchTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    const targetTab = document.getElementById('tab-' + tabName);
    const targetNav = document.getElementById('nav-' + tabName);
    
    if (targetTab && targetNav) {
        targetTab.classList.add('active');
        targetNav.classList.add('active');
    }
    document.getElementById('drawerMenu').classList.remove('show');
}

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

// --- 2. ساخت گروه و کانال ---
function createNewChat(type) {
    const name = type === 'group' ? 'گروه جدید' : 'کانال جدید';
    const chatList = document.getElementById('mainChatList');
    const newChat = document.createElement('div');
    newChat.className = 'chat-item';
    newChat.onclick = () => openChat(name, 'normal');
    const icon = type === 'group' ? 'fa-users' : 'fa-bullhorn';
    const bg = type === 'group' ? 'bg-blue' : 'bg-orange';
    newChat.innerHTML = `<div class="chat-avatar ${bg}"><i class="fas ${icon}"></i></div><div class="chat-info"><div class="chat-top"><h4>${name}</h4><span class="chat-time">اکنون</span></div><p>${type === 'group' ? 'گروه' : 'کانال'} جدید ایجاد شد.</p></div>`;
    chatList.prepend(newChat);
    toggleMenu();
    switchTab('chats');
}

// --- 3. محیط چت ---
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
        chatBox.innerHTML = `<div class="message msg-received" style="background: #0078ff; color: white;">سلام! به پیام‌رسان <b>NEX</b> خوش آمدید. 🎉<br>امکان ارسال پیام در این چت وجود ندارد.</div>`;
    } else if (type === 'saved') {
        chatBox.innerHTML = `<div class="message msg-received" style="background: transparent; color: #7f91a4; text-align: center; align-self: center; margin-top: 50px;"><i class="fas fa-bookmark" style="font-size: 30px; margin-bottom: 10px;"></i><br>اینجا فضای شخصی شماست. هر چیزی که می‌خواهید برای خودتان ذخیره کنید.</div>`;
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
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
});

// --- 4. خروج (فقط برای تست) ---
function logout() {
    localStorage.removeItem('nexUser');
    location.reload();
}
