// ==========================================
// STORAGE
// Quản lý LocalStorage (Lưu Theme, Filter state, v.v.)
// ==========================================

const Storage = {
    KEYS: {
        THEME: 'bv_calendar_theme',
        VIEW: 'bv_calendar_view'
    },

    save: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage is not available:', e);
        }
    },

    load: (key, defaultValue) => {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }
};

window.Storage = Storage;
