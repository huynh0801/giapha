# Thiết Kế Kỹ Thuật: Chuyển Đổi Upload Ảnh Sang Cloudflare R2 & Bỏ Nhập URL

- **Ngày tạo:** 2026-10-27
- **Trạng thái:** Đã phê duyệt (Approved)
- **Phạm vi:**
  - Chuyển đổi toàn bộ cơ chế lưu trữ media từ Supabase Storage sang Cloudflare R2 (với cơ chế tự động fallback về Supabase nếu chưa cấu hình R2).
  - Loại bỏ hoàn toàn các ô nhập link URL ảnh (đặc biệt là Logo dòng họ tại trang About), thay thế bằng component upload file trực tiếp với preview, validation và tối ưu hóa WebP.
  - Hỗ trợ upload Logo ngay từ form tạo mới dòng họ.

---

## 1. Mục tiêu & Yêu cầu

1. **Tối ưu chi phí lưu trữ & Băng thông (Cloudflare R2):**
   - Tận dụng chính sách Zero Egress Fee của Cloudflare R2 để người dùng truy cập và tải ảnh không tốn chi phí băng thông mạng.
   - S3-compatible API: Kết nối qua `@aws-sdk/client-s3`.
   - Cơ chế Fallback linh hoạt: Nếu môi trường chưa điền đầy đủ thông tin tài khoản Cloudflare R2, hệ thống tự động sử dụng Supabase Storage như hiện tại mà không làm gãy luồng tải ảnh.
2. **Loại bỏ nhập URL ảnh, thay bằng File Upload trực tiếp:**
   - Tại trang Hồ sơ dòng họ (`/dashboard/[familySlug]/about`), loại bỏ `<input name="logo_url" placeholder="https://..." />`.
   - Thay thế bằng giao diện chọn file từ máy, xem trước (preview) dạng khung huy hiệu, hỗ trợ xóa/đổi ảnh.
   - Tại form Tạo dòng họ mới (`AdminFamilyCreateForm.tsx`), bổ sung thêm trường tải lên logo tùy chọn.
3. **Chuẩn hóa chất lượng & Định dạng ảnh:**
   - Tất cả ảnh upload (Avatar, Logo, Blog cover, Blog inline) đều được tự động tối ưu hóa và chuyển đổi sang WebP bằng thư viện `sharp` trước khi lưu vào Storage.

---

## 2. Kiến trúc & Thiết kế chi tiết

### 2.1 Cấu hình biến môi trường (`.env.example`, `.env.local`)
Bổ sung các biến môi trường cho Cloudflare R2:
- `CLOUDFLARE_R2_ACCOUNT_ID`: Cloudflare Account ID.
- `CLOUDFLARE_R2_ACCESS_KEY_ID`: R2 S3 Access Key ID.
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`: R2 S3 Secret Access Key.
- `CLOUDFLARE_R2_BUCKET_NAME`: Tên bucket R2 (ví dụ: `giaphadongho`).
- `CLOUDFLARE_R2_PUBLIC_URL`: URL công khai của bucket hoặc Custom Domain (ví dụ: `https://pub-xxxx.r2.dev` hoặc `https://media.giaphadongho.vn`).

### 2.2 Unified Storage Adapter (`utils/storage/index.ts`)
Xây dựng một module trung tâm quản lý lưu trữ:
- **Kiểm tra R2 khả dụng:**
  ```typescript
  export function isR2Configured(): boolean
  ```
- **Hàm Tải ảnh lên Storage (`uploadStorageImage`):**
  - Nhận vào: `file: File | Buffer`, `folder: string`, `options?: { maxDimension?: number, quality?: number, bucketFallback?: string }`.
  - Tối ưu hóa ảnh sang WebP bằng `sharp` (áp dụng kích thước phù hợp: avatar 600px, logo 800px, blog cover 1600px).
  - Nếu `isR2Configured()`: Sử dụng `S3Client` và `PutObjectCommand` để đẩy file lên Cloudflare R2. URL trả về là `${CLOUDFLARE_R2_PUBLIC_URL}/${filePath}`.
  - Nếu chưa có R2: Sử dụng `createClient` của Supabase để tải lên bucket tương ứng (`avatars`, `blog-images`, hoặc `families`).
  - Trả về: `{ success: boolean, publicUrl?: string, filePath?: string, error?: string }`.
- **Hàm Xóa ảnh từ Storage (`deleteStorageImage`):**
  - Nhận vào: `filePath: string`, `bucketFallback?: string`.
  - Nếu R2: Gọi `DeleteObjectCommand`.
  - Nếu Supabase: Gọi `supabase.storage.from(bucketFallback).remove([filePath])`.

### 2.3 Component Upload Ảnh Dùng Chung (`components/ImageUploadField.tsx`)
- Component `"use client"` cung cấp giao diện tải ảnh trực quan:
  - Props:
    - `name`: tên trường file gửi lên Server Action (`logo_file`, `avatar_file`,...).
    - `existingImageUrl`: URL ảnh hiện có (nếu đang sửa).
    - `removeInputName`: tên cờ xóa ảnh (`remove_logo`, `remove_avatar`,...).
    - `label`: nhãn hiển thị.
    - `shape`: `"shield"` (huy hiệu) | `"circle"` (avatar) | `"banner"` (ảnh bài viết).
    - `maxSizeMb`: dung lượng tối đa (mặc định 5MB).
  - Tích hợp trạng thái xem trước ngay khi người dùng chọn file (`URL.createObjectURL`).
  - Nút Xóa ảnh / Hủy chọn.
  - Tự động hiển thị cảnh báo định dạng hoặc quá dung lượng.

### 2.4 Cập nhật các Server Actions
1. **`app/actions/family.ts`**:
   - `updateFamilyAction`:
     - Nhận `logo_file` từ `formData.get("logo_file") as File`.
     - Nếu có file mới: Gọi `uploadStorageImage` lưu vào thư mục `families/logos/${familyId}`, cập nhật `logo_url`.
     - Nếu người dùng bấm xóa (`formData.get("remove_logo") === "1"`): Xóa file cũ và đặt `logo_url = null`.
   - `createFamilyAction`:
     - Nhận `logo_file` từ `formData.get("logo_file") as File`.
     - Nếu có file: Upload lên `families/logos/pending/` hoặc sau khi tạo family ID thì lưu vào `families/logos/${familyId}` và cập nhật vào bảng `families`.
2. **`app/actions/storage.ts` (`uploadAvatarAction`, `deleteAvatarAction`)**:
   - Thay thế việc gọi trực tiếp Supabase Storage bằng `uploadStorageImage` và `deleteStorageImage` qua adapter.
3. **`app/actions/blog.ts` (`saveScopedBlogPost`, `uploadBlogInlineImage`, `uploadFamilyBlogInlineImage`)**:
   - Chuyển toàn bộ việc lưu trữ ảnh bìa và ảnh nội tuyến sang `uploadStorageImage`.

---

## 3. Kế hoạch kiểm thử & Đảm bảo an toàn
- **Cài đặt thư viện:** Thêm `@aws-sdk/client-s3` vào `dependencies`.
- **Unit test `tests/storage-adapter.test.ts`:**
  - Kiểm tra `isR2Configured()` hoạt động đúng theo biến môi trường.
  - Kiểm tra logic nén WebP và sinh tên file an toàn.
  - Kiểm tra chế độ fallback sang Supabase khi không có credentials R2.
- **Hồi quy:**
  - Chạy toàn bộ 70 bài kiểm thử hiện có (`npm test`) đảm bảo không phát sinh bất kỳ lỗi hồi quy nào.
