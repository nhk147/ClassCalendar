// ==========================================
// RENDERER
// Nhận Model từ Calendar và Render ra DOM (HTML)
// ==========================================

const Renderer = {

    // Helper: Map icons and colors
    _getEventStyles: (event) => {
        const colorObj = window.ColorManager.getColorForTags(event.tags);
        return colorObj;
    },

    _buildEventContent: (event, colorObj) => {
        let iconsHtml = '';
        if (event.priority === window.CONSTANTS.PRIORITY.HIGH) iconsHtml += window.Icons.PRIORITY_HIGH;
        if (event.location && event.location.toLowerCase().includes('online')) iconsHtml += '🌍';

        const mapPerson = (p, icon, isBold) => `<span style="color: ${window.ColorManager.getTextColorForPerson(p)}; font-weight: ${isBold ? '800' : '500'};">${icon} ${p}</span>`;
        
        let pmList = event.trainers && event.trainers.length > 0 ? event.trainers.map(p => mapPerson(p, window.Icons.ROLE_TRAINER, true)).join(', ') : '';
        if (!pmList && event.coordinators && event.coordinators.length > 0) {
            pmList = event.coordinators.map(p => mapPerson(p, window.Icons.ROLE_COORDINATOR, true)).join(', ');
        }
        const giangVienList = event.lecturers && event.lecturers.length > 0 ? event.lecturers.map(p => mapPerson(p, window.Icons.ROLE_LECTURER, true)).join(', ') : '';
        
        const line2Arr = [];
        if (pmList) line2Arr.push(pmList);
        if (giangVienList) line2Arr.push(giangVienList);
        const line2 = line2Arr.join(' - ');
        
        const overviewLoc = event.location ? ` <span style="margin-left: 4px;">${window.Icons.LOCATION} ${event.location}</span>` : '';
        const tags = event.tags ? event.tags.map(t => `[${t}]`).join(' ') : '';

        // --- Màn hình Chi tiết (Detail View) cho Monthly ---
        const detailLocation = event.location ? ` - ${window.Icons.LOCATION} ${event.location}` : '';

        const detailLine2Arr = [];
        if (event.trainers && event.trainers.length > 0) {
            detailLine2Arr.push(`${window.Icons.ROLE_TRAINER} ${event.trainers.join(', ')}`);
        }
        if (event.lecturers && event.lecturers.length > 0) {
            detailLine2Arr.push(`${window.Icons.ROLE_LECTURER} ${event.lecturers.join(', ')}`);
        }
        if (event.coordinators && event.coordinators.length > 0) {
            detailLine2Arr.push(`${window.Icons.ROLE_COORDINATOR} ${event.coordinators.join(', ')}`);
        }
        if (event.rolesDisplay) {
            detailLine2Arr.push(`💼 ${event.rolesDisplay}`);
        }
        const detailLine2 = detailLine2Arr.join(' - ');

        const detailLine3 = event.audience ? `👥 Đối tượng: ${event.audience}` : '';

        return { iconsHtml, line2, tags, detailLocation, detailLine2, detailLine3, overviewLoc };
    },

    // Hiển thị Month View
    renderMonthView: (monthModel) => {
        const container = document.getElementById('calendar-grid-month');
        if (!container) return;

        // Hide others
        document.querySelectorAll('.view-layer').forEach(el => el.classList.add('hidden'));
        container.classList.remove('hidden');

        const rowHeight = 75; // px per row
        const baseHeight = 120; // min height per week
        let html = '<div class="calendar-header-days">';
        ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach(d => html += `<div class="day-label">${d}</div>`);
        html += '</div><div class="calendar-body">';

        monthModel.forEach(week => {
            const neededHeight = (week.maxRow + 1) * rowHeight + 40;
            const finalHeight = Math.max(baseHeight, neededHeight);

            html += `<div class="calendar-week" style="height: ${finalHeight}px"><div class="week-bg-grid">`;
            week.days.forEach(day => {
                const isTodayClass = day.isToday ? 'is-today' : '';
                const isCurrentMonthClass = day.isCurrentMonth ? '' : 'not-current-month';
                html += `<div class="day-cell ${isTodayClass} ${isCurrentMonthClass}">
                            <div class="day-number">${day.dateObj.getDate()}</div>
                         </div>`;
            });
            html += `</div><div class="week-events-layer">`;
            
            week.events.forEach(event => {
                const colorObj = Renderer._getEventStyles(event);
                const widthPercent = (event.span / 7) * 100;
                const leftPercent = (event.colIndex / 7) * 100;
                const topPx = event.row * rowHeight + 36;
                const { iconsHtml, line2, detailLocation, detailLine2, detailLine3, overviewLoc } = Renderer._buildEventContent(event, colorObj);
                const safeEventObj = JSON.stringify(event).replace(/"/g, '&quot;');
                
                html += `
                <div class="event-span" 
                     style="left: ${leftPercent}%; width: calc(${widthPercent}% - 6px); top: ${topPx}px; background-color: ${colorObj.bg}; color: ${colorObj.text}; border-left: 3px solid ${colorObj.border};"
                     data-event="${safeEventObj}"
                     onclick="window.Popup.showEventDetails(this)"
                     oncontextmenu="window.App.hideEvent(event, this)">
                    <div class="event-content">
                        <!-- Overview View -->
                        <div class="view-overview">
                            <div class="event-line event-title">${iconsHtml} ${event.title}${overviewLoc}</div>
                            ${event.showDetails !== false && line2 ? `<div class="event-line text-xs">${line2}</div>` : ''}
                        </div>
                        <!-- Detail View -->
                        <div class="view-detail">
                            <div class="event-line event-title">${iconsHtml} ${event.title}${detailLocation}</div>
                            ${event.showDetails !== false && detailLine2 ? `<div class="event-line text-xs">${detailLine2}</div>` : ''}
                            ${event.showDetails !== false && detailLine3 ? `<div class="event-line text-xs">${detailLine3}</div>` : ''}
                        </div>
                    </div>
                </div>`;
            });
            html += `</div></div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    // Hiển thị Week View (Đơn giản: 7 cột, stack vertical)
    renderWeekView: (data) => {
        const container = document.getElementById('calendar-grid-week');
        if (!container) return;
        document.querySelectorAll('.view-layer').forEach(el => el.classList.add('hidden'));
        container.classList.remove('hidden');

        // Tìm thứ 2 của tuần được chọn
        let weekStart;
        if (window.App && window.App.state && window.App.state.currentWeekStart) {
            weekStart = new Date(window.App.state.currentWeekStart);
        } else {
            const today = new Date();
            if (today.getFullYear() === window.Calendar.currentYear && today.getMonth() === window.Calendar.currentMonth) {
                weekStart = new Date(today);
            } else {
                weekStart = new Date(window.Calendar.currentYear, window.Calendar.currentMonth, 1);
            }
        }
        
        while (weekStart.getDay() !== 1) { // 1 là thứ 2
            weekStart.setDate(weekStart.getDate() - 1);
        }
        
        let html = '<div class="week-view-container" style="display: flex; height: 100%;">';
        const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + i);
            const dateStr = window.DateUtils.formatDate(currentDate);
            
            // Tìm các sự kiện rơi vào ngày này
            const dayEvents = data.filter(e => {
                const s = window.DateUtils.formatDate(e.startDate);
                const end = window.DateUtils.formatDate(e.endDate);
                return dateStr >= s && dateStr <= end;
            });

            html += `<div class="week-day-col" style="flex: 1; border-right: 1px solid var(--border-color); display: flex; flex-direction: column;">
                        <div class="week-day-header" style="padding: 12px; text-align: center; border-bottom: 1px solid var(--border-color); background: var(--bg-surface);">
                            <div style="font-weight: 600;">${days[i]}</div>
                            <div style="font-size: 1.2rem; color: var(--text-muted);">${currentDate.getDate()}</div>
                        </div>
                        <div class="week-day-events" style="flex: 1; padding: 8px; overflow-y: auto; background: var(--bg-primary);">`;
            
            dayEvents.forEach(event => {
                const colorObj = Renderer._getEventStyles(event);
                const { iconsHtml, line2 } = Renderer._buildEventContent(event, colorObj);
                const safeEventObj = JSON.stringify(event).replace(/"/g, '&quot;');
                
                html += `
                <div class="event-span-week" 
                     style="margin-bottom: 8px; padding: 8px; border-radius: 6px; background-color: ${colorObj.bg}; color: ${colorObj.text}; border-left: 3px solid ${colorObj.border}; cursor: pointer; box-shadow: var(--shadow-sm);"
                     data-event="${safeEventObj}"
                     onclick="window.Popup.showEventDetails(this)">
                    <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px;">${iconsHtml} ${event.title}</div>
                    <div style="font-size: 0.75rem; opacity: 0.9;">${line2}</div>
                    <div style="font-size: 0.75rem; font-weight: bold; margin-top: 4px;">${event.time}</div>
                </div>`;
            });

            html += `</div></div>`;
        }
        html += '</div>';
        container.innerHTML = html;
    },

    // Hiển thị Agenda View (Danh sách)
    renderAgendaView: (data) => {
        const container = document.getElementById('calendar-grid-agenda');
        if (!container) return;
        document.querySelectorAll('.view-layer').forEach(el => el.classList.add('hidden'));
        container.classList.remove('hidden');

        // Lọc theo tháng hiện tại
        const filteredByMonth = data.filter(e => {
            const mStart = new Date(window.Calendar.currentYear, window.Calendar.currentMonth, 1);
            const mEnd = new Date(window.Calendar.currentYear, window.Calendar.currentMonth + 1, 0, 23, 59, 59);
            return e.startDate <= mEnd && e.endDate >= mStart;
        });

        // Sắp xếp các sự kiện theo ngày bắt đầu
        const sortedData = [...filteredByMonth].sort((a, b) => a.startDate - b.startDate);
        
        let html = '<div class="agenda-view-container" style="padding: 24px; overflow-y: auto; height: 100%;">';
        
        let currentMonthStr = '';
        
        sortedData.forEach(event => {
            const mStr = `${event.startDate.getMonth() + 1}/${event.startDate.getFullYear()}`;
            if (mStr !== currentMonthStr) {
                html += `<h3 style="margin-top: 24px; margin-bottom: 12px; border-bottom: 2px solid var(--border-color); padding-bottom: 8px; color: var(--primary-color);">Tháng ${mStr}</h3>`;
                currentMonthStr = mStr;
            }

            const colorObj = Renderer._getEventStyles(event);
            const { iconsHtml, line2 } = Renderer._buildEventContent(event, colorObj);
            const dateDisplay = `${window.DateUtils.formatDate(event.startDate)} ${event.startDate.getTime() !== event.endDate.getTime() ? '- ' + window.DateUtils.formatDate(event.endDate) : ''}`;
            const safeEventObj = JSON.stringify(event).replace(/"/g, '&quot;');

            html += `
            <div class="agenda-item" 
                 style="display: flex; gap: 16px; margin-bottom: 12px; padding: 16px; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); cursor: pointer;"
                 data-event="${safeEventObj}"
                 onclick="window.Popup.showEventDetails(this)">
                <div class="agenda-date" style="width: 120px; font-weight: 600; color: var(--text-secondary); flex-shrink: 0;">
                    <div>${dateDisplay}</div>
                    <div style="font-size: 0.8rem; font-weight: 400; margin-top: 4px;">${event.time}</div>
                </div>
                <div class="agenda-details" style="flex: 1; border-left: 4px solid ${colorObj.border}; padding-left: 16px;">
                    <div style="font-weight: 600; font-size: 1rem; color: ${colorObj.text}; margin-bottom: 4px;">${iconsHtml} ${event.title}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">${line2}</div>
                    <div style="font-size: 0.8rem; margin-top: 8px; display: inline-block; padding: 2px 8px; background: ${colorObj.bg}; border-radius: 12px;">Tag: ${event.tags.join(', ')}</div>
                </div>
            </div>`;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    renderMiniCalendar: (monthModel) => {
        const mcGrid = document.getElementById('mc-grid');
        if (!mcGrid) return;
        
        let html = '';
        monthModel.forEach(week => {
            week.days.forEach(day => {
                const d = day.dateObj.getDate();
                const todayClass = day.isToday ? 'active' : '';
                const currMonth = day.isCurrentMonth ? '' : 'style="opacity: 0.3;"';
                const dateStr = window.DateUtils.formatDate(day.dateObj);
                html += `<span class="${todayClass}" ${currMonth} data-date="${dateStr}" style="cursor:pointer;">${d}</span>`;
            });
        });
        mcGrid.innerHTML = html;
    },

    showLoading: () => document.getElementById('loading-overlay').classList.remove('hidden'),
    hideLoading: () => document.getElementById('loading-overlay').classList.add('hidden'),

    showToast: (message, type = 'info') => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, window.CONSTANTS.UI.TOAST_DURATION);
    },
    
    // For compatibility with app.js
    renderHeaderDays: () => {}
};

window.Renderer = Renderer;
