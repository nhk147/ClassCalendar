// ==========================================
// CALENDAR
// Sinh Model cho Lịch (Data Model không dính HTML)
// Kết nối với Layout Engine
// ==========================================

const Calendar = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    eventsData: [], // Lưu trữ data gốc

    prevMonth: () => {
        Calendar.currentMonth--;
        if (Calendar.currentMonth < 0) {
            Calendar.currentMonth = 11;
            Calendar.currentYear--;
        }
        return true;
    },

    nextMonth: () => {
        Calendar.currentMonth++;
        if (Calendar.currentMonth > 11) {
            Calendar.currentMonth = 0;
            Calendar.currentYear++;
        }
        return true;
    },

    goToToday: () => {
        const today = new Date();
        Calendar.currentMonth = today.getMonth();
        Calendar.currentYear = today.getFullYear();
        return true;
    },

    // Sinh Calendar Model theo dữ liệu và tháng hiện tại
    generateMonthModel: (filteredEvents) => {
        // Lấy lưới 42 ô
        const grid = window.DateUtils.getMonthGrid(Calendar.currentYear, Calendar.currentMonth);
        
        const monthModel = [];

        // Duyệt từng tuần (mỗi tuần 7 ngày)
        for (let weekIdx = 0; weekIdx < 6; weekIdx++) {
            const weekStart = grid[weekIdx * 7].dateObj;
            const weekEnd = grid[weekIdx * 7 + 6].dateObj;

            // Xếp sự kiện cho tuần này
            const layoutedEvents = window.LayoutEngine.computeWeekLayout(filteredEvents, weekStart, weekEnd);

            const weekData = {
                days: grid.slice(weekIdx * 7, weekIdx * 7 + 7),
                events: layoutedEvents,
                maxRow: layoutedEvents.length > 0 ? Math.max(...layoutedEvents.map(e => e.row)) : -1
            };

            monthModel.push(weekData);
        }

        return monthModel;
    }
};

window.Calendar = Calendar;
