# Cổng ứng dụng Giáo viên AI — V1.5

**Bản quyền:** © 2026 Mạnh LB  
**Zalo:** 0352.891.487

## Điểm mới V1.5
- Thống kê toàn hệ thống bằng **Google Sheets + Google Apps Script**, không dùng Supabase.
- Hiển thị: hôm nay, hôm qua, 7 ngày qua, tháng này, toàn thời gian.
- Đếm tổng lượt mở app và lượt mở riêng từng app.
- Google Sheet tự tạo 2 bảng `DailyStats` và `AppStats`.
- Nếu chưa cấu hình Google Apps Script hoặc endpoint lỗi, Hub vẫn chạy bằng bộ đếm cục bộ trên trình duyệt.
- Giữ nguyên cơ chế V1.3: tự đồng bộ version/ngày cập nhật/nội dung mới từ `app-info.js` của từng app.

## Cấu hình thống kê
Xem: `google-apps-script/HUONG_DAN_GOOGLE_SHEETS.md`.

Sau khi deploy Apps Script, chỉ cần dán URL `/exec` vào `config.js`:

```js
window.GVAI_CONFIG = {
  statsApiUrl: 'https://script.google.com/macros/s/.../exec',
  statsSiteKey: 'MANH_LB_HUB_2026'
};
```

Sau đó commit lên GitHub. Vercel tự cập nhật cùng URL Hub hiện tại.

## Thêm app mới
Sửa `apps.json`; không cần sửa giao diện.

## Cấu trúc quan trọng
- `index.html`: giao diện Hub.
- `style.css`: giao diện responsive.
- `app.js`: chức năng Hub + thống kê.
- `config.js`: nơi dán URL Google Apps Script.
- `apps.json`: danh sách ứng dụng.
- `app-info-templates/`: mẫu tự đồng bộ phiên bản cho từng app.
- `google-apps-script/Code.gs`: API thống kê dùng Google Sheet.
- `google-apps-script/HUONG_DAN_GOOGLE_SHEETS.md`: hướng dẫn triển khai.
