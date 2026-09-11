# HƯỚNG DẪN TỰ ĐỒNG BỘ PHIÊN BẢN - HUB V1.3

## Mục tiêu

Sau khi cấu hình một lần, khi một app riêng được nâng cấp, Hub có thể tự hiển thị:

- Phiên bản mới nhất.
- Ngày cập nhật.
- Ghi chú cập nhật.
- Trạng thái Online/Bảo trì.

Không cần sửa Hub mỗi lần nâng app.

## Bước 1 - Trong từng app riêng

Tạo file `app-info.js` ở thư mục gốc của app.

Ví dụ app Phiếu bài tập Toán:

```js
window.registerGvAiAppInfo({
  id: "toan-ai",
  version: "V36",
  updated: "2026-09-15",
  status: "online",
  note: "Nâng cấp cơ chế vẽ hình học"
});
```

Deploy app như bình thường.

Sau deploy, kiểm tra đường dẫn:

`https://phieu-toan-thcs.bacgptplus27.chatgpt.site/app-info.js`

Nếu mở được và thấy đoạn JavaScript trên là đạt.

## Bước 2 - Hub đã cấu hình sẵn

`apps.json` V1.3 đã có `metadataUrl` cho các app đã có link. Ví dụ:

```json
"metadataUrl": "https://phieu-toan-thcs.bacgptplus27.chatgpt.site/app-info.js"
```

Hub sẽ tự tải file này khi mở trang.

## Bước 3 - Mỗi lần app được nâng cấp

Chỉ sửa `app-info.js` của app đó. Ví dụ:

```js
window.registerGvAiAppInfo({
  id: "toan-ai",
  version: "V37",
  updated: "2026-09-20",
  status: "online",
  note: "Bổ sung dạng bài vận dụng cao"
});
```

Sau khi app được deploy, Hub tự hiển thị V37.

## Chế độ bảo trì

Muốn tạm khóa nút Mở app trên Hub:

```js
window.registerGvAiAppInfo({
  id: "toan-ai",
  version: "V37",
  updated: "2026-09-20",
  status: "maintenance",
  note: "Đang bảo trì hệ thống"
});
```

Hub sẽ hiển thị `Bảo trì` và vô hiệu hóa nút Mở app.

## Nếu app-info.js chưa có

Hub vẫn hoạt động bình thường. Nó dùng `version` và `updated` trong `apps.json` làm dữ liệu dự phòng và hiển thị nhãn `Dùng dự phòng`.

## Thêm app mới sau này

1. Thêm app mới vào `apps.json` của Hub.
2. Khai báo `metadataUrl` trỏ tới `/app-info.js` của app.
3. Tạo `app-info.js` trong app mới với `id` giống hệt `id` trong Hub.
4. Deploy cả hai lần đầu. Những lần sau chỉ cần cập nhật app riêng.
