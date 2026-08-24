// ==========================================
// FILE PICKER
// Hỗ trợ chọn file CSV/TSV từ máy tính (Local File)
// ==========================================

const FilePicker = {
    init: () => {
        const fileInput = document.getElementById('local-file-picker');
        const btnOpenFile = document.getElementById('btn-open-file');

        if (btnOpenFile && fileInput) {
            btnOpenFile.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                // Reset input để có thể chọn lại cùng 1 file nếu cần
                fileInput.value = '';

                window.Renderer.showLoading();
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target.result;
                    try {
                        const parsedData = window.Parser.parseCSV(text);
                        // Đẩy dữ liệu mới vào hệ thống
                        window.App.state.allEvents = parsedData;
                        window.App.updateView();
                        window.Renderer.showToast('Đã tải file thành công!', 'success');
                    } catch (error) {
                        console.error("Lỗi parse file:", error);
                        window.Renderer.showToast('Lỗi đọc dữ liệu file. Vui lòng kiểm tra lại định dạng.', 'danger');
                    } finally {
                        window.Renderer.hideLoading();
                    }
                };

                reader.onerror = () => {
                    window.Renderer.showToast('Không thể đọc file!', 'danger');
                    window.Renderer.hideLoading();
                };

                reader.readAsText(file);
            });
        }
    }
};

window.FilePicker = FilePicker;
