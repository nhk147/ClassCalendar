// ==========================================
// FILTERS
// Xử lý logic lọc sự kiện và Render Giao diện Sidebar Filter Panel
// ==========================================

const Filters = {
    // Trạng thái bộ lọc hiện tại (dùng mảng cho checkbox đa lựa chọn)
    state: {
        locations: [],
        persons: [],
        tags: [],
        statuses: []
    },

    // Lấy danh sách các giá trị duy nhất từ một thuộc tính
    getUniqueValues: (data, field) => {
        const values = new Set();
        data.forEach(event => {
            if (Array.isArray(event[field])) {
                event[field].forEach(v => {
                    if (v) values.add(v);
                });
            } else {
                if (event[field]) values.add(event[field]);
            }
        });
        return Array.from(values).sort();
    },

    // Cập nhật state từ trạng thái checkbox trên giao diện
    updateStateFromDOM: () => {
        const getChecked = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
        Filters.state.locations = getChecked('filter-location');
        Filters.state.persons = getChecked('filter-person');
        Filters.state.tags = getChecked('filter-tag');
        Filters.state.statuses = getChecked('filter-status');
    },

    // Xóa bộ lọc (reset về mảng rỗng)
    clearFilters: () => {
        Filters.state = { locations: [], persons: [], tags: [], statuses: [] };
        
        const checkboxes = document.querySelectorAll('#filter-container input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        window.App.updateView();
    },

    // Render giao diện Checkbox đa lựa chọn
    renderFilterUI: (data) => {
        const filterContainer = document.getElementById('filter-container');
        const legendContainer = document.getElementById('legend-container');
        
        // 1. Extract unique values (from all events to build the full DOM)
        const locations = Filters.getUniqueValues(data, 'location').filter(l => l);
        const tags = Filters.getUniqueValues(data, 'tags').filter(t => t);
        const statuses = Filters.getUniqueValues(data, 'priority').filter(p => p); 
        
        const peopleSet = new Set();
        data.forEach(e => {
            if(e.trainers) e.trainers.forEach(p => p && peopleSet.add(p));
            if(e.lecturers) e.lecturers.forEach(p => p && peopleSet.add(p));
            if(e.coordinators) e.coordinators.forEach(p => p && peopleSet.add(p));
            if(e.travelers) e.travelers.forEach(p => p && peopleSet.add(p));
        });
        const people = Array.from(peopleSet).sort();

        // 2. Render Checkboxes
        if (filterContainer) {
            const renderCheckboxGroup = (name, label, options, currentSelectedArray) => {
                let html = `<div class="filter-group">
                                <label style="font-weight: 600; margin-bottom: 8px; display: block;">${label}</label>
                                <div class="checkbox-group" style="max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">`;
                options.forEach(opt => {
                    const checked = currentSelectedArray.includes(opt) ? 'checked' : '';
                    html += `
                        <label class="filter-checkbox-item" data-value="${opt}" style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; cursor: pointer;">
                            <input type="checkbox" name="${name}" value="${opt}" ${checked}>
                            <span>${opt}</span>
                        </label>`;
                });
                html += `       </div>
                            </div>`;
                return html;
            };

            let filterHtml = '';
            filterHtml += renderCheckboxGroup('filter-location', 'Địa điểm', locations, Filters.state.locations);
            filterHtml += renderCheckboxGroup('filter-person', 'Giảng viên / Phụ trách', people, Filters.state.persons);
            filterHtml += renderCheckboxGroup('filter-tag', 'Loại đào tạo', tags, Filters.state.tags);
            filterHtml += renderCheckboxGroup('filter-status', 'Trạng thái', statuses, Filters.state.statuses);

            filterContainer.innerHTML = filterHtml;

            // Bind events cho checkboxes
            const checkboxes = filterContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    Filters.updateStateFromDOM();
                    window.App.updateView();
                });
            });
        }

        // 3. Render Legend (Chú thích theo Tag)
        if (legendContainer) {
            let legendHtml = '';
            tags.forEach(tag => {
                const colorHex = window.ColorManager.getPrimaryColorForTag(tag);
                legendHtml += `
                    <div class="legend-item" data-tag="${tag}">
                        <span class="legend-dot" style="background-color: ${colorHex};"></span>
                        <span>${tag}</span>
                    </div>
                `;
            });
            legendContainer.innerHTML = legendHtml;
        }

        // 4. Bind event cho nút Xóa bộ lọc
        const btnClear = document.getElementById('btn-clear-filters');
        if (btnClear) {
            const newBtnClear = btnClear.cloneNode(true);
            btnClear.parentNode.replaceChild(newBtnClear, btnClear);
            newBtnClear.addEventListener('click', Filters.clearFilters);
        }
    },

    // Hàm cập nhật ẩn/hiện bộ lọc và chú thích dựa trên dữ liệu hiển thị (Tháng hiện tại)
    updateFilterVisibility: (currentMonthEvents) => {
        // Lấy tất cả giá trị có tồn tại trong currentMonthEvents
        const activeLocations = new Set(Filters.getUniqueValues(currentMonthEvents, 'location'));
        const activeTags = new Set(Filters.getUniqueValues(currentMonthEvents, 'tags'));
        const activeStatuses = new Set(Filters.getUniqueValues(currentMonthEvents, 'priority'));
        
        const activePersons = new Set();
        currentMonthEvents.forEach(e => {
            if(e.trainers) e.trainers.forEach(p => p && activePersons.add(p));
            if(e.lecturers) e.lecturers.forEach(p => p && activePersons.add(p));
            if(e.coordinators) e.coordinators.forEach(p => p && activePersons.add(p));
            if(e.travelers) e.travelers.forEach(p => p && activePersons.add(p));
        });

        // Ẩn/Hiện Checkbox
        const toggleItems = (name, activeSet) => {
            let stateChanged = false;
            const items = document.querySelectorAll(`input[name="${name}"]`);
            items.forEach(input => {
                const labelElement = input.closest('.filter-checkbox-item');
                if (labelElement) {
                    if (activeSet.has(input.value)) {
                        labelElement.style.display = 'flex';
                    } else {
                        labelElement.style.display = 'none';
                        if (input.checked) {
                            input.checked = false;
                            stateChanged = true;
                        }
                    }
                }
            });
            return stateChanged;
        };

        let filtersChanged = false;
        filtersChanged = toggleItems('filter-location', activeLocations) || filtersChanged;
        filtersChanged = toggleItems('filter-person', activePersons) || filtersChanged;
        filtersChanged = toggleItems('filter-tag', activeTags) || filtersChanged;
        filtersChanged = toggleItems('filter-status', activeStatuses) || filtersChanged;

        if (filtersChanged) {
            Filters.updateStateFromDOM();
            // Need to emit event to parent so it can re-apply filters if necessary
            // In our case, since the month is the source of truth for visibility,
            // we should re-apply filters quietly without causing infinite loop.
            // window.App.updateView() calls this, so it could loop.
            // But we only update state, we don't need to re-render month view immediately if it just hides things.
            // Wait, we DO need to re-filter the events shown in the current view!
            setTimeout(() => {
                window.App.updateView();
            }, 0);
        }

        // Ẩn/Hiện Legend
        const legendItems = document.querySelectorAll('.legend-item');
        legendItems.forEach(item => {
            const tag = item.getAttribute('data-tag');
            if (activeTags.has(tag)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    },

    // Lọc dữ liệu theo state hiện tại (Logic OR trong cùng 1 nhóm, AND giữa các nhóm)
    applyFilters: (data) => {
        return data.filter(event => {
            // Lọc theo Location (OR)
            if (Filters.state.locations.length > 0) {
                if (!Filters.state.locations.includes(event.location)) return false;
            }

            // Lọc theo Loại đào tạo (Tag) (OR)
            if (Filters.state.tags.length > 0) {
                if (!event.tags || !event.tags.some(tag => Filters.state.tags.includes(tag))) return false;
            }

            // Lọc theo Trạng thái (Priority) (OR)
            if (Filters.state.statuses.length > 0) {
                if (!Filters.state.statuses.includes(event.priority)) return false;
            }

            // Lọc theo People (OR)
            if (Filters.state.persons.length > 0) {
                const eventPeople = [...(event.trainers||[]), ...(event.lecturers||[]), ...(event.coordinators||[]), ...(event.travelers||[])];
                if (!eventPeople.some(p => Filters.state.persons.includes(p))) return false;
            }

            // Bổ sung điều kiện ẩn sự kiện bằng chuột phải (ẩn hoàn toàn khỏi kết quả lọc)
            if (window.App && window.App.state && window.App.state.hiddenEventIds) {
                if (window.App.state.hiddenEventIds.has(event.id)) {
                    return false;
                }
            }

            return true;
        });
    }
};

window.Filters = Filters;
