// --- 1. مدیریت خوش‌آمدگویی ---
const welcomeScreen = document.getElementById('welcomeScreen');
const appContainer = document.getElementById('appContainer');

function startApp() {
    localStorage.setItem('nexUser', 'true');
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        appContainer.style.display = 'flex';
        // نمایش پیام خوش‌آمدگویی در اولین ورود
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

// --- 2. تب‌ها ---
function switchTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');
    document.getElementById('nav-' + tabName).classList.add('active');
    closeChat();
}

// --- 3. مدیریت چت ---
const chatRoom = document.getElementById('chatRoom');
const chatBox = document.getElementById('chatBox');
const chatTitle = document.getElementById('chatRoomTitle');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');

function openChat(name, type) {
    chatTitle.textContent = name;
    chatRoom.style.display = 'flex';
    chatBox.innerHTML = ''; // پاک کردن پیام‌های قبلی

    // تشخیص نوع چت و نمایش پیام‌های پیش‌فرض
    if (type === 'nex') {
        chatBox.innerHTML = `
            <div class="message msg-received" style="background: #2a9df4; color: white;">
                سلام! به پیام‌رسان <b>NEX</b> خوش آمدید. 🎉<br><br>
                اینجا فضای امن و خصوصی شماست. برای شروع، می‌توانید از منوی مخاطبین، دوستان و خانواده خود را اضافه کنید.
            </div>`;
    } else if (type === 'saved') {
        chatBox.innerHTML = `
            <div class="message msg-received" style="background: transparent; color: #7f91a4; text-align: center; align-self: center;">
                <i class="fas fa-bookmark" style="font-size: 30px; margin-bottom: 10px;"></i><br>
                هر چیزی که می‌خواهید اینجا برای خودتان ذخیره کنید (عکس، لینک، یادداشت).
            </div>`;
    } else {
        // چت عادی (رفیق)
        chatBox.innerHTML = '<div class="message msg-received">سلام! این یک پیام تستی است.</div>';
    }
}

function closeChat() {
    chatRoom.style.display = 'none';
}

// --- 4. ارسال پیام ---
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

    // پاسخ خودکار (فقط برای چت‌های عادی)
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
    if (e.key === 'Enter') sendMessage();
});

// --- 5. خروج ---
function logout() {
    localStorage.removeItem('nexUser');
    localStorage.removeItem('welcomeShown');
    location.reload();
}
