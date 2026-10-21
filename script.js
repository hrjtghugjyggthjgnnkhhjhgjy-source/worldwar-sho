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
    document.getElementById('createGroupModal').classList.add('show');
    document.getElementById('groupNameInput').value = '';
    document.getElementById('groupLinkInput').value = '';
    document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = false);
    selectGroupType('public');
    toggleMenu();
}

function closeCreateGroupModal() {
    document.getElementById('createGroupModal').classList.remove('show');
}

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

function submitCreateGroup() {
    const name = document.getElementById('groupNameInput').value.trim();
    const link = document.getElementById('groupLinkInput').value.trim();
    const selectedMembers = [];
    document.querySelectorAll('.member-checkbox:checked').forEach(cb => {
        selectedMembers.push(cb.value);
    });

    if (name === '') {
        alert('لطفاً اسم گروه را وارد کنید.');
        return;
    }

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

    const chatList = document.getElementById('mainChatList');
    const newChat = document.createElement('div');
    newChat.className = 'chat-item';
    
    // وقتی روی گروه کلیک میکنیم، چت باز میشه و اطلاعات گروه لود میشه
    newChat.onclick = () => {
        openChat(name, 'group'); 
    };
    
    newChat.innerHTML = `
        <div class="chat-avatar bg-blue"><i class="fas fa-users"></i></div>
        <div class="chat-info">
            <div class="chat-top"><h4>${name}</h4><span class="chat-time">اکنون</span></div>
            <p>گروه جدید ایجاد شد (${selectedMembers.length + 1} عضو).</p>
        </div>
    `;
    chatList.prepend(newChat);
    
    closeCreateGroupModal();
    switchTab('chats');
    alert('گروه با موفقیت ساخته شد!');
}

// --- 3. مدیریت محیط چت ---
const chatRoom = document.getElementById('chatRoom');
const chatBox = document.getElementById('chatBox');
const chatTitle = document.getElementById('chatRoomTitle');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const chatInputArea = document.getElementById('chatInputArea');

function openChat(name, type) {
    chatTitle.textContent = name;
    chatRoom.style.display = 'flex';
    chatBox.innerHTML = ''; 

    // *** مخفی کردن کادر تایپ برای تیم NEX ***
    if (type === 'nex') {
        if (chatInputArea) chatInputArea.style.display = 'none'; 
        chatBox.innerHTML = `<div class="message msg-received" style="background: #0078ff; color: white;">سلام! به پیام‌رسان <b>NEX</b> خوش آمدید. 🎉<br>این یک پیام سیستم است و امکان ارسال پیام وجود ندارد.</div>`;
    
    // *** فعال بودن کادر تایپ برای پیام‌های ذخیره شده + لود از دیتابیس ***
    } else if (type === 'saved') {
        if (chatInputArea) chatInputArea.style.display = 'block'; 
        
        if (typeof DB !== 'undefined') {
            DB.getMessages('saved').then(msgs => {
                if (msgs.length === 0) {
                    chatBox.innerHTML = `<div class="message msg-received" style="background: transparent; color: #7f91a4; text-align: center; align-self: center; margin-top: 50px;"><i class="fas fa-bookmark" style="font-size: 30px; margin-bottom: 10px;"></i><br>اینجا فضای شخصی شماست.</div>`;
                } else {
                    msgs.forEach(m => {
                        const div = document.createElement('div');
                        div.classList.add('message', m.sender === 'me' ? 'msg-sent' : 'msg-received');
                        div.textContent = m.text;
                        chatBox.appendChild(div);
                    });
                }
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        }
    
    // *** چت‌های عادی (گروه‌ها و مخاطبین) + لود از دیتابیس ***
    } else {
        if (chatInputArea) chatInputArea.style.display = 'block';
        
        if (typeof DB !== 'undefined') {
            DB.getMessages(name).then(msgs => {
                if (msgs.length === 0) {
                    chatBox.innerHTML = '<div class="message msg-received">سلام! این یک پیام تستی است.</div>';
                } else {
                    msgs.forEach(m => {
                        const div = document.createElement('div');
                        div.classList.add('message', m.sender === 'me' ? 'msg-sent' : 'msg-received');
                        div.textContent = m.text;
                        chatBox.appendChild(div);
                    });
                }
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        } else {
             chatBox.innerHTML = '<div class="message msg-received">سلام! این یک پیام تستی است.</div>';
        }
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

function closeChat() { 
    chatRoom.style.display = 'none'; 
    if (chatInputArea) chatInputArea.style.display = 'block'; // برگرداندن نوار پایین
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
    const currentChat = chatTitle.textContent;
    
    if (text === '') return;
    if (currentChat === 'تیم NEX') return; // جلوگیری از ارسال در تیم NEX

    // *** ذخیره در دیتابیس ***
    if (typeof DB !== 'undefined') {
        const chatId = currentChat === 'پیام‌های ذخیره شده' ? 'saved' : currentChat;
        DB.saveMessage(chatId, text, 'me');
    }

    // نمایش پیام روی صفحه
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

// --- 5. لود کردن اطلاعات گروه ---
function loadGroupInfo(groupName) {
    const groups = JSON.parse(localStorage.getItem('nexGroups')) || {};
    const info = groups[groupName];

    if (info) {
        document.getElementById('groupTitleDisplay').textContent = info.name;
        document.getElementById('groupDescription').textContent = info.description;
        
        if (info.type === 'public') {
            document.getElementById('groupLinkDisplay').textContent = '@' + info.link;
        } else {
            document.getElementById('groupLinkDisplay').textContent = 'گروه خصوصی (بدون لینک)';
        }

        const membersList = document.getElementById('groupMemberList');
        if (membersList) {
            membersList.innerHTML = '';
            membersList.innerHTML += `<div class="member-item"><div class="member-avatar bg-blue">ش</div><div class="member-name">شما (مدیر)</div></div>`;
            info.members.forEach(m => {
                membersList.innerHTML += `<div class="member-item"><div class="member-avatar bg-gray">${m[0]}</div><div class="member-name">${m}</div></div>`;
            });
        }

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

// --- 6. خروج ---
function logout() {
    localStorage.removeItem('nexUser');
    location.reload();
                                                                  }
