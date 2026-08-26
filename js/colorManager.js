// ==========================================
// COLOR MANAGER
// Sinh và quản lý màu sắc dựa trên nội dung (Tag, Nhân sự)
// ==========================================

const ColorManager = {
    // Dynamic Tag Colors Pool
    tagPalette: [
        { bg: '#FECACA', text: '#B91C1C', border: '#F87171' }, // 1. Đỏ (Red 200/400)
        { bg: '#FED7AA', text: '#C2410C', border: '#FB923C' }, // 2. Cam (Orange 200/400)
        { bg: '#FDE68A', text: '#A16207', border: '#FBBF24' }, // 3. Vàng (Amber 200/400)
        { bg: '#BBF7D0', text: '#15803D', border: '#4ADE80' }, // 4. Xanh lá (Green 200/400)
        { bg: '#99F6E4', text: '#0F766E', border: '#2DD4BF' }, // 5. Xanh ngọc (Teal 200/400)
        { bg: '#BFDBFE', text: '#1D4ED8', border: '#60A5FA' }, // 6. Xanh dương (Blue 200/400)
        { bg: '#C7D2FE', text: '#4338CA', border: '#818CF8' }, // 7. Chàm (Indigo 200/400)
        { bg: '#E9D5FF', text: '#7E22CE', border: '#C084FC' }, // 8. Tím (Purple 200/400)
        { bg: '#FBCFE8', text: '#BE185D', border: '#F472B6' }, // 9. Hồng (Pink 200/400)
        { bg: '#E6D5C3', text: '#8B5E34', border: '#C6A482' }, // 10. Nâu đất (Saturated)
        { bg: '#E2E8F0', text: '#334155', border: '#94A3B8' }  // 11. Xám (Slate 200/400)
    ],

    dynamicTagMap: {},
    dynamicPersonMap: {},
    tagColorIndex: 0,
    personColorIndex: 0,

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
        if (!tags || tags.length === 0) return ColorManager.tagPalette[10]; // Grey

        const firstTag = tags[0].trim();
        const tagLower = firstTag.toLowerCase();

        if (!ColorManager.dynamicTagMap[tagLower]) {
            const index = ColorManager.tagColorIndex % ColorManager.tagPalette.length;
            ColorManager.dynamicTagMap[tagLower] = ColorManager.tagPalette[index];
            ColorManager.tagColorIndex++;
        }

        return ColorManager.dynamicTagMap[tagLower];
    },

    // Hàm tiện ích lấy mã HEX của màu chủ đạo (dùng cho Legend dots)
    getPrimaryColorForTag: (tag) => {
        if (!tag) return ColorManager.tagPalette[10].text;
        const tagLower = tag.trim().toLowerCase();

        if (!ColorManager.dynamicTagMap[tagLower]) {
            const index = ColorManager.tagColorIndex % ColorManager.tagPalette.length;
            ColorManager.dynamicTagMap[tagLower] = ColorManager.tagPalette[index];
            ColorManager.tagColorIndex++;
        }
        return ColorManager.dynamicTagMap[tagLower].text;
    },

    getTextColorForPerson: (personName) => {
        if (!personName) return 'inherit';

        const nameLower = personName.trim().toLowerCase();

        if (!ColorManager.dynamicPersonMap[nameLower]) {
            const colorIndex = ColorManager.personColorIndex % ColorManager.personPalette.length;
            ColorManager.dynamicPersonMap[nameLower] = ColorManager.personPalette[colorIndex];
            ColorManager.personColorIndex++;
        }

        return ColorManager.dynamicPersonMap[nameLower];
    }
};

window.ColorManager = ColorManager;
