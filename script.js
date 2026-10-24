// --- 1. مدیریت تب‌ها ---
function switchTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    const targetTab = document.getElementById('tab-' + tabName);
    const targetNav = document.getElementById('nav-' + tabName);
    
    if (targetTab && targetNav) {
        targetTab.classList.add('active');
        targetNav.classList.add('active');
    }

    const headerTitle = document.getElementById('mainHeaderTitle');
    if (headerTitle) {
        headerTitle.style.visibility = tabName === 'chats' ? 'visible' : 'hidden';
    }
}

// --- 2. تغییر تم ---
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    if (body.classList.contains('light-theme')) {
        localStorage.setItem('nexTheme', 'light');
    } else {
        localStorage.setItem('nexTheme', 'dark');
    }
}

// --- 3. ساخت گروه (بدون تغییر) ---
function createNewChat(type) {
    if (type === 'channel') return alert('ساخت کانال فعلاً در دسترس نیست.');
    document.getElementById('createGroupModal').classList.add('show');
    document.getElementById('groupNameInput').value = '';
    document.getElementById('groupLinkInput').value = '';
    document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = false);
    selectGroupType('public');
}
function closeCreateGroupModal() { document.getElementById('createGroupModal').classList.remove('show'); }
let currentGroupType = 'public';
function selectGroupType(type) {
    currentGroupType = type;
    document.getElementById('typePublic').classList.toggle('active', type === 'public');
    document.getElementById('typePrivate').classList.toggle('active', type === 'private');
    document.getElementById('publicLinkSection').style.display = type === 'public' ? 'block' : 'none';
}
function submitCreateGroup() {
    const name = document.getElementById('groupNameInput').value.trim();
    const link = document.getElementById('groupLinkInput').value.trim();
    const selectedMembers = [];
    document.querySelectorAll('.member-checkbox:checked').forEach(cb => selectedMembers.push(cb.value));
    if (name === '') return alert('لطفاً اسم گروه را وارد کنید.');

    const groupInfo = {
        name: name, type: currentGroupType,
        link: currentGroupType === 'public' ? (link || name.toLowerCase().replace(/\s+/g, '_')) : '',
        members: selectedMembers, description: 'گروه جدیدی ایجاد شد.'
    };
    let groups = JSON.parse(localStorage.getItem('nexGroups')) || {};
    groups[name] = groupInfo;
    localStorage.setItem('nexGroups', JSON.stringify(groups));

    addChatToList(name, 'group', selectedMembers.length + 1);
    closeCreateGroupModal();
    switchTab('chats');
}

// --- 4. مدیریت لیست چت‌ها ---
function addChatToList(name, type, memberCount = '') {
    const chatList = document.getElementById('mainChatList');
    const newChat = document.createElement('div');
    newChat.className = 'chat-item';
    newChat.onclick = () => { openChat(name, type); if(type === 'group') loadGroupInfo(name); };
    
    let touchTimer;
    newChat.addEventListener('touchstart', (e) => { touchTimer = setTimeout(() => { e.preventDefault(); showDeleteChatMenu(e.touches[0].clientX, e.touches[0].clientY, newChat, name); }, 600); });
    newChat.addEventListener('touchend', () => clearTimeout(touchTimer));

    const icon = type === 'group' ? 'fa-users' : (type === 'saved' ? 'fa-bookmark' : 'fa-user');
    const bg = type === 'group' ? 'bg-blue' : (type === 'saved' ? 'bg-green' : 'bg-purple');
    newChat.innerHTML = `<div class="chat-avatar ${bg}"><i class="fas ${icon}"></i></div><div class="chat-info"><div class="chat-top"><h4>${name}</h4><span class="chat-time">اکنون</span></div><p>${type === 'group' ? `گروه (${memberCount} عضو)` : 'چت شخصی'}</p></div>`;
    chatList.prepend(newChat);
}

// --- 5. مدیریت محیط چت ---
const chatRoom = document.getElementById('chatRoom');
const chatBox = document.getElementById('chatBox');
const chatTitle = document.getElementById('chatRoomTitle');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const chatInputArea = document.getElementById('chatInputArea');

async function openChat(name, type) {
    chatTitle.textContent = name;
    chatRoom.classList.add('active-chat');
    chatRoom.style.display = 'flex'; // اطمینان از نمایش
    setTimeout(() => { chatRoom.style.transform = 'translateY(0)'; chatRoom.style.opacity = '1'; }, 10);
    chatBox.innerHTML = ''; 

    const avatarDiv = document.getElementById('chatHeaderAvatar');
    const subtitle = document.getElementById('chatRoomSubtitle');
    
    if (avatarDiv && subtitle) {
        if (type === 'group' || type === 'channel') {
            avatarDiv.innerHTML = '<i class="fas fa-users"></i>';
            let groups = JSON.parse(localStorage.getItem('nexGroups')) || {};
            if (groups[name]) {
                subtitle.textContent = `مشترک ${groups[name].members.length + 1}`;
            } else {
                subtitle.textContent = 'گروه';
            }
        } else if (type === 'saved') {
            avatarDiv.innerHTML = '<i class="fas fa-bookmark"></i>';
            subtitle.textContent = 'ذخیره شده';
        } else {
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
            subtitle.textContent = 'آنلاین';
        }
    }

    if (type === 'nex') {
        if (chatInputArea) chatInputArea.style.display = 'none'; 
        chatBox.innerHTML = `<div class="message msg-received" style="background: #0078ff; color: white;">سلام! به پیام‌رسان <b>NEX</b> خوش آمدید. 🎉</div>`;
    } else {
        if (chatInputArea) chatInputArea.style.display = 'block'; 
        
        if (typeof DB !== 'undefined') {
            const chatId = name === 'پیام‌های ذخیره شده' ? 'saved' : name;
            try {
                const msgs = await DB.getMessages(chatId);
                if (msgs.length === 0) {
                    chatBox.innerHTML = `<div class="message msg-received" style="text-align:center; background:transparent; color:#7f91a4;">هنوز پیامی ارسال نشده.</div>`;
                } else {
                    msgs.forEach(m => renderMessage(m.text, m.sender, chatBox));
                }
            } catch (error) {
                console.error("خطا در خواندن دیتابیس:", error);
            }
        }
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

function closeChat() { 
    chatRoom.classList.remove('active-chat');
    chatRoom.style.transform = 'translateY(100%)';
    chatRoom.style.opacity = '0';
    setTimeout(() => { chatRoom.style.display = 'none'; }, 300); // بعد از انیمیشن مخفی شود
    if (chatInputArea) chatInputArea.style.display = 'block'; 
}

// --- 6. ارسال پیام ---
messageInput.addEventListener('input', function() {
    const hasText = this.value.trim().length > 0;
    sendBtn.style.display = hasText ? 'flex' : 'none';
    micBtn.style.display = hasText ? 'none' : 'flex';
});

async function sendMessage() {
    const text = messageInput.value.trim();
    const currentChat = chatTitle.textContent;
    
    if (text === '' || currentChat === 'تیم NEX') return;

    if (typeof DB !== 'undefined') {
        const chatId = currentChat === 'پیام‌های ذخیره شده' ? 'saved' : currentChat;
        try {
            await DB.saveMessage(chatId, text, 'me');
        } catch (error) {
            console.error("خطا در ذخیره در دیتابیس:", error);
        }
    }

    renderMessage(text, 'me', chatBox);
    chatBox.scrollTop = chatBox.scrollHeight;
    messageInput.value = '';
    sendBtn.style.display = 'none';
    micBtn.style.display = 'flex';
}

function renderMessage(text, sender, container) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender === 'me' ? 'msg-sent' : 'msg-received');
    msg.textContent = text;
    
    // فعال کردن منوی لمس طولانی برای این پیام
    attachMessageEvents(msg);
    
    container.appendChild(msg);
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } });

// --- 7. منوی سه نقطه هدر چت ---
function toggleChatMenu(event) {
    if(event) event.stopPropagation(); // جلوگیری از بسته شدن فوری
    const menu = document.getElementById('headerDropdown');
    if (menu) menu.classList.toggle('show');
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('headerDropdown');
    if (menu && !menu.contains(e.target) && !e.target.closest('.chat-room-header .glass-btn')) {
        menu.classList.remove('show');
    }
});

// --- 8. منوی لمس طولانی روی پیام (Context Menu) ---
let currentSelectedMessage = null;
let longPressTimer;

function showContextMenu(x, y, element) {
    const menu = document.getElementById('messageContextMenu');
    currentSelectedMessage = element;
    
    // تنظیم موقعیت منو
    menu.style.left = Math.min(x, window.innerWidth - 210) + 'px';
    menu.style.top = Math.min(y, window.innerHeight - 300) + 'px';
    menu.classList.add('show');

    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target)) {
            menu.classList.remove('show');
            document.removeEventListener('click', closeMenu);
        }
    });
}

function attachMessageEvents(messageElement) {
    // برای موبایل
    messageElement.addEventListener('touchstart', (e) => {
        longPressTimer = setTimeout(() => {
            e.preventDefault();
            const touch = e.touches[0];
            showContextMenu(touch.clientX, touch.clientY, messageElement);
        }, 500);
    });
    messageElement.addEventListener('touchend', () => clearTimeout(longPressTimer));
    messageElement.addEventListener('touchmove', () => clearTimeout(longPressTimer));

    // برای دسکتاپ
    messageElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, messageElement);
    });
}

function handleMsgAction(action) {
    const menu = document.getElementById('messageContextMenu');
    if (action === 'delete' && currentSelectedMessage) {
        currentSelectedMessage.remove();
    } else if (action === 'copy' && currentSelectedMessage) {
        navigator.clipboard.writeText(currentSelectedMessage.textContent);
    } else {
        alert(`اکشن ${action} انتخاب شد.`);
    }
    menu.classList.remove('show');
}

// --- 9. منوهای راست کلیک لیست چت ---
function createContextMenu(items) {
    let menu = document.getElementById('contextMenu');
    if (menu) menu.remove();
    menu = document.createElement('div');
    menu.id = 'contextMenu'; menu.className = 'context-menu';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'context-item';
        div.innerHTML = `<i class="fas ${item.icon}"></i> ${item.label}`;
        div.onclick = item.action;
        menu.appendChild(div);
    });
    document.body.appendChild(menu); return menu;
}
function showDeleteChatMenu(x, y, chatElement, chatName) {
    const menu = createContextMenu([
        { label: 'حذف گفتگو', icon: 'fa-trash', action: () => {
            if(confirm('آیا از حذف این گفتگو مطمئن هستید؟')) {
                chatElement.remove();
                let groups = JSON.parse(localStorage.getItem('nexGroups')) || {};
                if(groups[chatName]) { delete groups[chatName]; localStorage.setItem('nexGroups', JSON.stringify(groups)); }
            }
            menu.remove();
        }}
    ]);
    menu.style.left = x + 'px'; menu.style.top = y + 'px'; menu.classList.add('show');
    document.addEventListener('click', () => menu.remove(), { once: true });
}

// --- 10. اطلاعات گروه و خروج ---
function loadGroupInfo(groupName) {
    const groups = JSON.parse(localStorage.getItem('nexGroups')) || {};
    const info = groups[groupName];
    if (info) {
        document.getElementById('groupTitleDisplay').textContent = info.name;
        document.getElementById('groupDescription').textContent = info.description;
        document.getElementById('groupLinkDisplay').textContent = info.type === 'public' ? '@' + info.link : 'گروه خصوصی';
        const membersList = document.getElementById('groupMemberList');
        membersList.innerHTML = `<div class="member-item"><div class="member-avatar bg-blue">ش</div><div class="member-name">شما (مدیر)</div></div>`;
        info.members.forEach(m => membersList.innerHTML += `<div class="member-item"><div class="member-avatar bg-gray">${m[0]}</div><div class="member-name">${m}</div></div>`);
        document.getElementById('groupInfoScreen').style.display = 'flex';
    }
}
function showGroupInfoForCurrentChat() { loadGroupInfo(chatTitle.textContent); }
function closeGroupInfo() { document.getElementById('groupInfoScreen').style.display = 'none'; }
function logout() { location.reload(); }

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('nexTheme');
    if (savedTheme === 'light') document.body.classList.add('light-theme');
});
