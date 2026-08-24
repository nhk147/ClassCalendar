# Hệ thống Quản lý Lịch Đào Tạo - Bảo Việt Life

Đây là ứng dụng web Vanilla (HTML, CSS, JS thuần) hỗ trợ tải dữ liệu từ file CSV/TSV và hiển thị dưới dạng Lịch Đào Tạo trực quan. Ứng dụng tập trung vào tốc độ, giao diện hiện đại (Pastel Theme), tính dễ dùng và không phụ thuộc vào framework nặng.

## 📂 Cấu trúc Dự án

Dự án được cấu trúc theo dạng Modular JavaScript (nhưng không dùng `type="module"` để dễ dàng chạy trực tiếp file từ local không cần web server), mỗi file đảm nhận một vai trò cụ thể:

```text
HTMLCalendar/
├── index.html              # File HTML chính, định dạng khung giao diện.
├── README.md               # Tài liệu hướng dẫn cấu trúc và bảo trì (bạn đang đọc).
│
├── styles/                 # Thư mục chứa các file CSS (Thiết kế Pastel)
│   ├── main.css            # CSS reset, biến màu sắc (variables), layout tổng thể, nút bấm.
│   ├── calendar.css        # CSS chuyên biệt cho lưới lịch và các thẻ sự kiện.
│   ├── popup.css           # CSS cho hộp thoại (modal) chi tiết sự kiện.
│   └── responsive.css      # CSS xử lý hiển thị trên thiết bị di động/màn hình nhỏ.
│
└── js/                     # Thư mục chứa các mô-đun Logic (Vanilla JS)
    ├── constants.js        # Chứa các hằng số cấu hình (ưu tiên, theme, định dạng ngày).
    ├── config.js           # Cấu hình chung của ứng dụng.
    ├── dateUtils.js        # Tiện ích xử lý ngày tháng.
    ├── hash.js             # Hàm hash tạo ID tự động cho sự kiện.
    ├── colorManager.js     # Quản lý màu nền, màu chữ theo Địa điểm và Nhân sự (Giao diện Pastel).
    ├── icons.js            # Khai báo các SVG/Emoji icons dùng trong hệ thống.
    ├── storage.js          # Xử lý lưu/đọc trạng thái (Theme, Detail View) từ LocalStorage.
    ├── dataLoader.js       # Tải dữ liệu giả (nếu có) hoặc gọi API.
    ├── filePicker.js       # Xử lý mở và tải file dữ liệu CSV/TSV từ máy khách.
    ├── parser.js           # Phân tích cú pháp file CSV, chuẩn hóa thành đối tượng Event (chuẩn hóa tên cột như Email, Đối tượng...).
    ├── filters.js          # Logic tạo panel bộ lọc và hàm lọc dữ liệu (Lọc theo Email, Nhân sự, Địa điểm...).
    ├── search.js           # Logic tìm kiếm (Debounce search).
    ├── layoutEngine.js     # Tính toán vị trí xếp chồng các thẻ sự kiện (row, col) tránh đè nhau.
    ├── calendar.js         # Xử lý model lưới lịch (ngày nào, thuộc tháng nào).
    ├── popup.js            # Xử lý hiển thị chi tiết khi click vào sự kiện.
    ├── renderer.js         # Xây dựng DOM/HTML dựa trên dữ liệu lưới lịch, xử lý logic ẩn sự kiện chuột phải.
    ├── export.js           # Xử lý xuất ảnh lịch ra file PNG.
    └── app.js              # Orchestrator (Điều phối): Khởi tạo, gắn sự kiện, lưu trạng thái ứng dụng.
```

---

## 🛠 Hướng dẫn Bảo trì (Maintenance)

Hệ thống được thiết kế linh hoạt để dễ dàng thêm mới chức năng mà không làm xáo trộn toàn bộ mã nguồn. Dưới đây là cách thực hiện các tác vụ bảo trì phổ biến:

### 1. Thêm cột dữ liệu mới từ file CSV (Ví dụ: Thêm Số điện thoại)
- **Bước 1 (Đọc dữ liệu):** Mở `js/parser.js`, tìm hàm `normalize()`. Thêm trường mới bằng `getVal()`. 
  Ví dụ: `phone: getVal(['số điện thoại', 'phone', 'sdt']),`
- **Bước 2 (Hiển thị chi tiết):** Mở `js/popup.js`, tìm hàm `buildEventHtml()`, bổ sung một dòng HTML để hiển thị `event.phone` vào Popup chi tiết sự kiện.

### 2. Sửa màu sắc giao diện tổng thể (Đổi Theme)
- Mở file `styles/main.css`.
- Chỉnh sửa các giá trị màu HEX trong `:root` (ở phần `/* Brand Colors - Modern Pastel Theme */`). Giao diện toàn hệ thống và các nút bấm sẽ tự động thay đổi theo.

### 3. Đổi màu cho một Địa điểm cụ thể (Keangnam, Quang Minh...)
- Mở file `js/colorManager.js`.
- Tìm object `locationMap`. Bạn có thể thay đổi các mã màu `bg` (màu nền), `text` (màu chữ), và `border` (viền) cho các địa điểm đang có hoặc **thêm dòng mới** cho một địa điểm chưa tồn tại trong danh sách.

### 4. Bổ sung Bộ lọc mới (Ví dụ: Lọc theo Số điện thoại)
- **Bước 1:** Trong `js/filters.js`, tại hàm `renderFilterUI()`, trích xuất giá trị: `const phones = Filters.getUniqueValues(data, 'phone').filter(p => p);`.
- **Bước 2:** Gọi hàm `renderCheckboxList('Lọc theo SĐT', 'phone', phones, Filters.state.phones);` (nhớ thêm `phones: []` vào state).
- **Bước 3:** Trong hàm `applyFilters()`, thêm khối logic if để loại trừ các sự kiện không trùng khớp số điện thoại trong danh sách đã chọn.

---

## 🚀 Hướng dẫn Nâng cấp & Phát triển thêm (Upgrade)

### Gỡ lỗi (Debugging) nhanh:
Toàn bộ object trạng thái của ứng dụng nằm ở `window.App.state`. Nếu giao diện hiển thị sai, hãy mở F12 (Developer Tools) -> Console và gõ `window.App.state.allEvents` hoặc `window.App.state.filteredEvents` để xem dữ liệu đã được nạp và lọc đúng chưa.

### Tích hợp với Backend API thực (thay cho tải file Excel nội bộ):
- Nếu muốn lưu dữ liệu lên server, bạn chỉ cần chỉnh sửa module `js/dataLoader.js`. 
- Thay vì nạp data giả (mock) hoặc dùng `filePicker`, bạn viết logic dùng `fetch()` hoặc `axios` để `GET` dữ liệu từ endpoint API và trả về mảng dữ liệu. Parser của hệ thống vẫn sẽ phân tích mảng đó thành lịch tự động.

### Nâng cấp chế độ xem Tuần / Lịch trình (Week / Agenda views):
- Hiện tại, chế độ xem `Tháng` (Month) đang hoạt động ổn định nhờ `calendar.js` tính toán ma trận lưới 7x5. 
- Để bổ sung chế độ xem Tuần, bạn có thể tạo hàm `renderWeek()` trong `renderer.js` và chỉ lọc ra 7 ngày của tuần hiện tại thay vì 35-42 ngày của tháng, các logic Layout Engine vẫn giữ nguyên.

---
*Ghi chú: Project này sử dụng mã Vanilla chuẩn, không biên dịch webpack, không npm. Bất kỳ kỹ sư Frontend nào cũng có thể mở trực tiếp file `.js` và `.css` bằng Notepad hoặc VSCode để sửa và tải lại trình duyệt để xem kết quả lập tức.*
