// ==========================================
// COLOR MANAGER
// Sinh và quản lý màu sắc dựa trên nội dung (Tag, Nhân sự)
// ==========================================

const ColorManager = {
    // Dynamic Tag Colors Pool
    tagPalette: [
        { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' }, // 1. Red
        { bg: '#dcfce7', text: '#15803d', border: '#86efac' }, // 2. Green
        { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' }, // 3. Blue
        { bg: '#ffedd5', text: '#c2410c', border: '#fdba74' }, // 4. Orange
        { bg: '#f3e8ff', text: '#7e22ce', border: '#d8b4fe' }, // 5. Purple
        { bg: '#fef9c3', text: '#a16207', border: '#fde047' }, // 6. Yellow
        { bg: '#fce7f3', text: '#be185d', border: '#f9a8d4' }, // 7. Pink
        { bg: '#cffafe', text: '#0f766e', border: '#67e8f9' }, // 8. Cyan
        { bg: '#f5ebe0', text: '#78350f', border: '#e3d5ca' }, // 9. Brown
        { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' }  // 10. Slate (Grey)
    ],
    
    dynamicTagMap: {},

    dynamicPersonMap: {},

    // 10 Text Colors cho danh sách Nhân sự chạy tự động
    personPalette: [
        '#d32f2f', // 1. Red
        '#1976d2', // 2. Blue
        '#388e3c', // 3. Green
        '#7b1fa2', // 4. Purple
        '#f57c00', // 5. Orange
        '#00796b', // 6. Teal / Cyan
        '#5d4037', // 7. Brown
        '#c2185b', // 8. Pink
        '#afb42b', // 9. Olive / Lime
        '#455a64'  // 10. Blue Grey
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
