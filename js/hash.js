// ==========================================
// HASH
// Sinh giá trị băm từ chuỗi
// ==========================================

const Hash = {
    // Simple hash function for string
    // Nguồn: Java String.hashCode()
    hashString: (str) => {
        if (!str || str.length === 0) return 0;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
};

window.Hash = Hash;
