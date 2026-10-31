# Thiết Kế Kỹ Thuật: Đăng Nhập Bằng Google (Google OAuth)

- **Ngày tạo:** 2026-10-31
- **Trạng thái:** Đã duyệt (Approved)
- **Phạm vi:** Trang Đăng nhập công khai (`/login`), Route Handler (`/auth/callback`), đồng bộ hồ sơ người dùng (`profiles`).

---

## 1. Mục Tiêu & Yêu Cầu

### 1.1 Mục tiêu
Cho phép thành viên và khách truy cập đăng nhập hoặc đăng ký tài khoản nhanh chóng thông qua tài khoản Google trên trang `/login`, nâng cao trải nghiệm người dùng và giữ nguyên chuẩn mực phong cách giao diện Di Sản.

### 1.2 Yêu cầu chức năng
- Hiển thị nút "Tiếp tục với Google" trên trang `/login` cho cả 2 tab Đăng nhập và Đăng ký.
- Khởi tạo luồng xác thực Google OAuth bằng Supabase SSR (PKCE flow).
- Xử lý mã xác thực tại callback route `app/auth/callback/route.ts` để thiết lập phiên đăng nhập (cookies).
- Tự động đồng bộ họ tên (`full_name`) và ảnh đại diện (`avatar_url`) từ tài khoản Google vào bảng `profiles` nếu hồ sơ chưa có.
- Tôn trọng cấm vận tài khoản: Nếu tài khoản trong bảng `profiles` có `is_active === false`, hủy phiên đăng nhập ngay lập tức và chuyển hướng về `/login?error=account_locked`.
- Kiểm tra tính an toàn của URL chuyển hướng (chống Open Redirect vulnerability), mặc định chuyển về `/` hoặc `next` hợp lệ.
- Xử lý thông báo lỗi thân thiện khi có tham số lỗi trên URL trang đăng nhập.

### 1.3 Ràng buộc kỹ thuật & Quy chuẩn
- Next.js 16 (App Router), React 19, Supabase SSR (`@supabase/ssr`).
- Không import trực tiếp `@supabase/supabase-js` trong `app/login/page.tsx` nhằm đảm bảo kiểm thử hồi quy `tests/login-redesign.test.mjs` luôn xanh. Sử dụng client wrapper `@/utils/supabase/client`.
- Duy trì 100% các bài test hiện có (127 tests) tiếp tục vượt qua.

---

## 2. Kiến Trúc Hệ Thống & Luồng Dữ Liệu

### 2.1 Sơ đồ luồng (Sequence Flow)

```
[Người dùng tại /login]
         │
         │ (1) Bấm "Tiếp tục với Google"
         ▼
[Client (/login)]
         │
         │ (2) createClient().auth.signInWithOAuth({
         │       provider: 'google',
         │       options: { redirectTo: `${origin}/auth/callback?next=${safeNext}` }
         │     })
         ▼
[Google OAuth Consent Screen]
         │
         │ (3) Người dùng đồng ý & cấp quyền
         ▼
[Supabase Auth Service]
         │
         │ (4) Chuyển hướng kèm mã xác thực: /auth/callback?code=...&next=...
         ▼
[Route Handler: app/auth/callback/route.ts]
         │
         │ (5) supabase.auth.exchangeCodeForSession(code)
         │ (6) Kiểm tra trạng thái profiles.is_active:
         │     - Nếu is_active == false -> supabase.auth.signOut() -> redirect('/login?error=account_locked')
         │ (7) Đồng bộ avatar_url & full_name vào profiles nếu còn trống
         │ (8) Validate safe redirect -> Chuyển hướng về `next` hoặc `/`
         ▼
[Trang Đích (Trang Chủ / Hoặc trang yêu cầu trước đó)]
```

---

## 3. Chi Tiết Thành Phần

### 3.1 Giao diện Trang Đăng Nhập (`app/login/page.tsx`)
- Thêm đường phân cách nét mảnh cổ điển với chữ mờ: *"Hoặc tiếp tục với"*.
- Thêm nút bấm Google OAuth:
  - Giao diện: Khung nền kem/trắng `#fffdf7`, viền vàng kim `#deb887`, chữ nâu đậm `#2c1a11`, hover chuyển viền `#8c1d1d`.
  - Icon: Google 'G' icon dạng SVG vector đa sắc tiêu chuẩn.
  - Văn bản: "Tiếp tục với Google".
  - Trạng thái `oauthLoading`: Vô hiệu hóa nút và hiện spinner xoay nhẹ khi đang trong quá trình chuyển hướng tới Google.
- Đọc tham số URL `searchParams.get("error")`:
  - `account_locked`: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị."
  - `oauth_error`: "Không thể xác thực với Google. Vui lòng thử lại sau."

### 3.2 Route Handler Xác Thực (`app/auth/callback/route.ts`)
- Tiếp nhận HTTP GET request:
  ```ts
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const origin = requestUrl.origin;
  ```
- Thực hiện xác thực PKCE:
  ```ts
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  ```
- Kiểm tra tính an toàn của URL chuyển hướng (`getSafeRedirectTarget`):
  - Phải bắt đầu bằng `/`.
  - Không bắt đầu bằng `//` hoặc chứa `://`.
  - Không dẫn ngược vào `/login` hoặc `/admin/login`.
  - Nếu không thỏa mãn, sử dụng trang chủ `/`.
- Bảo vệ tài khoản bị khóa:
  - Lấy `supabase.auth.getUser()`.
  - Truy vấn `profiles` theo `user.id`.
  - Nếu `profile.is_active === false`, gọi `supabase.auth.signOut()` và redirect về `${origin}/login?error=account_locked`.
- Đồng bộ thông tin từ Google Metadata:
  - Nếu `!profile.avatar_url` và user có `user.user_metadata.avatar_url` hoặc `user.user_metadata.picture`, cập nhật `avatar_url`.
  - Nếu `!profile.full_name` và user có `user.user_metadata.full_name` hoặc `user.user_metadata.name`, cập nhật `full_name`.

---

## 4. Xử Lý Ngoại Lệ & An Ninh

| Tình huống | Cách xử lý |
|---|---|
| Không có `code` trong query | Redirect về `/login?error=oauth_error` |
| `exchangeCodeForSession` trả về lỗi | Ghi log và redirect về `/login?error=oauth_error` |
| Tài khoản bị khóa (`is_active = false`) | Huỷ session (`signOut`), redirect về `/login?error=account_locked` |
| Tham số `next` chứa liên kết ngoài (`https://evil.com`) | Lọc bỏ và điều hướng về `/` |
| Mất cấu hình Supabase | Wrapper client trả về lỗi gracefully, không gây crash ứng dụng |

---

## 5. Kế Hoạch Kiểm Thử (Testing Plan)

### 5.1 Kiểm thử tự động (`tests/google-auth.test.mjs`)
1. **Kiểm tra giao diện login**:
   - `app/login/page.tsx` chứa nút Google, icon Google SVG, chữ "Tiếp tục với Google".
   - Không chứa import vi phạm `@supabase/supabase-js`.
   - Có cơ chế xử lý tham số `error` từ URL.
2. **Kiểm tra Route Handler**:
   - Tệp `app/auth/callback/route.ts` tồn tại và export hàm `GET`.
   - Chứa logic `exchangeCodeForSession`.
   - Chứa logic kiểm tra `is_active` và tự động `signOut()` khi tài khoản bị khóa.
   - Chứa logic validate `next` chống Open Redirect.
   - Chứa logic cập nhật `avatar_url` và `full_name` vào bảng `profiles`.
3. **Kiểm thử hồi quy toàn bộ hệ thống**:
   - Chạy `npm test` đảm bảo toàn bộ 127 bài test ban đầu + test mới đều pass 100%.

---

## 6. Hướng Dẫn Cấu Hình Bổ Sung Trên Supabase & Google Cloud (Tài liệu cho người vận hành)
1. **Google Cloud Console**:
   - Tạo OAuth 2.0 Client ID (Web Application).
   - Thêm Authorized redirect URI: `https://<supabase-project-id>.supabase.co/auth/v1/callback`.
2. **Supabase Dashboard**:
   - Vào **Authentication** -> **Providers** -> Bật **Google**.
   - Nhập **Client ID** và **Client Secret** được cấp từ Google Cloud Console.
   - Lưu cấu hình.
