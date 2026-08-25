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
        const eventChunks = new Map(); // originalEvent -> array of chunks { weekIdx, span, chunk }

        // Duyệt từng tuần (mỗi tuần 7 ngày)
        for (let weekIdx = 0; weekIdx < 6; weekIdx++) {
            const weekStart = grid[weekIdx * 7].dateObj;
            const weekEnd = grid[weekIdx * 7 + 6].dateObj;

            // Xếp sự kiện cho tuần này
            const layoutedEvents = window.LayoutEngine.computeWeekLayout(filteredEvents, weekStart, weekEnd);
            
            layoutedEvents.forEach(chunk => {
                if (!eventChunks.has(chunk.originalEvent)) {
                    eventChunks.set(chunk.originalEvent, []);
                }
                eventChunks.get(chunk.originalEvent).push({ weekIdx, span: chunk.span, chunk });
            });

            const weekData = {
                days: grid.slice(weekIdx * 7, weekIdx * 7 + 7),
                events: layoutedEvents,
                maxRow: layoutedEvents.length > 0 ? Math.max(...layoutedEvents.map(e => e.row)) : -1
            };

            monthModel.push(weekData);
        }

        // Đánh dấu chunk nào sẽ hiển thị chi tiết (chunk dài nhất, ưu tiên tuần đầu nếu bằng nhau)
        eventChunks.forEach((chunks, originalEvent) => {
            let maxSpan = -1;
            let bestChunk = null;
            chunks.forEach(c => {
                if (c.span > maxSpan) {
                    maxSpan = c.span;
                    bestChunk = c.chunk;
                }
            });
            
            chunks.forEach(c => {
                c.chunk.showDetails = (c.chunk === bestChunk);
            });
        });

        return monthModel;
    }
};

window.Calendar = Calendar;
