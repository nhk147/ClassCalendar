// ==========================================
// COLOR MANAGER
// Sinh và quản lý màu sắc dựa trên nội dung (Tag, Nhân sự)
// ==========================================

const ColorManager = {
    // Dynamic Tag Colors Pool
    tagPalette: [
        { bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5' }, // 1. Đỏ (Red)
        { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' }, // 2. Cam (Orange)
        { bg: '#fefce8', text: '#a16207', border: '#fde047' }, // 3. Vàng (Yellow)
        { bg: '#f0fdf4', text: '#15803d', border: '#86efac' }, // 4. Green
        { bg: '#f7fee7', text: '#4d7c0f', border: '#bef264' }, // 5. Lime
        { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' }, // 6. Xanh navy (Indigo)
        { bg: '#f0f9ff', text: '#0369a1', border: '#7dd3fc' }, // 7. Xanh da trời (Sky)
        { bg: '#f8fafc', text: '#334155', border: '#cbd5e1' }, // 8. Xám (Slate)
        { bg: '#faf5ff', text: '#7e22ce', border: '#d8b4fe' }, // 9. Tím (Purple)
        { bg: '#fdf2f8', text: '#be185d', border: '#f9a8d4' }, // 10. Hồng (Pink)
        { bg: '#fff5f0', text: '#c05621', border: '#ffcbb3' }  // 11. Đào (Peach)
    ],
    
    dynamicTagMap: {},

    dynamicPersonMap: {},

    // 10 Text Colors cho danh sách Nhân sự chạy tự động
    personPalette: [
        '#7f1d1d', // 1. Đỏ (Red)
        '#7c2d12', // 2. Cam (Orange)
        '#713f12', // 3. Vàng (Yellow)
        '#14532d', // 4. Green
        '#365314', // 5. Lime
        '#312e81', // 6. Xanh navy (Indigo)
        '#0c4a6e', // 7. Xanh da trời (Sky)
        '#0f172a', // 8. Xám (Slate)
        '#581c87', // 9. Tím (Purple)
        '#831843', // 10. Hồng (Pink)
        '#7b341e'  // 11. Đào (Peach)
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
