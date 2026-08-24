// ==========================================
// POPUP
// Xử lý hiển thị thông tin chi tiết sự kiện khi click
// ==========================================

const Popup = {
    init: () => {
        // Đăng ký event đóng popup
        const overlay = document.getElementById('event-popup-overlay');
        const btnClose = document.getElementById('btn-close-popup');
        const btnCopy = document.getElementById('btn-copy-event');

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) Popup.hide();
            });
        }
        if (btnClose) {
            btnClose.addEventListener('click', Popup.hide);
        }
        
        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                const body = document.getElementById('popup-body');
                const textToCopy = body.innerText;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    window.Renderer.showToast('Đã sao chép vào clipboard', 'success');
                }).catch(err => {
                    console.error('Lỗi copy:', err);
                });
            });
        }
        
        const btnUnhide = document.getElementById('btn-unhide-event');
        if (btnUnhide) {
            btnUnhide.addEventListener('click', () => {
                const eventId = btnUnhide.getAttribute('data-id');
                if (eventId && window.App) {
                    window.App.unhideEvent(eventId);
                    Popup.hide();
                }
            });
        }
    },

    showEventDetails: (element) => {
        const eventData = JSON.parse(element.getAttribute('data-event'));
        if (!eventData) return;

        document.getElementById('popup-title').textContent = eventData.title;

        const dateStr = window.DateUtils.isSameDay(new Date(eventData.startDate), new Date(eventData.endDate)) 
            ? window.DateUtils.formatDate(new Date(eventData.startDate))
            : `${window.DateUtils.formatDate(new Date(eventData.startDate))} - ${window.DateUtils.formatDate(new Date(eventData.endDate))}`;

        let bodyHtml = `
            <div class="popup-detail-row">
                <span class="icon">${window.Icons.DATE}</span>
                <span><strong>Ngày:</strong> ${dateStr}</span>
            </div>
            ${eventData.time ? `
            <div class="popup-detail-row">
                <span class="icon">${window.Icons.TIME}</span>
                <span><strong>Thời gian:</strong> ${eventData.time}</span>
            </div>` : ''}
            <div class="popup-detail-row">
                <span class="icon">${window.Icons.LOCATION}</span>
                <span><strong>Địa điểm:</strong> ${eventData.location}</span>
            </div>
            ${eventData.studentCount ? `
            <div class="popup-detail-row">
                <span class="icon">👨‍🎓</span>
                <span><strong>Số lượng:</strong> ${eventData.studentCount} học viên</span>
            </div>` : ''}
            ${eventData.tags && eventData.tags.length > 0 ? `
            <div class="popup-detail-row">
                <span class="icon">🏷️</span>
                <span><strong>Loại đào tạo:</strong> ${eventData.tags.join(', ')}</span>
            </div>` : ''}
        `;

        // Nhân sự
        const trainers = eventData.trainers.map(t => window.Icons.renderRole(window.CONSTANTS.ROLES.TRAINER, t));
        const lecturers = eventData.lecturers.map(l => window.Icons.renderRole(window.CONSTANTS.ROLES.LECTURER, l));
        const coordinators = eventData.coordinators.map(c => window.Icons.renderRole(window.CONSTANTS.ROLES.COORDINATOR, c));
        
        const allPeople = [...trainers, ...lecturers, ...coordinators];
        if (allPeople.length > 0) {
            bodyHtml += `
            <div class="popup-detail-row people-row">
                <span class="icon">${window.Icons.GROUP}</span>
                <div class="people-tags">${allPeople.join('')}</div>
            </div>`;
        }

        if (eventData.audience) {
            bodyHtml += `
            <div class="popup-detail-row">
                <span class="icon">🎯</span>
                <span><strong>Đối tượng:</strong> ${eventData.audience}</span>
            </div>`;
        }
        
        if (eventData.zoomLink) {
            bodyHtml += `
            <div class="popup-detail-row">
                <span class="icon">${window.Icons.LINK}</span>
                <span><a href="${eventData.zoomLink}" target="_blank">Link Trực tuyến</a></span>
            </div>`;
        }

        if (eventData.note) {
            bodyHtml += `
            <div class="popup-detail-row">
                <span class="icon">${window.Icons.NOTE}</span>
                <span><strong>Ghi chú:</strong> ${eventData.note}</span>
            </div>`;
        }

        document.getElementById('popup-body').innerHTML = bodyHtml;

        // Xử lý nút Unhide
        const btnUnhide = document.getElementById('btn-unhide-event');
        if (btnUnhide) {
            if (window.App && window.App.state && window.App.state.hiddenEventIds && window.App.state.hiddenEventIds.has(eventData.id)) {
                btnUnhide.classList.remove('hidden');
                btnUnhide.setAttribute('data-id', eventData.id);
            } else {
                btnUnhide.classList.add('hidden');
            }
        }

        // Show
        document.getElementById('event-popup-overlay').classList.remove('hidden');
    },

    hide: () => {
        document.getElementById('event-popup-overlay').classList.add('hidden');
    }
};

window.Popup = Popup;
