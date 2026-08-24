// ==========================================
// DATA LOADER
// Nhiệm vụ: Đọc dữ liệu từ nguồn (Google Sheet CSV, Local File, Dummy data)
// ==========================================

const DataLoader = {
    
    // Tải toàn bộ dữ liệu từ cấu hình (CSV Url hoặc Mock)
    loadData: async () => {
        if (window.CONFIG.DATA_SOURCE.USE_LOCAL_MOCK || !window.CONFIG.DATA_SOURCE.SHEET_CSV_URL) {
            console.log('DataLoader: Đang sử dụng dữ liệu giả lập (Mock).');
            return DataLoader.getMockData();
        }

        try {
            console.log('DataLoader: Đang fetch từ ' + window.CONFIG.DATA_SOURCE.SHEET_CSV_URL);
            const response = await fetch(window.CONFIG.DATA_SOURCE.SHEET_CSV_URL);
            if (!response.ok) {
                throw new Error('Lỗi mạng khi tải CSV: ' + response.status);
            }
            const csvText = await response.text();
            return window.Parser.parseCSV(csvText);
        } catch (error) {
            console.error('DataLoader Error:', error);
            throw error; // Quăng lỗi để app.js xử lý hiển thị Toast
        }
    },

    // Hàm lấy dữ liệu giả lập (Mock) cho quá trình dev
    getMockData: () => {
        // Trả về một chuỗi CSV mẫu
        const today = window.DateUtils.getToday();
        
        // Hàm helper sinh ngày dạng dd/mm/yyyy
        const d = (offsetDays) => {
            const date = window.DateUtils.addDays(today, offsetDays);
            return window.DateUtils.formatDate(date);
        };

        const mockCsv = `Tên lớp,Từ ngày,Đến ngày,Thời gian,Địa điểm,Phụ trách lớp,Giảng viên,Đầu mối,Công tác,Đối tượng,Mức độ ưu tiên,Link Zoom,Tài liệu,Ghi chú
Đào tạo Tân binh K1,${d(0)},${d(2)},08:30 - 17:30,Hà Nội,Nguyễn Văn A,Trần Thị B,,Đào tạo hội nhập,Nhân viên mới,Cao,,,Cần mang laptop
Kỹ năng Lãnh đạo cấp trung,${d(2)},${d(3)},09:00 - 16:00,TP.HCM,Lê Văn C,Hoàng D,,Kỹ năng mềm,Quản lý,Trung bình,,,
Cập nhật Sản phẩm Bảo hiểm mới,${d(-2)},${d(0)},14:00 - 16:00,Online,Nguyễn Văn A,,Phạm E,Nghiệp vụ,Toàn hệ thống,Cao,https://zoom.us/j/123,,Bắt buộc tham gia
Workshop Chăm sóc khách hàng,${d(10)},${d(10)},08:30 - 12:00,Đà Nẵng,Lê Văn C,,,,Nghiệp vụ,CSKH,Trung bình,,,
Đào tạo Bán hàng nâng cao,${d(5)},${d(8)},08:30 - 17:30,Hà Nội,Phạm E,Nguyễn Văn A,Trần Thị B,Bán hàng,Sale,Cao,,,
Training Hệ thống Core mới,${d(15)},${d(25)},13:30 - 17:30,Online,Hoàng D,,,,Hệ thống,IT,Trung bình,https://zoom.us/j/456,https://docs.google.com/...,`;

        return new Promise((resolve) => {
            // Giả lập độ trễ mạng
            setTimeout(() => {
                const parsed = window.Parser.parseCSV(mockCsv);
                resolve(parsed);
            }, 800);
        });
    }
};

window.DataLoader = DataLoader;
