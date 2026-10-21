function openChat(name, type) {
    const chatTitle = document.getElementById('chatRoomTitle');
    const chatRoom = document.getElementById('chatRoom');
    const chatBox = document.getElementById('chatBox');
    const chatInputContainer = document.getElementById('chatInputContainer');
    
    chatTitle.textContent = name;
    chatRoom.style.display = 'flex';
    chatBox.innerHTML = ''; // پاک کردن پیام‌های قبلی

    // ۱. مدیریت چت تیم NEX (غیرفعال کردن کادر تایپ و نمایش پیام)
    if (type === 'nex') {
        chatInputContainer.classList.add('disabled');
        chatBox.innerHTML = `
            <div class="message msg-received" style="background: #2a9df4; color: white;">
                سلام! به پیام‌رسان <b>NEX</b> خوش آمدید. 🎉<br><br>
                این یک پیام سیستم است. امکان ارسال پیام در این چت وجود ندارد.
            </div>`;
    } 
    // ۲. مدیریت پیام‌های ذخیره شده (فعال بودن کادر تایپ)
    else if (type === 'saved') {
        chatInputContainer.classList.remove('disabled');
        chatBox.innerHTML = `
            <div class="message msg-received" style="background: transparent; color: #7f91a4; text-align: center; align-self: center; margin-top: 50px;">
                <i class="fas fa-bookmark" style="font-size: 30px; margin-bottom: 10px;"></i><br>
                اینجا فضای شخصی شماست. هر چیزی می‌خواهید برای خودتان ذخیره کنید.
            </div>`;
    } 
    // ۳. چت‌های عادی (مثل عرفان یا گروه‌ها)
    else {
        chatInputContainer.classList.remove('disabled');
        chatBox.innerHTML = '<div class="message msg-received">سلام! این یک پیام تستی است.</div>';
    }
    
    chatBox.scrollTop = chatBox.scrollHeight;
}
