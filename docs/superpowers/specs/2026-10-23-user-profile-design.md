# Thiết Kế Chi Tiết: Chức Năng Hồ Sơ Cá Nhân (User Profile)

- **Ngày tạo:** 2026-10-23
- **Tác giả:** Antigravity & User
- **Trạng thái:** Bản thiết kế đã phê duyệt

---

## 1. Mục tiêu & Tổng quan

Cung cấp cho người dùng (bao gồm cả Super Admin và Thành viên thông thường) một trang Hồ sơ cá nhân (`/profile`) hoàn chỉnh để:
1. Xem và cập nhật thông tin cá nhân: Họ và tên (`full_name`), Số điện thoại (`phone_number`), Ảnh đại diện (`avatar_url`).
2. Thay đổi mật khẩu tài khoản trực tiếp (yêu cầu mật khẩu hiện tại + mật khẩu mới tối thiểu 8 ký tự).
3. Xem danh sách các dòng họ mà tài khoản đang tham gia kèm vai trò quyền hạn và liên kết truy cập nhanh vào từng dòng họ.
4. Tích hợp liên kết truy cập nhanh "Hồ sơ cá nhân" trên menu Avatar ở Header (`LandingHeader.tsx`) và Dashboard Header (`DashboardLayout`).

---

## 2. Kiến trúc & Routing

### 2.1 Route & Quyền truy cập
- **Đường dẫn:** `/profile`
- **Bảo vệ qua Middleware (`utils/supabase/middleware.ts`):**
  - Thêm `/profile` vào danh sách `isProtectedPath` (cùng với `/admin` và `/dashboard`).
  - Nếu người dùng chưa đăng nhập khi truy cập `/profile`: tự động redirect sang `/login?next=/profile`.
  - Nếu đã đăng nhập: hiển thị trang hồ sơ cá nhân.

### 2.2 Server Component & Client Components
- `app/profile/page.tsx` (Server Component):
  - Lấy dữ liệu user hiện tại qua `getUser()` và `getProfile()`.
  - Lấy danh sách dòng họ có quyền truy cập qua `getAccessibleFamilies()`.
  - Render khung giao diện phong cách truyền thống với `<LandingHeader currentUser={currentUser} />` và `<LandingFooter />`.
- `components/ProfileForm.tsx` (Client Component):
  - Khối Thông tin cá nhân: avatar preview + upload, full name, phone number, email (read-only), role badge, creation date.
  - Khối Đổi mật khẩu: current password, new password, confirm password.
  - Xử lý trạng thái loading, báo lỗi và báo thành công rõ ràng, thân thiện.

---

## 3. Server Actions (`app/actions/user.ts`)

### 3.1 `updateUserProfileFull(formData: FormData)`
- **Đầu vào:**
  - `full_name`: string (bắt buộc, trim)
  - `phone_number`: string (tùy chọn)
  - `avatar_url`: string (tùy chọn)
- **Xác thực:**
  - Đảm bảo user đã đăng nhập qua `getUser()`.
  - Kiểm tra `full_name` không được để trống.
- **Xử lý:**
  - Cập nhật bản ghi `profiles` tương ứng với `user.id`.
  - Cập nhật `updated_at: new Date().toISOString()`.
  - `revalidatePath("/profile")`, `revalidatePath("/")`, `revalidatePath("/dashboard")`.
- **Kết quả trả về:** `{ success: boolean; error?: string }`.

### 3.2 `changeAnyUserPassword(formData: FormData)`
- **Đầu vào:**
  - `current_password`: string (bắt buộc)
  - `new_password`: string (bắt buộc, >= 8 ký tự)
  - `confirm_password`: string (bắt buộc, phải trùng `new_password`)
- **Xác thực:**
  - User đã đăng nhập qua `getUser()`.
  - Xác thực mật khẩu cũ bằng `supabase.auth.signInWithPassword({ email: user.email, password: current_password })`.
  - Nếu sai mật khẩu cũ: báo lỗi "Mật khẩu hiện tại không chính xác".
- **Xử lý:**
  - Đổi mật khẩu mới qua `supabase.auth.updateUser({ password: new_password })`.
  - Gọi RPC `mark_password_changed` nếu cần.
- **Kết quả trả về:** `{ success: boolean; error?: string }`.

---

## 4. Giao diện người dùng (`app/profile/page.tsx`)

### Khối 1: Header & Thẻ tổng quan
- Breadcrumbs / Tiêu đề: "Hồ sơ cá nhân" - "Quản lý thông tin tài khoản và bảo mật".
- Tóm tắt tài khoản: Avatar lớn, Họ tên, Email, Vai trò (Super Admin / Thành viên dòng họ), Ngày tạo tài khoản.

### Khối 2: Chỉnh sửa thông tin cá nhân
- Upload Avatar:
  - Xem trước avatar hiện tại (hoặc avatar chữ cái).
  - Nút chọn ảnh từ thiết bị: Gọi Server Action `uploadAvatarAction` (đã hỗ trợ trong `app/actions/storage.ts`) để lưu vào bucket `avatars` của Supabase.
  - Cập nhật đường dẫn ảnh `avatar_url` ngay sau khi tải xong.
- Họ và tên: Input text với placeholder, nhãn rõ ràng.
- Số điện thoại: Input tel hỗ trợ số điện thoại Việt Nam.
- Email: Input disabled hiển thị địa chỉ email đăng ký.
- Nút "Lưu thay đổi".

### Khối 3: Đổi mật khẩu
- Mật khẩu hiện tại: Input password có toggle ẩn/hiện mật khẩu.
- Mật khẩu mới: Input password.
- Xác nhận mật khẩu mới: Input password.
- Nút "Cập nhật mật khẩu".

### Khối 4: Danh sách dòng họ đã tham gia
- Lưới danh sách các dòng họ tài khoản có quyền truy cập (`accessibleFamilies`).
- Mỗi dòng họ hiển thị:
  - Tên dòng họ.
  - Nhãn vai trò của thành viên trong dòng họ (Quản trị chính, Quản trị phụ, Thành viên, Quản trị hệ thống).
  - Nút "Vào không gian" dẫn đến `/dashboard/[slug]`.

---

## 5. Tích hợp Header (`components/landing/LandingHeader.tsx`)

Bổ sung vào menu dropdown Profile của Header:
- Mục **"Hồ sơ cá nhân"** (`/profile`) với icon `User` đặt ở vị trí đầu danh sách menu (trên mục "Không gian gia phả") cho cả Super Admin và Thành viên thông thường.

---

## 6. Kế hoạch Kiểm thử & Xác minh

1. **Kiểm tra truy cập & Bảo vệ trang:**
   - Chưa đăng nhập truy cập `/profile` -> chuyển hướng về `/login?next=/profile`.
   - Đã đăng nhập truy cập `/profile` -> hiển thị thông tin đầy đủ.
2. **Kiểm tra cập nhật thông tin:**
   - Đổi tên và số điện thoại -> thông báo thành công, avatar và tên trên Header cập nhật theo.
   - Tải avatar mới lên -> ảnh hiển thị trên Header và hồ sơ.
3. **Kiểm tra đổi mật khẩu:**
   - Nhập sai mật khẩu cũ -> báo lỗi chính xác.
   - Mật khẩu mới ngắn hơn 8 ký tự hoặc không khớp -> báo lỗi validation.
   - Nhập đúng -> đổi mật khẩu thành công.
4. **Kiểm tra toàn bộ test suite:**
   - Chạy `npm.cmd test` đảm bảo 42/42 test vượt qua.
   - Chạy `npm.cmd run build` đảm bảo không có lỗi type hoặc compile.
