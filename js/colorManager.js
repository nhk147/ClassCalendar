// ==========================================
// COLOR MANAGER
// Sinh và quản lý màu sắc dựa trên nội dung (Tag, Nhân sự)
// ==========================================

const ColorManager = {
    // Dynamic Tag Colors Pool
    tagPalette: [
        { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' }, // Blue
        { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' }, // Green
        { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' }, // Orange
        { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }, // Red
        { bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff' }, // Purple
        { bg: '#f8fafc', text: '#475569', border: '#cbd5e1' }, // Grey
        { bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8' }, // Pink
        { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' }, // Light Blue
        { bg: '#fefce8', text: '#ca8a04', border: '#fef08a' }, // Yellow
        { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' }  // Teal
    ],
    
    dynamicTagMap: {},

    dynamicPersonMap: {},

    // 10 Text Colors cho danh sách Nhân sự chạy tự động
    personPalette: [
        '#C62828', // Red
        '#1565C0', // Blue
        '#2E7D32', // Green
        '#6A1B9A', // Purple
        '#EF6C00', // Orange
        '#00695C', // Teal
        '#4E342E', // Brown
        '#0277BD', // Light Blue
        '#D84315', // Deep Orange
        '#4527A0'  // Deep Purple
    ],

    // Lấy màu cho Tag đầu tiên tìm thấy
    getColorForTags: (tags) => {
        if (!tags || tags.length === 0) return ColorManager.tagPalette[5]; // Grey
        
        const firstTag = tags[0].trim();
        const tagLower = firstTag.toLowerCase();
        
        if (!ColorManager.dynamicTagMap[tagLower]) {
            const hashVal = window.Hash ? window.Hash.hashString(tagLower) : tagLower.length;
            const index = hashVal % ColorManager.tagPalette.length;
            ColorManager.dynamicTagMap[tagLower] = ColorManager.tagPalette[index];
        }
        
        return ColorManager.dynamicTagMap[tagLower];
    },

    // Hàm tiện ích lấy mã HEX của màu chủ đạo (dùng cho Legend dots)
    getPrimaryColorForTag: (tag) => {
        if (!tag) return ColorManager.tagPalette[5].text;
        const tagLower = tag.trim().toLowerCase();
        
        if (!ColorManager.dynamicTagMap[tagLower]) {
            const hashVal = window.Hash ? window.Hash.hashString(tagLower) : tagLower.length;
            const index = hashVal % ColorManager.tagPalette.length;
            ColorManager.dynamicTagMap[tagLower] = ColorManager.tagPalette[index];
        }
        return ColorManager.dynamicTagMap[tagLower].text;
    },

    getTextColorForPerson: (personName) => {
        if (!personName) return 'inherit';
        
        const nameLower = personName.trim().toLowerCase();
        
        if (!ColorManager.dynamicPersonMap[nameLower]) {
            const hashVal = window.Hash ? window.Hash.hashString(nameLower) : nameLower.length;
            const colorIndex = hashVal % ColorManager.personPalette.length;
            ColorManager.dynamicPersonMap[nameLower] = ColorManager.personPalette[colorIndex];
        }
        
        return ColorManager.dynamicPersonMap[nameLower];
    }
};

window.ColorManager = ColorManager;
