# Thiết Kế Kỹ Thuật: Tự Động Sinh Slug Cho Các Biểu Mẫu Thêm Mới

- **Ngày tạo:** 2026-10-27
- **Trạng thái:** Đã phê duyệt (Approved)
- **Phạm vi:** Tạo Dòng họ (`families`), Tạo Cây gia phả (`family_trees`), Viết Bài viết/Tin tức (`blog_posts`)

---

## 1. Mục tiêu & Yêu cầu
- Khi người dùng tạo hoặc thêm mới dữ liệu (Dòng họ, Cây gia phả, Bài viết tin tức), trường `Slug` phải tự động sinh theo thời gian thực (realtime) từ tên/tiêu đề tiếng Việt có dấu.
- Cho phép người dùng chỉnh sửa thủ công ô Slug nếu muốn tùy chỉnh. Nếu người dùng xóa trắng ô Slug, hệ thống tự động tái kích hoạt chế độ đồng bộ realtime theo tên.
- Phía Server Action đảm bảo: nếu người dùng gửi slug rỗng hoặc slug đã tồn tại, hệ thống tự động chuẩn hóa và giải quyết xung đột (collision) bằng cách gắn hậu tố số (`-1`, `-2`,...) để tránh lỗi trùng lặp URL và vi phạm UNIQUE constraint.

---

## 2. Kiến trúc & Thiết kế chi tiết

### 2.1 Tiện ích chuyển đổi Slug dùng chung (`utils/slug.ts`)
Tập trung hóa logic slugify để dùng chung cho cả Client UI và Server Actions:
- `slugify(input: string): string`:
  - Chuẩn hóa Unicode NFD, bóc tách dấu thanh (`[\u0300-\u036f]`), chuyển `đ/Đ` thành `d`.
  - Chuyển thành chữ thường (lowercase), loại bỏ toàn bộ ký tự không thuộc `[a-z0-9]`, thay bằng dấu `-`.
  - Gộp các dấu gạch nối liên tiếp và cắt gọt dấu gạch nối ở đầu/cuối chuỗi.
- `generateUniqueSlug(baseSlug: string, isTaken: (slug: string) => Promise<boolean>): Promise<string>`:
  - Kiểm tra xem `baseSlug` đã tồn tại chưa. Nếu có, lặp và tìm hậu tố `-1`, `-2`,... cho đến khi tìm được slug chưa trùng.

### 2.2 Giao diện Client (Realtime Slug Sync)
1. **Form Tạo Dòng họ (`components/AdminFamilyCreateForm.tsx`):**
   - Thêm state `nameValue`, `slugValue`, và `isCustomSlug`.
   - Khi gõ `name`: nếu `!isCustomSlug`, cập nhật `slugValue = slugify(nameValue)`.
   - Khi sửa `slug`: chuyển `isCustomSlug = true`. Nếu xóa hết ký tự trong ô `slug`, đặt lại `isCustomSlug = false` và cập nhật lại theo `name`.
2. **Form Tạo Cây gia phả (`components/CreateFamilyTreeForm.tsx`):**
   - Tách form tạo cây gia phả từ server component `app/dashboard/[familySlug]/trees/page.tsx` thành Client Component `CreateFamilyTreeForm.tsx`.
   - Quản lý state realtime tương tự: khi nhập Tên cây, Slug tự động điền.
3. **Form Viết Tin tức/Bài viết (`components/BlogAdminPanel.tsx`):**
   - Khi ở trạng thái tạo mới (`!editingPost`), khi gõ ô Tiêu đề (`title`), cập nhật `slug` realtime (nếu chưa bị tùy biến thủ công).
   - Khi ở trạng thái chỉnh sửa (`editingPost`), giữ nguyên slug hiện tại trừ khi quản trị viên chủ động thay đổi.

### 2.3 Xử lý Server Actions & Chống trùng lặp (Backend)
1. **Tạo Dòng họ (`app/actions/family.ts` -> `createFamilyAction`):**
   - Lấy slug từ `slugify(requestedSlug || name)`.
   - Kiểm tra bảng `families`. Nếu slug đã tồn tại, tự động tăng hậu tố (`slug-1`, `slug-2`,...).
   - Chuyển slug duy nhất vào RPC `create_family_with_admin`.
2. **Tạo Cây gia phả (`app/actions/family.ts` -> `createFamilyTreeAction`):**
   - Lấy slug từ `slugify(requestedSlug || name)`.
   - Kiểm tra trong phạm vi cùng `family_id` trong `family_trees`. Nếu trùng, tự động gắn hậu tố `-1`, `-2`,...
3. **Tạo/Sửa Bài viết (`app/actions/blog.ts` -> `createOrUpdatePostAction`):**
   - Lấy slug từ `slugify(requestedSlug || title)`.
   - Kiểm tra trong cùng `scope` và `family_id` trong `blog_posts` (ngoại trừ bài viết hiện tại nếu là edit). Nếu trùng, tự động gắn hậu tố.

---

## 3. Kế hoạch kiểm thử (Testing)
- **Unit test `tests/slug.test.ts`:**
  - Kiểm tra các mẫu chuỗi tiếng Việt phức tạp: dấu tiếng Việt, chữ đ, ký tự đặc biệt, nhiều khoảng trắng liên tiếp.
  - Kiểm tra hàm sinh slug không trùng (`generateUniqueSlug`).
- **Integration test `tests/slug-integration.test.ts`:**
  - Kiểm tra logic chống trùng lặp và tương thích các Server Actions.
- **Regression test:**
  - Chạy toàn bộ test suites (`npm test`) đảm bảo các luồng hiện tại không bị ảnh hưởng.
