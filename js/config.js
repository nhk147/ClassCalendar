// ==========================================
// CONFIGURATION
// Toàn bộ cấu hình hệ thống
// ==========================================

const CONFIG = {
    // Data Source Configuration
    DATA_SOURCE: {
        // Thay bằng URL của file CSV (Published to Web) từ Google Sheet để test
        // Định dạng phải là CSV.
        SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRhJmNBP2hG9j9veTI3bIGbmgHaYy_mkB4MriKxjWzcbVvA6ENb9QvOnvzxq2GRaG4NmYsRj7HPt1sR/pub?gid=1882029811&single=true&output=tsv', 
        USE_LOCAL_MOCK: false // Bật cờ này để dùng dữ liệu giả mạo trong quá trình phát triển
    },

    // Google API Configuration (Dành cho Google Picker hoặc Sheets API trong tương lai)
    GOOGLE_API: {
        API_KEY: 'YOUR_API_KEY_HERE',
        CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
        APP_ID: 'YOUR_APP_ID_HERE'
    },

    // System Settings
    SETTINGS: {
        THEME: CONSTANTS.THEME.LIGHT, // Default theme
        LOCALE: 'vi-VN',
        TIMEZONE: 'Asia/Ho_Chi_Minh',
        DEFAULT_VIEW: 'month', // 'month', 'week', 'agenda'
        DEFAULT_FILTER: 'all',
        ANIMATION: true,
        REFRESH_INTERVAL_MS: 5 * 60 * 1000 // 5 phút
    },

    // Default Color Palette (Fallback)
    PALETTE: {
        PRIMARY: '#0A84FF',
        SUCCESS: '#34C759',
        WARNING: '#FF9F0A',
        DANGER: '#FF453A',
        ONLINE: '#8E8E93',
        BACKGROUND_LIGHT: '#F2F2F7',
        BACKGROUND_DARK: '#1C1C1E',
        TEXT_LIGHT: '#000000',
        TEXT_DARK: '#FFFFFF'
    }
};

window.CONFIG = CONFIG;
