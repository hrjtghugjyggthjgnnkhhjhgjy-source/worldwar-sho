// --- فایل اختصاصی مدیریت دیتابیس (IndexedDB) ---

const DB_NAME = 'NexDatabase';
const DB_VERSION = 1;
let db;

// ۱. باز کردن و ساخت دیتابیس
function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("خطا در باز کردن دیتابیس:", event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("دیتابیس با موفقیت متصل شد.");
            resolve(db);
        };

        // ساخت جدول (Object Store) در اولین بار
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('messages')) {
                db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// ۲. ذخیره پیام جدید
function saveMessage(chatId, text, sender) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("دیتابیس متصل نیست");

        const transaction = db.transaction(['messages'], 'readwrite');
        const store = transaction.objectStore('messages');

        const messageData = {
            chatId: chatId,
            text: text,
            sender: sender, // 'me' یا 'other'
            timestamp: new Date().getTime()
        };

        const request = store.add(messageData);

        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
    });
}

// ۳. خواندن پیام‌های یک چت
function getMessages(chatId) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("دیتابیس متصل نیست");

        const transaction = db.transaction(['messages'], 'readonly');
        const store = transaction.objectStore('messages');
        const request = store.getAll();

        request.onsuccess = () => {
            // فیلتر کردن پیام‌هایی که مربوط به این چت هستن
            const allMessages = request.result;
            const chatMessages = allMessages
                .filter(m => m.chatId === chatId)
                .sort((a, b) => a.timestamp - b.timestamp); // مرتب‌سازی بر اساس زمان
            resolve(chatMessages);
        };

        request.onerror = (e) => reject(e.target.error);
    });
}

// راه‌اندازی دیتابیس در اولین بار
initDatabase();
