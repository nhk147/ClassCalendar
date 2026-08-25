// ==========================================
// LAYOUT ENGINE
// Thuật toán sắp xếp sự kiện không bị đè lên nhau (Greedy Coloring / Sweep Line / Interval Graph)
// ==========================================

const LayoutEngine = {
    // Sắp xếp các sự kiện trong một tuần
    // Trả về mảng các sự kiện đã được gán 'row' (từ 0 đến n) để không bị đè nhau
    // Đầu vào: mảng sự kiện trong 1 tuần, startDate và endDate của tuần đó
    computeWeekLayout: (events, weekStart, weekEnd) => {
        if (!events || events.length === 0) return [];

        // 1. Lọc các sự kiện diễn ra trong tuần này
        const weekEvents = events.filter(e => {
            return e.startDate <= weekEnd && e.endDate >= weekStart;
        }).map(e => {
            // Giới hạn startDate và endDate trong phạm vi tuần này để render
            const renderStart = e.startDate < weekStart ? new Date(weekStart) : new Date(e.startDate);
            const renderEnd = e.endDate > weekEnd ? new Date(weekEnd) : new Date(e.endDate);
            
            // Tính số ngày (span)
            const span = window.DateUtils.daysBetween(renderStart, renderEnd);
            
            // Tính index cột (0 = Thứ 2, 6 = Chủ nhật)
            let colIndex = renderStart.getDay() - 1; // 0 (CN) -> -1, 1 (T2) -> 0
            if (colIndex < 0) colIndex = 6;

            return {
                ...e,
                originalEvent: e,
                renderStart,
                renderEnd,
                span,
                colIndex,
                row: -1 // Sẽ được tính sau
            };
        });

        // 2. Sort sự kiện ưu tiên kéo dài nhiều ngày trước, sau đó là bắt đầu sớm
        weekEvents.sort((a, b) => {
            if (a.span !== b.span) return b.span - a.span;
            if (a.colIndex !== b.colIndex) return a.colIndex - b.colIndex;
            return a.title.localeCompare(b.title); // Nếu cùng ngày, cùng độ dài thì sort theo tên
        });

        // 3. Xếp row
        const rowUsage = []; // rowUsage[row][col] = true/false

        weekEvents.forEach(e => {
            let row = 0;
            let placed = false;
            
            while (!placed) {
                // Kiểm tra xem row hiện tại từ colIndex đến (colIndex + span - 1) có trống không
                let isFree = true;
                if (!rowUsage[row]) rowUsage[row] = Array(7).fill(false);
                
                for (let i = 0; i < e.span; i++) {
                    const cIdx = e.colIndex + i;
                    if (cIdx < 7 && rowUsage[row][cIdx]) {
                        isFree = false;
                        break;
                    }
                }

                if (isFree) {
                    // Đặt vào row này
                    e.row = row;
                    for (let i = 0; i < e.span; i++) {
                        const cIdx = e.colIndex + i;
                        if (cIdx < 7) {
                            rowUsage[row][cIdx] = true;
                        }
                    }
                    placed = true;
                } else {
                    row++;
                }
            }
        });

        return weekEvents;
    }
};

window.LayoutEngine = LayoutEngine;
