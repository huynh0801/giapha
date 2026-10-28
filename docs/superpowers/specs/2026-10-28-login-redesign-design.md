# Thiết Kế Kỹ Thuật: Tái Thiết Kế Giao Diện Đăng Nhập & Đăng Ký (Heritage Split-Screen Login)

**Ngày:** 2026-10-28  
**Trạng thái:** Đã phê duyệt  
**Mục tiêu:** Thiết kế lại toàn diện giao diện trang Đăng nhập thành viên (`/login`) và Đăng nhập Quản trị viên (`/admin/login`) theo phong cách Di Sản Hoàng Gia Việt Nam (Vietnamese Heritage) với bố cục chia đôi màn hình (Split-Screen) sang trọng, mang đậm văn hóa cội nguồn và tối ưu trải nghiệm trên mọi thiết bị.

---

## 1. Yêu cầu & Nguyên tắc Thiết kế

1. **Nhận diện thương hiệu & Mỹ thuật:**
   - Đồng bộ hoàn toàn với ngôn ngữ thiết kế của trang chủ (`LandingHero`, `LandingHeader`) và các phân hệ `HeritageUI`:
     - Màu đỏ thắm hoàng tộc: `#8c1d1d`, hover `#6e1616`.
     - Màu vàng đồng di sản / mạ vàng: `#caa455`, `#deb887`.
     - Màu nền giấy dó truyền thống: `#f5e7c7`.
     - Màu chữ nâu đất trầm mặc: `#2c1a11`, phụ trợ `#5c4a3e`.
     - Màu xanh ngọc bích cổ điển: `#183b28`.
   - Sử dụng phông chữ thư pháp cung đình (`SVN-Studio Brush`) cho tiêu đề lớn và `Be Vietnam Pro` cho các nội dung văn bản.
   - Họa tiết mây cuộn cung đình, hoa sen và khung viền di sản `HeritageFrame`.

2. **Bảo toàn các ràng buộc kỹ thuật & bảo mật (Technical Constraints):**
   - Giữ nguyên Server Actions: `loginAction`, `signUpAction`, `adminLoginAction` trong `app/actions/auth.ts`.
   - Tuyệt đối không import Client Supabase (`createClient` từ `@supabase/supabase-js`) trên giao diện client.
   - Giữ nguyên xử lý chuyển hướng an toàn: `window.location.href = result.redirect || "/"`.
   - Giữ nguyên cơ chế kiểm tra môi trường: `process.env.NODE_ENV !== "production"` khi điều hướng `/setup`.
   - Giữ nguyên chuỗi nhận diện bắt buộc trong bài test `tests/multitenant-private.test.mjs`: chữ `Đăng nhập admin` tại `app/admin/login/page.tsx`.

---

## 2. Bố cục & Trải nghiệm Người dùng (UI/UX)

### 2.1. Cột trái (Hero Showcase Panel - Hiện từ màn hình Desktop `lg:flex`)
- **Tỷ lệ:** 45% chiều rộng trên màn hình lớn.
- **Nền:** Họa tiết giấy dó cao cấp kết hợp dải gradient đỏ thắm hoàng gia mờ và khung viền hoa văn truyền thống.
- **Nội dung:**
  - Logo chính thức của dòng họ (`/images/landing/logo.png`) viền ánh kim.
  - Tên nền tảng: **GIA PHẢ DÒNG HỌ** (viết hoa trang trọng).
  - Câu đối truyền thống thư pháp:
    > *"Cây có cội mới trổ cành xanh ngọn,*  
    > *Nước có nguồn mới tỏa nhánh muôn phương."*
  - 3 điểm nổi bật có icon và huy hiệu di sản:
    1. **Bảo Mật Tôn Nghiêm:** Dữ liệu phả hệ chỉ hiển thị khi được duyệt quyền.
    2. **Tra Cứu Danh Xưng:** Trí tuệ gia lễ xác định thứ bậc tôn ti chuẩn xác.
    3. **Lưu Truyền Vạn Đời:** Kết nối các thế hệ muôn phương về chung cội nguồn.
  - Họa tiết mây lành chạm khắc ở chân trang.

### 2.2. Cột phải (Interactive Form Panel)
- **Tỷ lệ:** 55% chiều rộng trên màn hình lớn, chiếm 100% trên điện thoại/tablet.
- **Trang `/login` (Thành viên):**
  - Thanh chuyển đổi Tab dạng pill viền vàng đồng: **Đăng Nhập** ↔ **Đăng Ký Tài Khoản**.
  - Các trường nhập liệu:
    - **Email:** Icon `Mail`, viền đồng, focus đổi sang đỏ hoàng gia.
    - **Mật khẩu:** Icon `KeyRound`, kèm nút con mắt (`Eye` / `EyeOff`) để ẩn/hiện mật khẩu trực quan.
    - **Xác nhận mật khẩu** (khi ở tab Đăng ký).
  - Nút Submit: Nền đỏ `#8c1d1d`, chữ trắng đậm, hiệu ứng chuyển màu khi rê chuột.
  - Nút quay về: Nút liên kết nhẹ nhàng "Quay về trang chủ" có biểu tượng mũi tên truyền thống.
  - Thông báo: Khung viền đỏ/xanh thanh nhã khi có thông báo lỗi hoặc thành công.
- **Trang `/admin/login` (Quản trị hệ thống):**
  - Thiết kế tôn nghiêm với huy hiệu đỏ thắm mạ vàng **"Cổng Quản Trị Hệ Thống"**.
  - Giữ lại nhãn chuẩn `Đăng nhập admin`.
  - Icon `ShieldCheck` và `KeyRound` bảo mật cấp cao.

---

## 3. Kế hoạch Kiểm thử & Đảm bảo an toàn (Testing Strategy)

1. **Bộ test mới `tests/login-redesign.test.mjs`:**
   - Kiểm tra `app/login/page.tsx`:
     - Chứa logo thương hiệu `/images/landing/logo.png`.
     - Có chức năng ẩn/hiện mật khẩu (toggle password visibility).
     - Chứa câu đối ý nghĩa cội nguồn.
     - Tuân thủ không import client supabase.
     - Giữ nguyên `window.location.href = result.redirect || "/"`.
     - Giữ nguyên kiểm tra `process.env.NODE_ENV !== "production"`.
   - Kiểm tra `app/admin/login/page.tsx`:
     - Chứa chuỗi `Đăng nhập admin`.
     - Chứa nhận diện Cổng Quản Trị.
2. **Kiểm thử hồi quy toàn diện:**
   - Chạy `npm test` đảm bảo toàn bộ **88 tests** hiện tại tiếp tục vượt qua (100% Pass).
