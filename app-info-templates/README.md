# app-info.js dùng để Hub tự đồng bộ phiên bản

Mỗi ứng dụng cần có **một file tên chính xác `app-info.js` ở thư mục gốc** của app.

Ví dụ URL sau khi deploy:

`https://phieu-toan-thcs.bacgptplus27.chatgpt.site/app-info.js`

Nội dung file theo mẫu:

```js
window.registerGvAiAppInfo({
  id: "toan-ai",
  version: "V36",
  updated: "2026-09-15",
  status: "online",
  note: "Nâng cấp cơ chế vẽ hình học"
});
```

Các giá trị Hub tự đọc:

- `id`: bắt buộc, phải khớp `id` trong `apps.json` của Hub.
- `version`: phiên bản mới nhất.
- `updated`: ngày cập nhật dạng `YYYY-MM-DD`.
- `status`: `online` hoặc `maintenance`.
- `note`: mô tả rất ngắn nội dung vừa cập nhật.

Nếu file không tồn tại hoặc không đọc được, Hub **không lỗi** mà tự dùng phiên bản dự phòng trong `apps.json`.
