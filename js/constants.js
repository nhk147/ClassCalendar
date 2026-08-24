// ==========================================
// CONSTANTS
// Các hằng số không được hard-code trong ứng dụng
// ==========================================

const CONSTANTS = {
    // Các mức độ ưu tiên
    PRIORITY: {
        LOW: 'Thấp',
        MEDIUM: 'Trung bình',
        HIGH: 'Cao'
    },

    // Phân loại ngày tháng
    MONTHS: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],
    DAYS_OF_WEEK: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],

    // Các Roles (Vai trò) trong sự kiện đào tạo
    ROLES: {
        LECTURER: 'Giảng viên',
        TRAINER: 'Phụ trách lớp',
        COORDINATOR: 'Đầu mối'
    },

    // Các trạng thái (nếu có sau này)
    STATUS: {
        UPCOMING: 'Sắp diễn ra',
        ONGOING: 'Đang diễn ra',
        COMPLETED: 'Đã kết thúc',
        CANCELED: 'Đã hủy'
    },

    // Theme Options
    THEME: {
        LIGHT: 'light',
        DARK: 'dark'
    },

    // Các hằng số cấu hình UI/UX
    UI: {
        MAX_EVENTS_PER_DAY_CELL: 4, // Số sự kiện tối đa hiển thị trên 1 ô ngày trước khi hiện nút +x more
        TOAST_DURATION: 3000
    }
};

// Export for Vanilla JS (Global scope)
window.CONSTANTS = CONSTANTS;
