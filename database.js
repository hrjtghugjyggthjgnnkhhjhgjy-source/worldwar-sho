const DB_NAME = 'NexDatabase';
const DB_VERSION = 1;
let db;

function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => { db = event.target.result; resolve(db); };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('messages')) db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
        };
    });
}

function saveMessage(chatId, text, sender) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("دیتابیس متصل نیست");
        const transaction = db.transaction(['messages'], 'readwrite');
        const store = transaction.objectStore('messages');
        const request = store.add({ chatId, text, sender, timestamp: Date.now() });
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
    });
}

function getMessages(chatId) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("دیتابیس متصل نیست");
        const transaction = db.transaction(['messages'], 'readonly');
        const store = transaction.objectStore('messages');
        const request = store.getAll();
        request.onsuccess = () => {
            const chatMessages = request.result.filter(m => m.chatId === chatId).sort((a, b) => a.timestamp - b.timestamp);
            resolve(chatMessages);
        };
        request.onerror = (e) => reject(e.target.error);
    });
}
initDatabase();
