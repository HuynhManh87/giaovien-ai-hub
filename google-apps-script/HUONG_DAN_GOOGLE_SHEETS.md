# THỐNG KÊ TOÀN HỆ THỐNG BẰNG GOOGLE SHEETS + APPS SCRIPT

## 1. Tạo nơi lưu số liệu
1. Mở Google Drive -> Mới -> Google Trang tính.
2. Đặt tên: `THONG_KE_GIAOVIEN_AI_HUB`.
3. Không cần tự tạo cột hay sheet con; Apps Script sẽ tự tạo `DailyStats` và `AppStats`.

## 2. Tạo Apps Script
1. Trong Google Sheet chọn **Tiện ích mở rộng (Extensions) -> Apps Script**.
2. Xóa mã mặc định trong `Code.gs`.
3. Mở file `google-apps-script/Code.gs` trong bộ mã nguồn này và dán toàn bộ vào.
4. Trong Apps Script chọn **Project Settings** và đặt Time zone là **(GMT+07:00) Ho Chi Minh** nếu chưa đúng.
5. Bấm **Save**.

## 3. Triển khai Web App
1. Chọn **Deploy -> New deployment**.
2. Loại triển khai: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Bấm **Deploy** và cấp quyền lần đầu.
6. Copy URL kết thúc bằng `/exec`.

## 4. Kết nối Hub
Mở `config.js` ở thư mục gốc và sửa:

```js
window.GVAI_CONFIG = {
  statsApiUrl: 'DAN_URL_WEB_APP_EXEC_VAO_DAY',
  statsSiteKey: 'MANH_LB_HUB_2026'
};
```

Commit lên GitHub. Vercel tự deploy lại Hub.

## 5. Cách kiểm tra
Mở Hub ở 2 trình duyệt/2 máy khác nhau. Mỗi lần tải trang sẽ tăng **lượt truy cập hôm nay** và **toàn thời gian** trong cùng Google Sheet.

Khi bấm `Mở app`, Hub cộng **lượt mở app** và lưu theo từng app.

## 6. Dữ liệu được lưu
- `DailyStats`: Date | Visits | AppOpens
- `AppStats`: Date | AppId | AppName | Opens

Google Sheet là của tài khoản Google của tác giả, không đặt khóa bí mật trong GitHub.

## 7. Lưu ý
- Mỗi lần tải/refresh Hub được tính là 1 lượt truy cập.
- `statsSiteKey` chỉ dùng để tránh gọi nhầm endpoint, không phải mật khẩu bảo mật vì nó nằm ở phía trình duyệt.
- Không đổi tên hai sheet `DailyStats` và `AppStats` sau khi hệ thống đã chạy.
