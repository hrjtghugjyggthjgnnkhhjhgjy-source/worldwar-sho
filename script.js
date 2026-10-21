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
    const drawer = document.getElementById('drawerMenu');
    if (drawer) drawer.classList.remove('show');
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

// --- 2. ساخت گروه جدید ---
function createNewChat(type) {
    if (type === 'channel') {
        alert('ساخت کانال فعلاً در دسترس نیست.');
        return;
    }
    // باز کردن پنل
    document.getElementById('createGroupModal').classList.add('show');
    // ریست کردن فرم
    document.getElementById('groupNameInput').value = '';
    document.getElementById('groupLinkInput').value = '';
    document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = false);
    selectGroupType('public'); // پیش‌فرض عمومی
    toggleMenu();
}

function closeCreateGroupModal() {
    document.getElementById('createGroupModal').classList.remove('show');
}

// --- انتخاب نوع گروه ---
let currentGroupType = 'public';
function selectGroupType(type) {
    currentGroupType = type;
    const publicBtn = document.getElementById('typePublic');
    const privateBtn = document.getElementById('typePrivate');
    const linkSection = document.getElementById('publicLinkSection');

    if (type === 'public') {
        publicBtn.classList.add('active');
        privateBtn.classList.remove('active');
        linkSection.style.display = 'block';
    } else {
        privateBtn.classList.add('active');
        publicBtn.classList.remove('active');
        linkSection.style.display = 'none';
    }
}

// --- ثبت نهایی ساخت گروه ---
function submitCreateGroup() {
    const name = document.getElementById('groupNameInput').value.trim();
    const link = document.getElementById('groupLinkInput').value.trim();
    
    // گرفتن اعضای انتخاب شده
    const selectedMembers = [];
    document.querySelectorAll('.member-checkbox:checked').forEach(cb => {
        selectedMembers.push(cb.value);
    });

    if (name === '') {
        alert('لطفاً اسم گروه را وارد کنید.');
        return;
    }

    // ذخیره در دیتابیس (localStorage)
    const groupInfo = {
        name: name,
        type: currentGroupType,
        link: currentGroupType === 'public' ? (link || name.toLowerCase().replace(/\s+/g, '_')) : '',
        members: selectedMembers,
        description: 'گروه جدیدی ایجاد شد.'
    };
    
    let groups = JSON.parse(localStorage.getItem('nexGroups')) || {};
    groups[name] = groupInfo;
    localStorage.setItem('nexGroups', JSON.stringify(groups));

    // اضافه کردن به لیست چت‌ها
    const chatList = document.getElementById('mainChatList');
    const newChat = document.createElement('div');
    newChat.className = 'chat-item';
    
    // باز کردن چت و لود کردن اطلاعات گروه با کلیک
    newChat.onclick = () => {
        openChat(name, 'group'); // نوع گروه رو group می‌فرستیم
        loadGroupInfo(name); 
    };
    
    newChat.innerHTML = `
        <div class="chat-avatar bg-blue"><i class="fas fa-users"></i></div>
        <div class="chat-info">
            <div class="chat-top"><h4>${name}</h4><span class="chat-time">اکنون</span></div>
            <p>گروه جدید ایجاد شد (${selectedMembers.length + 1} عضو).</p>
        </div>
    `;
    chatList.prepend(newChat);
    
    // بستن پنل و رفتن به تب چت‌ها
    closeCreateGroupModal();
    switchTab('chats');
    alert('گروه با موفقیت ساخته شد!');
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

    // برای گروه‌ها کادر تایپ فعال باشه، برای بقیه بر اساس نوع
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
    
    // اضافه کردن رویداد کلیک راست / نگه داشتن برای منوی کپی
    newMsg.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, text, newMsg);
    });
    let touchTimer;
    newMsg.addEventListener('touchstart', (e) => {
        touchTimer = setTimeout(() => {
            e.preventDefault();
            showContextMenu(e.touches[0].clientX, e.touches[0].clientY, text, newMsg);
        }, 500);
    });
    newMsg.addEventListener('touchend', () => clearTimeout(touchTimer));

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

// --- 5. لود کردن اطلاعات گروه در صفحه Group Info ---
function loadGroupInfo(groupName) {
    const groups = JSON.parse(localStorage.getItem('nexGroups')) || {};
    const info = groups[groupName];

    if (info) {
        document.getElementById('groupTitleDisplay').textContent = info.name;
        document.getElementById('groupDescription').textContent = info.description;
        
        // نمایش لینک یا قفل
        if (info.type === 'public') {
            document.getElementById('groupLinkDisplay').textContent = '@' + info.link;
        } else {
            document.getElementById('groupLinkDisplay').textContent = 'گروه خصوصی (بدون لینک)';
        }

        // نمایش اعضا
        const membersList = document.getElementById('groupMemberList');
        if (membersList) {
            membersList.innerHTML = '';
            // اضافه کردن خود کاربر
            membersList.innerHTML += `<div class="member-item"><div class="member-avatar bg-blue">ش</div><div class="member-name">شما (مدیر)</div></div>`;
            // اضافه کردن اعضای انتخاب شده
            info.members.forEach(m => {
                membersList.innerHTML += `<div class="member-item"><div class="member-avatar bg-gray">${m[0]}</div><div class="member-name">${m}</div></div>`;
            });
        }

        // باز کردن صفحه
        document.getElementById('groupInfoScreen').style.display = 'flex';
    }
}

function showGroupInfoForCurrentChat() {
    const currentChatName = document.getElementById('chatRoomTitle').textContent;
    loadGroupInfo(currentChatName);
}

function closeGroupInfo() {
    document.getElementById('groupInfoScreen').style.display = 'none';
}

// --- 6. منوی راست کلیک (Context Menu) ---
let currentContextMessage = null;
let currentContextText = "";

function showContextMenu(x, y, text, element) {
    currentContextText = text;
    currentContextMessage = element;

    let menu = document.getElementById('msgContextMenu');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'msgContextMenu';
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="context-item" onclick="copyMessage()"><i class="fas fa-copy"></i> کپی کردن</div>
            <div class="context-item" onclick="replyMessage()"><i class="fas fa-reply"></i> پاسخ</div>
            <div class="context-item" style="color: #ff3b30;" onclick="deleteMessage()"><i class="fas fa-trash"></i> حذف</div>
        `;
        document.body.appendChild(menu);
    }

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('show');
    document.addEventListener('click', closeContextMenu);
}

function closeContextMenu(e) {
    if (e && e.target.closest('.context-menu')) return;
    const menu = document.getElementById('msgContextMenu');
    if (menu) menu.classList.remove('show');
    document.removeEventListener('click', closeContextMenu);
}

function copyMessage() {
    navigator.clipboard.writeText(currentContextText).then(() => alert('متن کپی شد!'));
    closeContextMenu();
}

function replyMessage() {
    messageInput.value = `↩️ ${currentContextText}\n`;
    messageInput.focus();
    closeContextMenu();
}

function deleteMessage() {
    if (currentContextMessage) currentContextMessage.remove();
    closeContextMenu();
}

// --- 7. خروج ---
function logout() {
    localStorage.removeItem('nexUser');
    location.reload();
        }
