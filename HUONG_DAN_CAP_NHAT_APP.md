# HƯỚNG DẪN THÊM APP MỚI - HUB V1.3

## Khi có một app hoàn toàn mới

1. Mở repository `giaovien-ai-hub` trên GitHub.
2. Mở `apps.json` và chọn **Edit this file**.
3. Thêm một khối app mới theo mẫu dưới đây.
4. Commit changes. Vercel sẽ tự deploy Hub.
5. Trong mã nguồn app mới, tạo thêm file `app-info.js` theo hướng dẫn ở `HUONG_DAN_TU_DONG_BO.md`.

## Mẫu app mới

```json
{
  "id": "quan-ly-diem",
  "name": "Quản lý điểm học sinh",
  "description": "Theo dõi và tổng hợp kết quả học tập của học sinh.",
  "category": "Quản lý",
  "version": "V1",
  "icon": "📊",
  "url": "https://duong-link-app-cua-thay/",
  "metadataUrl": "https://duong-link-app-cua-thay/app-info.js",
  "updated": "2026-09-12",
  "featured": true
}
```

## Ý nghĩa các trường

- `id`: mã riêng, không dấu, không khoảng trắng; không trùng app khác.
- `name`: tên hiển thị.
- `description`: mô tả ngắn.
- `category`: ví dụ `Giáo án`, `Dạy học`, `Quản lý`.
- `version`: phiên bản dự phòng nếu chưa đồng bộ được.
- `icon`: emoji trên thẻ.
- `url`: đường link mở app.
- `metadataUrl`: đường dẫn tới `app-info.js` của app.
- `updated`: ngày dự phòng dạng `YYYY-MM-DD`.
- `featured`: `true` nếu muốn hiện ở Trang chủ.

## Khi app cũ chỉ nâng cấp chức năng

Nếu app đã có `app-info.js`, **không cần sửa Hub**.

Chỉ cập nhật file `app-info.js` trong chính app đó, ví dụ:

```js
window.registerGvAiAppInfo({
  id: "quan-ly-diem",
  version: "V2",
  updated: "2026-09-20",
  status: "online",
  note: "Bổ sung biểu đồ tiến bộ của học sinh"
});
```

Deploy app. Hub sẽ đọc thông tin mới khi người dùng mở hoặc tải lại trang.

## Khi thay đổi đường link app

Nếu URL app thay đổi, sửa cả `url` và `metadataUrl` trong `apps.json`, rồi Commit changes.

## Xóa app

Xóa toàn bộ khối `{ ... }` tương ứng trong `apps.json`, chú ý giữ JSON hợp lệ.
