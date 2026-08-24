// ==========================================
// ICONS
// Quản lý Icon sử dụng trong toàn bộ hệ thống
// Hỗ trợ dễ dàng chuyển đổi sang SVG sau này
// ==========================================

const Icons = {
    // Icons cho các thuộc tính sự kiện
    LOCATION: '<svg viewBox="0 0 24 24" fill="currentColor" width="1.1em" height="1.1em" style="vertical-align: -0.15em;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
    DATE: '📅',
    TIME: '⏰',
    LINK: '🔗',
    ATTACHMENT: '📎',
    NOTE: '📝',
    PRIORITY_HIGH: '🔥',
    PRIORITY_MEDIUM: '⭐',
    PRIORITY_LOW: '✅',

    // Icons cho nhân sự/vai trò
    ROLE_LECTURER: '🎓',
    ROLE_TRAINER: '👤',
    ROLE_COORDINATOR: '🤝',
    GROUP: '👥',
    
    // UI Icons
    CLOSE: '✖',
    SEARCH: '🔍',
    FILTER: '⚡',
    SYNC: '🔄',
    THEME: '🌙',
    PREV: '◀',
    NEXT: '▶',

    // Hàm tiện ích sinh HTML cho Icon cùng chữ (vd: 🎓 Nguyễn Văn A)
    renderRole: (role, name) => {
        let icon = Icons.ROLE_TRAINER;
        if (role === window.CONSTANTS.ROLES.LECTURER) icon = Icons.ROLE_LECTURER;
        else if (role === window.CONSTANTS.ROLES.COORDINATOR) icon = Icons.ROLE_COORDINATOR;
        
        return `<span class="role-badge" title="${role}">${icon} ${name}</span>`;
    }
};

window.Icons = Icons;
