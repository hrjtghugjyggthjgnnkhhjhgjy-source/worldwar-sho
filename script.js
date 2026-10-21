// --- 1. مدیریت خوش‌آمدگویی و شروع برنامه ---
const welcomeScreen = document.getElementById('welcomeScreen');
const appContainer = document.getElementById('appContainer');

function startApp() {
    // ذخیره وضعیت ورود در حافظه مرورگر
    localStorage.setItem('nexUser', 'true');
    
    // انیمیشن محو شدن صفحه خوش‌آمدگویی
    welcomeScreen.style.opacity = '0';
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        appContainer.style.display = 'flex';
        
        // اگر کاربر برای اولین بار وارد شده، پیام خوش‌آمدگویی را باز کن
        if (!localStorage.getItem('welcomeShown')) {
            openChat('تیم NEX', 'nex');
            localStorage.setItem('welcomeShown', 'true');
        }
    }, 500);
}

// چک کردن اینکه آیا کاربر قبلا وارد شده است یا نه (برای رفرش کردن صفحه)
if (localStorage.getItem('nexUser')) {
    welcomeScreen.style.display = 'none';
    appContainer.style.display = 'flex';
}

// --- 2. مدیریت منوی کشویی (همبرگری) ---
function toggleMenu() {
    const menu = document.getElementById('drawerMenu');
    menu.classList.toggle('show');
}

// بستن منوی کشویی در صورت کلیک در فضای خالی (اختیاری و حرفه‌ای)
document.addEventListener('click', function(event) {
    const menu = document.getElementById('drawerMenu');
    const menuBtn = document.querySelector('.header-menu-btn');
    if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
        menu.classList.remove('show');
    }
});

// --- 3. ساخت بات جدید (شبیه BotFather) ---
function promptNewBot() {
    const botName = prompt("اسم بات جدیدت رو وارد کن (مثلاً: پشتیبان):");
    
    // چک کردن اینکه کاربر اسم خالی وارد نکرده باشه
    if (botName && botName.trim() !== "") {
        const chatList = document.getElementById('mainChatList');
        const newChat = document.createElement('div');
        newChat.className = 'chat-item';
        
        // اختصاص دادن رویداد کلیک به بات جدید
        newChat.onclick = () => openChat(botName, 'bot');
        
        // ساخت ظاهر بات جدید
        newChat.innerHTML = `
            <div class="chat-avatar" style="background: #ff9800;"><i class="fas fa-robot"></i></div>
            <div class="chat-info">
                <div class="chat-top">
                    <h4>${botName} <i class="fas fa-check-circle verified-badge" style="font-size:12px;"></i></h4>
                    <span class="chat-time">بات</span>
                </div>
                <p>ربات جدید شما ساخته شد.</p>
            </div>
        `;
        chatList.appendChild(newChat);
        alert("بات با موفقیت ساخته شد!");
        toggleMenu(); // بستن منو
    }
}

// --- 4. مدیریت تب‌های پایین (گفتگوها، مخاطبین، تنظیمات، پروفایل) ---
function switchTab(tabName) {
    // مخفی کردن همه تب‌ها
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    // فعال کردن تب انتخاب شده
    const targetTab = document.getElementById('tab-' + tabName);
    const targetNav = document.getElementById('nav-' + tabName);
    
    if (targetTab && targetNav) {
        targetTab.classList.add('active');
        targetNav.classList.add('active');
    } else {
        // اگر تب‌های مخاطبین یا تنظیمات هنوز ساخته نشده‌اند، به کاربر اطلاع بده
        if (tabName === 'contacts' || tabName === 'settings') {
            alert('این بخش به زودی تکمیل می‌شود!');
        }
    }
    
    closeChat();
    document.getElementById('drawerMenu').classList.remove('show'); // بستن منو
}

// --- 5. مدیریت محیط چت ---
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
    chatBox.innerHTML = ''; // پاک کردن پیام‌های قبلی

    // مدیریت غیرفعال کردن کادر تایپ برای چت‌های خاص
    if (type === 'nex' || type === 'saved') {
        chatInputContainer.classList.add('disabled');
    } else {
        chatInputContainer.classList.remove('disabled');
    }

    // نمایش پیام‌های پیش‌فرض بر اساس نوع چت
    if (type === 'nex') {
        chatBox.innerHTML = `
            <div class="message msg-received" style="background: #2a9df4; color: white;">
                سلام! به پیام‌رسان <b>NEX</b> خوش آمدید. 🎉<br><br>
                اینجا فضای امن و خصوصی شماست. برای شروع، می‌توانید از منوی مخاطبین، دوستان خود را اضافه کنید.
            </div>`;
    } else if (type === 'saved') {
        chatBox.innerHTML = `
            <div class="message msg-received" style="background: transparent; color: #7f91a4; text-align: center; align-self: center; margin-top: 50px;">
                <i class="fas fa-bookmark" style="font-size: 30px; margin-bottom: 10px;"></i><br>
                هر چیزی که می‌خواهید اینجا برای خودتان ذخیره کنید (عکس، لینک، یادداشت).
            </div>`;
    } else if (type === 'bot') {
        chatBox.innerHTML = `<div class="message msg-received">سلام! من یک ربات هستم. چطور می‌تونم کمکت کنم؟</div>`;
    } else {
        chatBox.innerHTML = '<div class="message msg-received">سلام! این یک پیام تستی است.</div>';
    }
    
    // اسکرول خودکار به آخرین پیام
    chatBox.scrollTop = chatBox.scrollHeight;
}

function closeChat() {
    chatRoom.style.display = 'none';
}

// --- 6. ارسال پیام و پاسخ خودکار ---
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
    if (text === '') return; // جلوگیری از ارسال پیام خالی

    // ساخت حباب پیام جدید (سمت خودم)
    const newMsg = document.createElement('div');
    newMsg.classList.add('message', 'msg-sent');
    newMsg.textContent = text;
    chatBox.appendChild(newMsg);
    
    // اسکرول به پایین
    chatBox.scrollTop = chatBox.scrollHeight;

    // پاک کردن فیلد تایپ
    messageInput.value = '';
    sendBtn.style.display = 'none';
    micBtn.style.display = 'flex';

    // شبیه‌سازی پاسخ خودکار (اگر به ربات یا رفیق پیام می‌دیم)
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

// رویداد کلیک و اینتر برای ارسال پیام
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // جلوگیری از رفتار پیش‌فرض (رفرش صفحه)
        sendMessage();
    }
});

// --- 7. خروج از حساب ---
function logout() {
    // پاک کردن حافظه مرورگر
    localStorage.removeItem('nexUser');
    localStorage.removeItem('welcomeShown');
    // رفرش صفحه برای بازگشت به حالت اولیه
    location.reload();
}
