// ==========================================
// EXPORT DATA
// Quản lý các tính năng xuất dữ liệu (PNG, CSV...)
// ==========================================

const Export = {
    init: () => {
        const btnPdf = document.getElementById('btn-export-pdf');
        const btnCsv = document.getElementById('btn-export-csv');
        const btnExportPng = document.getElementById('btn-export-png');

        if (btnPdf) {
            btnPdf.addEventListener('click', () => {
                // Đơn giản nhất trên Client là dùng Print của Browser
                window.print();
            });
        }

        if (btnCsv) {
            btnCsv.addEventListener('click', () => {
                Export.downloadCSV(window.Calendar.eventsData);
            });
        }
        if (btnExportPng) {
            btnExportPng.addEventListener('click', Export.exportToPNG);
        }
    },

    exportToPNG: async () => {
        if (typeof html2canvas === 'undefined') {
            window.Renderer.showToast('Thư viện chụp ảnh chưa được tải!', 'danger');
            return;
        }

        const appContainer = document.querySelector('.app-container');
        const mainWorkspace = document.querySelector('.app-main-content');
        const mainContentWrapper = document.querySelector('.main-body-area');
        const calendarContainer = document.getElementById('calendar-container');
        if (!appContainer || !calendarContainer) return;

        window.Renderer.showLoading();
        window.Renderer.showToast('Đang tạo ảnh, vui lòng đợi...', 'success');

        try {
            // Tạm thời gỡ bỏ giới hạn chiều cao để DOM giãn ra toàn bộ
            const origAppHeight = appContainer.style.height;
            const origAppOverflow = appContainer.style.overflow;
            
            let origMainOverflow, origMainHeight, origWrapperOverflow, origWrapperHeight;
            if (mainWorkspace) {
                origMainOverflow = mainWorkspace.style.overflow;
                origMainHeight = mainWorkspace.style.height;
            }
            if (mainContentWrapper) {
                origWrapperOverflow = mainContentWrapper.style.overflow;
                origWrapperHeight = mainContentWrapper.style.height;
            }
            const origCalOverflow = calendarContainer.style.overflowY;

            appContainer.style.height = 'auto';
            appContainer.style.overflow = 'visible';
            if (mainWorkspace) {
                mainWorkspace.style.overflow = 'visible';
                mainWorkspace.style.height = 'auto';
            }
            if (mainContentWrapper) {
                mainContentWrapper.style.overflow = 'visible';
                mainContentWrapper.style.height = 'auto';
            }
            calendarContainer.style.overflowY = 'visible';
            calendarContainer.style.overflow = 'visible';
            calendarContainer.style.height = 'auto';

            // Cho trình duyệt 1 chút thời gian để render lại layout mới
            await new Promise(resolve => setTimeout(resolve, 100));

            // Chụp toàn bộ app-container (Bao gồm cả Header và Legend)
            const canvas = await html2canvas(appContainer, {
                scale: 2, // Độ phân giải gấp đôi để nét hơn
                useCORS: true,
                backgroundColor: '#ffffff', // Hoặc màu nền bạn muốn
                logging: false,
                windowWidth: appContainer.scrollWidth,
                windowHeight: appContainer.scrollHeight
            });

            // Khôi phục layout
            appContainer.style.height = origAppHeight;
            appContainer.style.overflow = origAppOverflow;
            if (mainWorkspace) {
                mainWorkspace.style.overflow = origMainOverflow;
                mainWorkspace.style.height = origMainHeight;
            }
            if (mainContentWrapper) {
                mainContentWrapper.style.overflow = origWrapperOverflow;
                mainContentWrapper.style.height = origWrapperHeight;
            }
            calendarContainer.style.overflowY = origCalOverflow;
            calendarContainer.style.overflow = '';
            calendarContainer.style.height = '';

            // Tạo link tải
            const link = document.createElement('a');
            const month = window.Calendar.currentMonth + 1;
            const year = window.Calendar.currentYear;
            link.download = `Lich_Dao_Tao_T${month}_${year}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            window.Renderer.showToast('Xuất ảnh thành công!', 'success');
        } catch (error) {
            console.error('Lỗi khi xuất PNG:', error);
            window.Renderer.showToast('Lỗi khi xuất ảnh!', 'danger');
        } finally {
            window.Renderer.hideLoading();
        }
    },

    downloadCSV: (data) => {
        if (!data || data.length === 0) {
            window.Renderer.showToast('Không có dữ liệu để xuất', 'warning');
            return;
        }

        // Tạo Header
        let csvContent = "Tên lớp,Ngày bắt đầu,Ngày kết thúc,Địa điểm,Giảng viên,Đầu mối\n";
        
        data.forEach(e => {
            const title = `"${e.title.replace(/"/g, '""')}"`;
            const start = window.DateUtils.formatDate(e.startDate);
            const end = window.DateUtils.formatDate(e.endDate);
            const loc = `"${e.location.replace(/"/g, '""')}"`;
            const lec = `"${e.lecturers.join(', ')}"`;
            const co = `"${e.coordinators.join(', ')}"`;
            
            csvContent += `${title},${start},${end},${loc},${lec},${co}\n`;
        });

        // Kích hoạt download
        const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' }); // \ufeff là BOM để Excel đọc đúng UTF-8
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "LichDaoTao.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

window.Export = Export;
