// ==========================================
// DATE UTILITIES
// Xử lý toàn bộ logic liên quan đến Date
// Không sử dụng đối tượng Date trực tiếp ở các module khác
// ==========================================

const DateUtils = {
    // Trả về ngày hiện tại (có set về 0h0m0s)
    getToday: () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    },

    // Parse date từ chuỗi định dạng dd/mm/yyyy
    parseDate: (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // JS Date: YYYY, MM (0-indexed), DD
            return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        }
        return new Date(dateStr);
    },

    // Format date ra chuỗi dd/mm/yyyy
    formatDate: (dateObj) => {
        if (!dateObj) return '';
        const d = dateObj.getDate().toString().padStart(2, '0');
        const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const y = dateObj.getFullYear();
        return `${d}/${m}/${y}`;
    },

    // So sánh 2 ngày (chỉ quan tâm ngày, tháng, năm)
    isSameDay: (date1, date2) => {
        if (!date1 || !date2) return false;
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    },

    // Tính số ngày giữa 2 Date (inclusive)
    daysBetween: (startDate, endDate) => {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
    },

    // Sinh ra mảng các ngày trong 1 tháng cụ thể (để hiển thị trên Grid)
    // Grid thường có 42 ô (6 tuần x 7 ngày)
    getMonthGrid: (year, month) => {
        const grid = [];
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        
        // JS getDay(): 0 là Chủ nhật, 1 là Thứ 2
        // Ở VN thường coi Thứ 2 là đầu tuần. Ta cần lùi ngày lại cho phù hợp.
        let startDayOfWeek = firstDayOfMonth.getDay();
        // Chuyển Chủ nhật (0) thành 7 để Thứ 2 là 1
        if (startDayOfWeek === 0) startDayOfWeek = 7;
        
        // Thêm các ngày của tháng trước vào đầu lưới
        const startDate = new Date(year, month, 1 - (startDayOfWeek - 1)); // Lùi lại đến thứ 2 đầu tiên của tuần
        
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            grid.push({
                dateObj: currentDate,
                isCurrentMonth: currentDate.getMonth() === month,
                isToday: DateUtils.isSameDay(currentDate, DateUtils.getToday())
            });
        }
        
        return grid;
    },

    // Lấy tên tháng năm (vd: Tháng 8, 2026)
    getMonthName: (year, month) => {
        return `${window.CONSTANTS.MONTHS[month]} năm ${year}`;
    },

    // Clone date
    clone: (dateObj) => {
        return new Date(dateObj.getTime());
    },

    // Cộng thêm ngày
    addDays: (dateObj, days) => {
        const result = DateUtils.clone(dateObj);
        result.setDate(result.getDate() + days);
        return result;
    }
};

window.DateUtils = DateUtils;
