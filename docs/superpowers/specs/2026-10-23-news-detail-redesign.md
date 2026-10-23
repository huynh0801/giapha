# Thiết Kế Chi Tiết: Redesign Trang Chi Tiết Tin Tức (/blog/[slug])

## 1. Mục tiêu & Định hướng thẩm mỹ
Chuyển đổi toàn diện giao diện trang chi tiết tin tức (`app/blog/[slug]/page.tsx`) từ phong cách hiện đại với các góc bo tròn (`rounded-[24px]`, `rounded-full`) sang **phong cách cổ truyền di sản Việt Nam** ("khung sắc phong toàn diện"):
- Đồng bộ hoàn hảo với trang Giới thiệu (`/about`) và trang Danh sách tin tức (`/news`).
- Không sử dụng bo tròn góc lớn, ưu tiên góc vuông sắc nét (`rounded-none`).
- Khung kép chỉ vàng hoàng gia (`#caa455` và `#deb887`) kết hợp 4 họa tiết góc gác chu sa đỏ thẫm (`#8c1d1d`).
- Sử dụng họa tiết nền `decorate2.png` (bên trái) và `decorate1.png` (bên phải) qua component `<BackgroundDecor withMid />`.
- Font chữ tiêu đề thư pháp cổ truyền `"SVN-Studio Brush", "Playfair Display", Georgia, serif` màu lục thẫm hoàng gia (`#183b28`).

---

## 2. Cấu trúc giao diện

### 2.1. Nền trang & Họa tiết trang trí
- Nền trang: `bg-[#f5e7c7]`, `text-[#2c1a11]`.
- Tích hợp component `<BackgroundDecor withMid />` ở lớp nền phía sau `<main>`, đảm bảo `pointer-events-none select-none z-0 overflow-hidden`.

### 2.2. Khung Sắc Phong Toàn Diện (Master Frame)
Toàn bộ phần nội dung chính của bài viết được bao bọc trong một đại khung sắc phong duy nhất:
- **Khung ngoài:** `border-2 border-[#caa455] bg-[#f5e7c7]/30 p-1.5 sm:p-2.5 shadow-[0_4px_30px_rgba(44,26,17,0.08)]`.
- **Khung trong:** `border border-[#deb887] bg-[#fffdf7] p-5 sm:p-8 md:p-12`.
- **4 góc gác truyền thống:** Thước góc đỏ thẫm `border-[#8c1d1d]` ở 4 góc.
- **Nội dung bên trong khung:**
  1. **Breadcrumb cổ điển:** `Trang chủ > Bản tin dòng tộc > [Danh mục]` với biểu tượng liên kết truyền thống.
  2. **Tiêu đề bài viết:** Font `"SVN-Studio Brush"`, màu lục thẫm `#183b28`, cỡ chữ `text-2xl sm:text-3xl lg:text-4xl`.
  3. **Thanh thông tin bài viết:** Ngày đăng (thứ, ngày, tháng, năm), thời gian đọc, kèm dải phân cách chỉ vàng với con thoi đỏ thẫm xoay 45 độ.
  4. **Đoạn trích dẫn (Excerpt):** Đóng khung thư tịch nhấn viền trái đỏ thẫm (`border-l-4 border-[#8c1d1d] bg-[#fcf8ef] p-4 text-[#5c4a3e] italic`).
  5. **Ảnh bìa bài viết (Cover image):** Bao bọc bởi khung chỉ kép vàng hoàng gia sắc nét.
  6. **Nội dung chi tiết bài viết (Article Body):**
     - Hỗ trợ cả định dạng HTML Rich Text và thuần đoạn văn.
     - Tùy biến CSS inline cho ảnh bên trong bài viết thành khung sắc nét, bỏ các style `border-radius: 24px` cũ.
     - Đoạn mở đầu (Lead paragraph) có chữ cái đầu tiên (Drop cap) thư pháp trang trọng.
  7. **Nút điều hướng quay lại:** Nút hình chữ nhật góc vuông viền vàng nền đỏ thẫm (`border-2 border-[#caa455] bg-[#8c1d1d] text-white hover:bg-[#6e1616]`) dẫn về `/news`.

### 2.3. Khu vực Bài Viết Liên Quan (Related Articles)
- Đặt bên ngoài khung chính, ở phần chân trang trước Footer.
- Tiêu đề khu vực: `"Bài Viết Liên Quan"` kèm họa tiết mây hoặc hoa văn chỉ vàng hai bên đối xứng.
- Danh sách 3 bài viết liên quan sử dụng **đúng định dạng thẻ bài viết cổ truyền của trang `/news`**:
  - Khung kép chỉ vàng `border-2 border-[#caa455]`.
  - 4 góc gác chu sa đỏ thẫm `border-[#8c1d1d]`.
  - Ảnh bài viết viền vàng, hiệu ứng hover đổi màu tiêu đề sang đỏ thẫm `#8c1d1d` và nút `Xem chi tiết →`.

---

## 3. Kế hoạch triển khai & Kiểm tra
1. Cập nhật `app/blog/[slug]/page.tsx` theo thiết kế trên.
2. Kiểm tra tương thích hiển thị trên cả desktop và mobile (responsive).
3. Chạy toàn bộ test suite (`npm test`) đảm bảo 47/47 tests vượt qua.
4. Kiểm tra HTTP 200 trên URL thực tế `http://localhost:3000/blog/...`.
5. Tạo commit cục bộ và chờ lệnh của người dùng trước khi push.
