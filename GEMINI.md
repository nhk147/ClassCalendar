# Quy định về File Tạm & Test

Tất cả các file script dùng để test, file dữ liệu giả, file log hoặc bất kỳ file tạm thời nào được tạo ra trong quá trình debug, phát triển đều PHẢI được đặt trong thư mục `temp/`.
TUYỆT ĐỐI KHÔNG tạo các file tạm này ở thư mục gốc của dự án.

Ngoài ra, khi tạo mới các file trong thư mục `temp/`, hãy chủ động kiểm tra xem có file nào trong thư mục này đã tồn tại quá 3 ngày không, nếu có, mà không cần sử dụng hãy dọn dẹp và xóa chúng đi theo quy định.
