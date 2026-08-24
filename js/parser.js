// ==========================================
// PARSER
// Chuyển đổi dữ liệu thô (Raw Data) từ CSV/TSV thành Object định dạng chuẩn
// Normalize, Validate, Trim
// ==========================================

const Parser = {
    // Parser chính cho CSV/TSV
    // Raw Data là chuỗi CSV/TSV (có header)
    parseCSV: (rawCsv) => {
        if (!rawCsv) return [];
        
        // Cố gắng tự động phát hiện delimiter (dấu phẩy hoặc tab)
        const delimiter = rawCsv.indexOf('\t') !== -1 ? '\t' : ',';
        const lines = rawCsv.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
        
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            // Logic split nâng cao hỗ trợ escape bằng ngoặc kép (nếu CSV có ngoặc kép chứa dấu phẩy)
            // Regex match elements separated by delimiter, allowing quoted strings
            const regex = new RegExp(`(?:^|${delimiter})("([^"]*(?:""[^"]*)*)"|([^${delimiter}*]))`, 'g');
            let rowMatches = [];
            let match;
            let currentLine = lines[i];
            
            // Đơn giản hóa nếu dùng TSV hoặc CSV cơ bản (trong thực tế, CSV phức tạp cần thư viện như PapaParse,
            // nhưng do yêu cầu Vanilla JS và Lightweight, ta dùng cách split đơn giản hoặc Regex nếu cần).
            // Tạm thời dùng split cơ bản ưu tiên cho nội bộ.
            let row = currentLine.split(delimiter);
            
            if (row.length === 1 && row[0] === "") continue;

            const rowData = {};
            headers.forEach((header, index) => {
                let val = row[index] ? row[index].trim() : '';
                // Bỏ ngoặc kép đầu cuối nếu có
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.substring(1, val.length - 1).replace(/""/g, '"');
                }
                rowData[header] = val;
            });

            const parsedEvent = Parser.normalize(rowData);
            if (parsedEvent) {
                data.push(parsedEvent);
            }
        }
        return data;
    },

    // Chuẩn hóa 1 row (Object) thành 1 Event chuẩn của hệ thống
    normalize: (rowObj) => {
        // Cột theo chuẩn SDD (mapping từ Tiếng Việt không dấu/có dấu sang thuộc tính chuẩn)
        // Tìm khóa phù hợp nhất trong rowObj
        
        const getVal = (keys) => {
            for (let k of keys) {
                const foundKey = Object.keys(rowObj).find(r => r.includes(k));
                if (foundKey) return rowObj[foundKey];
            }
            return '';
        };

        const title = getVal(['tên lớp', 'ten lop', 'tên chương trình', 'title']);
        const startDateStr = getVal(['từ ngày', 'tu ngay', 'start']);
        const endDateStr = getVal(['đến ngày', 'den ngay', 'end']);
        
        // Bắt buộc phải có Tên lớp và Từ ngày
        if (!title || !startDateStr) return null;

        const startDate = window.DateUtils.parseDate(startDateStr);
        let endDate = window.DateUtils.parseDate(endDateStr);
        
        // Nếu không có ngày kết thúc, mặc định kết thúc trong ngày
        if (!endDate || endDate < startDate) {
            endDate = startDate;
        }

        const id = window.Hash.hashString(title + startDateStr).toString();

        return {
            id: id,
            title: title,
            startDate: startDate,
            endDate: endDate,
            time: getVal(['thời gian', 'thoi gian', 'time']),
            location: getVal(['địa điểm', 'dia diem', 'location']),
            trainers: Parser.splitMulti(getVal(['phụ trách', 'phu trach', 'trainer'])),
            lecturers: Parser.splitMulti(getVal(['giảng viên', 'giang vien', 'lecturer'])),
            coordinators: Parser.splitMulti(getVal(['đầu mối', 'dau moi', 'coordinator'])),
            travelers: Parser.splitMulti(getVal(['công tác', 'cong tac', 'role', 'traveler'])),
            rolesDisplay: getVal(['công tác', 'cong tac', 'role']),
            audience: getVal(['đối tượng', 'doi tuong', 'audience']),
            priority: getVal(['ưu tiên', 'uu tien', 'priority']) || window.CONSTANTS.PRIORITY.MEDIUM,
            zoomLink: getVal(['link zoom', 'zoom', 'link']),
            materials: getVal(['tài liệu', 'tai lieu', 'material']),
            email: getVal(['email', 'thư điện tử', 'thu dien tu', 'thư']),
            tags: Parser.splitPipe(getVal(['tag', 'ẩn/hiện', 'an/hien', 'loại đào tạo', 'loai dao tao'])),
            studentCount: parseInt(getVal(['số lượng', 'học viên', 'hoc vien'])) || 0,
            note: getVal(['ghi chú', 'ghi chu', 'note'])
        };
    },

    // Chia chuỗi nhiều người (phân cách bởi dấu phẩy, chấm phẩy hoặc newline) thành mảng
    splitMulti: (str) => {
        if (!str) return [];
        return str.split(/[,;\n]+/).map(s => s.trim()).filter(s => s.length > 0);
    },

    // Chia chuỗi phân cách bởi dấu pipe | (Dành cho thẻ Tag)
    splitPipe: (str) => {
        if (!str) return [];
        return str.split('|').map(s => s.trim()).filter(s => s.length > 0);
    }
};

window.Parser = Parser;
