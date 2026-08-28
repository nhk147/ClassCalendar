// ==========================================
// APP ORCHESTRATOR
// Điều phối toàn bộ hoạt động của hệ thống
// ==========================================

const App = {
    // Trạng thái ứng dụng
    state: {
        allEvents: [],
        filteredEvents: [],
        hiddenEventIds: new Set(),
        currentView: 'month', // month | week | agenda
        isDetailView: false,
        currentWeekStart: null // Dùng cho week view
    },

    init: async () => {
        console.log('App: Khởi động hệ thống...');
        
        try {
            // 1. Load Theme & Settings từ Storage
            const savedTheme = window.Storage.load(window.Storage.KEYS.THEME, window.CONFIG.SETTINGS.THEME);
            App.applyTheme(savedTheme);

            const savedDetail = window.Storage.load('bv_calendar_detail', false);
            App.state.isDetailView = savedDetail;
            if (savedDetail) document.querySelector('.app-container').classList.add('is-detail-view');

            // 2. Khởi tạo các event listeners tĩnh (UI tĩnh)
            App.bindEvents();
            if (window.Export) window.Export.init();
            if (window.Popup) window.Popup.init();
            if (window.FilePicker) window.FilePicker.init();

            // 3. Render khung Header của Calendar
            if (window.Renderer && window.Renderer.renderHeaderDays) window.Renderer.renderHeaderDays();

            // 4. Bắt đầu tải dữ liệu
            await App.refreshData();
        } catch (e) {
            console.error("Lỗi nghiêm trọng khi khởi tạo:", e);
        }
    },

    // Thay đổi theme
    applyTheme: (theme) => {
        if (theme === window.CONSTANTS.THEME.DARK) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    },

    // Ẩn 1 sự kiện (khi click chuột phải)
    hideEvent: (event, element) => {
        event.preventDefault(); // Chặn menu chuột phải mặc định
        event.stopPropagation();
        
        try {
            const eventDataStr = element.getAttribute('data-event');
            const eventData = JSON.parse(eventDataStr.replace(/&quot;/g, '"'));
            if (eventData && eventData.id) {
                App.state.hiddenEventIds.add(eventData.id);
                App.updateView();
                window.Renderer.showToast('Đã tạm ẩn sự kiện', 'info');
            }
        } catch(e) { console.error('Error hiding event', e); }
    },

    // Khôi phục sự kiện bị ẩn
    unhideEvent: (eventId) => {
        if (App.state.hiddenEventIds.has(eventId)) {
            App.state.hiddenEventIds.delete(eventId);
            App.updateView();
            window.Renderer.showToast('Đã khôi phục sự kiện', 'success');
        }
    },

    // Lấy dữ liệu và update UI
    refreshData: async () => {
        window.Renderer.showLoading();
        try {
            const data = await window.DataLoader.loadData();
            App.state.allEvents = data;
            
            // Render Giao diện Bộ lọc dựa trên dữ liệu thật
            window.Filters.renderFilterUI(data);

            // Render ban đầu
            App.updateView();
            
            window.Renderer.showToast('Tải dữ liệu thành công', 'success');
        } catch (err) {
            window.Renderer.showToast('Lỗi tải dữ liệu. Vui lòng thử lại!', 'danger');
        } finally {
            window.Renderer.hideLoading();
        }
    },

    // Tính toán Thống kê cho Dashboard
    updateDashboardStats: (data) => {
        let totalCourses = data.length;
        let totalExams = 0;
        let trainersSet = new Set();
        let totalStudents = 0;

        data.forEach(event => {
            if (event.tags && event.tags.some(t => t.toLowerCase().includes('sát hạch'))) {
                totalExams++;
            }
            if (event.trainers) event.trainers.forEach(t => trainersSet.add(t));
            if (event.lecturers) event.lecturers.forEach(t => trainersSet.add(t));
            
            if (event.studentCount) totalStudents += event.studentCount;
        });

        document.getElementById('stat-courses').textContent = totalCourses;
        document.getElementById('stat-exams').textContent = totalExams;
        document.getElementById('stat-trainers').textContent = trainersSet.size;
        document.getElementById('stat-students').textContent = totalStudents;
    },

    // Chuyển đổi View
    switchView: (viewName) => {
        App.state.currentView = viewName;
        
        // Update active class on all view switchers
        document.querySelectorAll('.btn-view, .btn-view-tab').forEach(btn => {
            if (btn.dataset.view === viewName) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        App.updateView();
    },

    // Cập nhật lại UI dựa trên state (Month, Filter, Search)
    updateView: () => {
        // 1. Áp dụng Filter & Search
        let currentData = App.state.allEvents;
        currentData = window.Filters.applyFilters(currentData);
        currentData = window.Search.applySearch(currentData);
        App.state.filteredEvents = currentData;

        // Lưu vào Calendar engine
        window.Calendar.eventsData = currentData;

        // Update Stats
        App.updateDashboardStats(currentData);

        // Update Title Month
        const monthTitle = window.DateUtils.getMonthName(window.Calendar.currentYear, window.Calendar.currentMonth);
        document.getElementById('current-month-display').innerHTML = `${monthTitle} <span>⌄</span>`;
        document.getElementById('mc-title').textContent = monthTitle;

        // 2. Sinh Model
        const monthModel = window.Calendar.generateMonthModel(currentData);

        // 3. Render dựa trên view
        window.Renderer.renderMiniCalendar(monthModel);

        // Update Filter Visibility dynamically based on unfiltered events in the current month
        const isEventInCurrentMonth = (e) => {
            const mStart = new Date(window.Calendar.currentYear, window.Calendar.currentMonth, 1);
            const mEnd = new Date(window.Calendar.currentYear, window.Calendar.currentMonth + 1, 0, 23, 59, 59);
            return e.startDate <= mEnd && e.endDate >= mStart;
        };
        const eventsInMonth = App.state.allEvents.filter(isEventInCurrentMonth);
        if (window.Filters.updateFilterVisibility) window.Filters.updateFilterVisibility(eventsInMonth);

        if (App.state.currentView === 'month') {
            window.Renderer.renderMonthView(monthModel);
        } else if (App.state.currentView === 'week') {
            window.Renderer.renderWeekView(currentData); // Pass raw filtered data
        } else if (App.state.currentView === 'agenda') {
            window.Renderer.renderAgendaView(currentData);
        }
    },

    // Đăng ký các sự kiện tương tác
    bindEvents: () => {
        // Theme toggle
        const btnTheme = document.getElementById('btn-theme-toggle');
        if (btnTheme) {
            btnTheme.addEventListener('click', () => {
                const isDark = document.body.classList.contains('dark-theme');
                const newTheme = isDark ? window.CONSTANTS.THEME.LIGHT : window.CONSTANTS.THEME.DARK;
                App.applyTheme(newTheme);
                window.Storage.save(window.Storage.KEYS.THEME, newTheme);
            });
        }

        // View Switchers
        document.querySelectorAll('.btn-view, .btn-view-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                App.switchView(e.target.dataset.view);
            });
        });
        
        // Fullscreen toggle
        const btnFullscreen = document.getElementById('btn-fullscreen');
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.log(`Error attempting to enable fullscreen mode: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
        }

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                document.body.classList.add('is-fullscreen-calendar');
            } else {
                document.body.classList.remove('is-fullscreen-calendar');
            }
        });

        // Sync button
        const btnSync = document.getElementById('btn-sync');
        if (btnSync) {
            btnSync.addEventListener('click', App.refreshData);
        }

        // Toggle Detail button
        const btnToggleDetail = document.getElementById('btn-toggle-detail');
        if (btnToggleDetail) {
            btnToggleDetail.addEventListener('click', () => {
                App.state.isDetailView = !App.state.isDetailView;
                const container = document.querySelector('.app-container');
                if (container) {
                    if (App.state.isDetailView) container.classList.add('is-detail-view');
                    else container.classList.remove('is-detail-view');
                }
                window.Storage.save('bv_calendar_detail', App.state.isDetailView);
                App.updateView();
            });
        }
        
        // Toggle Dashboard button
        const btnToggleDashboard = document.getElementById('btn-toggle-dashboard');
        if (btnToggleDashboard) {
            btnToggleDashboard.addEventListener('click', () => {
                const stats = document.getElementById('dashboard-stats');
                if (stats) {
                    if (stats.classList.contains('hidden')) {
                        stats.classList.remove('hidden');
                        btnToggleDashboard.textContent = '^';
                    } else {
                        stats.classList.add('hidden');
                        btnToggleDashboard.textContent = 'v';
                    }
                }
            });
        }
        
        // Mini Calendar click day
        const mcGrid = document.getElementById('mc-grid');
        if (mcGrid) {
            mcGrid.addEventListener('click', (e) => {
                if (e.target.tagName === 'SPAN') {
                    const dateStr = e.target.getAttribute('data-date'); // expected format: yyyy-mm-dd
                    if (dateStr) {
                        const clickedDate = window.DateUtils.parseDate(dateStr);
                        if (clickedDate) {
                            window.Calendar.currentYear = clickedDate.getFullYear();
                            window.Calendar.currentMonth = clickedDate.getMonth();
                            App.state.currentWeekStart = clickedDate;
                            // Nếu đang ở month, có thể chuyển sang week view hoặc giữ nguyên
                            // Nhưng theo yêu cầu, chuyển sang week view sẽ hợp lý
                            App.switchView('week');
                        }
                    }
                }
            });
        }

        // Month Navigation (Main & Mini)
        const bindNav = (prevId, nextId, todayId) => {
            const btnPrev = document.getElementById(prevId);
            const btnNext = document.getElementById(nextId);
            const btnToday = document.getElementById(todayId);

            if (btnPrev) btnPrev.addEventListener('click', () => {
                window.Calendar.currentMonth--;
                if (window.Calendar.currentMonth < 0) {
                    window.Calendar.currentMonth = 11;
                    window.Calendar.currentYear--;
                }
                App.updateView();
            });

            if (btnNext) btnNext.addEventListener('click', () => {
                window.Calendar.currentMonth++;
                if (window.Calendar.currentMonth > 11) {
                    window.Calendar.currentMonth = 0;
                    window.Calendar.currentYear++;
                }
                App.updateView();
            });

            if (btnToday) btnToday.addEventListener('click', () => {
                window.Calendar.currentMonth = new Date().getMonth();
                window.Calendar.currentYear = new Date().getFullYear();
                App.updateView();
            });
        };

        bindNav('btn-prev-month', 'btn-next-month', 'btn-today');
        bindNav('btn-mc-prev', 'btn-mc-next', null);
        bindNav('btn-dh-prev-month', 'btn-dh-next-month', null);

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', window.Search.debounce((e) => {
                window.Search.keyword = e.target.value;
                App.updateView();
            }, 300));
        }
    }
};

window.App = App;
document.addEventListener('DOMContentLoaded', App.init);
