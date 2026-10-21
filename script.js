const welcomeScreen = document.getElementById('welcomeScreen');
const appContainer = document.getElementById('appContainer');

function startApp() {
    localStorage.setItem('nexUser', 'true');
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        appContainer.style.display = 'flex';
    }, 500);
}

if (localStorage.getItem('nexUser')) {
    welcomeScreen.style.display = 'none';
    appContainer.style.display = 'flex';
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');
    document.getElementById('nav-' + tabName).classList.add('active');
    document.getElementById('headerTitle').textContent = tabName === 'chats' ? 'چت‌ها' : 'پروفایل';
    closeChat();
}

const chatRoom = document.getElementById('chatRoom');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');

function openChat(name) {
    document.getElementById('chatRoomTitle').textContent = name;
    chatRoom.style.display = 'flex';
    chatBox.innerHTML = '<div class="message msg-received">سلام! این یک پیام تستی است.</div>';
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
    
    setTimeout(() => {
        const replyMsg = document.createElement('div');
        replyMsg.classList.add('message', 'msg-received');
        replyMsg.textContent = "پیامت رسید! (پاسخ خودکار)";
        chatBox.appendChild(replyMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1500);
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

const profileNameInput = document.getElementById('profileNameInput');
if (localStorage.getItem('nexUserName')) {
    profileNameInput.value = localStorage.getItem('nexUserName');
}
profileNameInput.addEventListener('input', function() {
    localStorage.setItem('nexUserName', this.value);
});

function logout() {
    localStorage.removeItem('nexUser');
    location.reload();
}
