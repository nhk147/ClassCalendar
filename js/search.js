// ==========================================
// SEARCH
// Tìm kiếm realtime có debounce
// ==========================================

const Search = {
    keyword: '',
    
    // Hàm debounce để tránh gọi filter liên tục khi gõ
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Lọc dữ liệu theo từ khóa
    applySearch: (data) => {
        if (!Search.keyword || Search.keyword.trim() === '') {
            return data;
        }

        const kw = Search.keyword.toLowerCase().trim();

        return data.filter(event => {
            // Tìm kiếm trong tất cả các trường có khả năng text
            const searchString = [
                event.title,
                event.location,
                event.trainers.join(' '),
                event.lecturers.join(' '),
                event.coordinators.join(' '),
                event.audience,
                event.note
            ].join(' ').toLowerCase();

            return searchString.includes(kw);
        });
    }
};

window.Search = Search;
