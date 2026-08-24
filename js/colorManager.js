// ==========================================
// COLOR MANAGER
// Sinh và quản lý màu sắc dựa trên nội dung (Tag, Nhân sự)
// ==========================================

const ColorManager = {
    // Dynamic Tag Colors Pool
    tagPalette: [
        { bg: '#FEE2E2', text: '#B91C1C', border: '#FCA5A5' }, // 1. Đỏ
        { bg: '#FFEDD5', text: '#C2410C', border: '#FDBA74' }, // 2. Cam
        { bg: '#FEF3C7', text: '#A16207', border: '#FCD34D' }, // 3. Vàng
        { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' }, // 4. Xanh lá
        { bg: '#CCFBF1', text: '#0F766E', border: '#5EEAD4' }, // 5. Xanh ngọc
        { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' }, // 6. Xanh dương
        { bg: '#E0E7FF', text: '#4338CA', border: '#A5B4FC' }, // 7. Chàm
        { bg: '#F3E8FF', text: '#7E22CE', border: '#D8B4FE' }, // 8. Tím
        { bg: '#FCE7F3', text: '#BE185D', border: '#F9A8D4' }, // 9. Hồng
        { bg: '#F5E9DD', text: '#8B5E34', border: '#D6B99A' }, // 10. Nâu đất
        { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1' }  // 11. Xám
    ],

    dynamicTagMap: {},
    dynamicPersonMap: {},

    // Text colors cho danh sách Nhân sự chạy tự động
    personPalette: [
        '#991B1B', // 1. Đỏ
        '#9A3412', // 2. Cam
        '#854D0E', // 3. Vàng
        '#166534', // 4. Xanh lá
        '#115E59', // 5. Xanh ngọc
        '#1E40AF', // 6. Xanh dương
        '#3730A3', // 7. Chàm
        '#6B21A8', // 8. Tím
        '#9D174D', // 9. Hồng
        '#78350F', // 10. Nâu đất
        '#334155'  // 11. Xám
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
