# Thiết kế Kỹ thuật: Redesign Dashboard Theo Phong Cách Modern Heritage Gia Phả Truyền Thống

- **Ngày tạo:** 2026-10-23
- **Trạng thái:** Đã phê duyệt (Approved)
- **Phạm vi:** 
  - Trang Chọn dòng họ & Danh bạ dòng họ (`app/dashboard/page.tsx`)
  - Trang Không gian làm việc dòng họ (`app/dashboard/[familySlug]/page.tsx`)
  - Bộ linh kiện giao diện truyền thống (`components/dashboard/HeritageUI.tsx`)

---

## 1. Mục tiêu & Định hướng Thiết kế (Goals & Vision)

### 1.1. Mục tiêu
- Đồng bộ toàn diện trải nghiệm người dùng từ Trang chủ (Landing page) vào hệ thống Bảng điều khiển (Dashboard).
- Chuyển đổi giao diện mặc định dạng Tailwind `stone` đơn điệu sang phong cách **Modern Heritage (Hiện đại kết hợp Cổ truyền)**: uy nghiêm, trang trọng, ấm cúng và mang đậm bản sắc văn hóa thờ cúng gia tiên của người Việt.
- Bảo toàn 100% logic bảo mật đa người dùng (Multi-tenant), phân quyền RLS, truy vấn Server-side qua Supabase và các kiểm thử hiện hữu.

### 1.2. Thẩm mỹ & Ngôn ngữ Thiết kế (Visual Language)
- **Tông màu:**
  - Nền giấy điệp / giấy dó hoàng gia: `#f7f3ea` (nền trang), `#fffdf7` (nền khối nội dung).
  - Viền hoàng gia kép: Viền ngoài vàng đồng `#caa455`, viền trong thanh nhã `#deb887`.
  - Góc chỉ truyền thống: 4 góc chỉ chữ L son đỏ `#8c1d1d` (hoặc đồng cổ).
  - Tông chữ & Tiêu đề: Ngọc bích đậm `#183b28`, chữ mô tả nâu gỗ trầm `#5c4a3e` và `#2c1a11`.
  - Ấn triện & Nhãn: Son chu sa `#8c1d1d`, Ngọc bích `#183b28`, Hổ phách `#92540b`.
- **Kiểu chữ (Typography):**
  - Tiêu đề cấp 1 và tên dòng họ: `"SVN-Studio Brush", "Playfair Display", Georgia, serif`.
  - Nhãn, chỉ số và nút bấm: `font-sans font-bold / font-black`, hỗ trợ hiển thị tiếng Việt có dấu chuẩn xác 100%.

---

## 2. Kiến trúc Linh kiện (Component Architecture)

Tạo file mới `components/dashboard/HeritageUI.tsx` để gom các linh kiện giao diện truyền thống tái sử dụng:

### 2.1. `HeritageFrame`
- Khung viền kép đóng dấu bản sắc truyền thống gồm:
  - Khung bao ngoài viền vàng đồng `#caa455`, nền pha sắc ấm `#f5e7c7]/30`, đổ bóng mềm `shadow-[0_4px_20px_rgba(44,26,17,0.06)]`.
  - Khung ruột viền `#deb887`, nền giấy trắng ngà `#fffdf7`.
  - 4 góc chỉ truyền thống sắc nét son đỏ `#8c1d1d` (hoặc màu vàng đồng tùy biến).

### 2.2. `HeritageBadge`
- Thể hiện trạng thái, vai trò dạng ấn triện:
  - `variant="crimson"`: Dành cho Quản trị chính, Quản trị hệ thống (`bg-[#8c1d1d] text-white`).
  - `variant="jade"`: Dành cho Đã là thành viên, Đã duyệt (`bg-[#eaf3ed] text-[#183b28] border border-[#a3c9b2]`).
  - `variant="amber"`: Dành cho Chế độ hiển thị, Đang chờ duyệt (`bg-[#fef8ea] text-[#92540b] border border-[#e8ce8a]`).
  - `variant="neutral"`: Dành cho nhãn trung tính (`bg-[#f4efe6] text-[#5c4a3e] border border-[#deb887]/60`).

### 2.3. `HeritageStatCard`
- Thẻ bài hiển thị chỉ số (Tổng thành viên, Mối quan hệ, Ngày giỗ 30 ngày tới):
  - Biểu tượng truyền thống đặt trong hộp vàng nhạt.
  - Số liệu to bản font serif/sans mạnh mẽ, nhãn tiếng Việt rõ ràng.

---

## 3. Thiết kế Chi tiết Từng Màn hình

### 3.1. Trang `/dashboard` (Chọn dòng họ & Danh bạ)
1. **Tiêu đề trang (Header):**
   - Tiêu đề thư pháp hoàng gia *"KHÔNG GIAN GIA TỘC"* và *"Chọn Dòng Họ & Danh Bạ"*.
   - Khối mô tả nguyên tắc bảo mật thông tin riêng tư gia phả.
2. **Khu vực Dòng họ đang có quyền (`families`):**
   - Hiển thị danh sách dòng họ người dùng đã được duyệt quyền vào không gian làm việc.
   - Mỗi dòng họ là một thẻ `HeritageFrame`:
     - Tên dòng họ font thư pháp sắc sảo.
     - Ấn triện vai trò (Quản trị chính / Thành viên / Quản trị hệ thống) và chế độ chia sẻ.
     - Đường dẫn tắt và nút *"Vào không gian dòng họ"* nổi bật.
3. **Khu vực Danh bạ dòng họ & Xin tham gia:**
   - Hộp tìm kiếm và bộ lọc chế độ hiển thị phong cách thư tịch cổ với viền vàng đồng và nút chu sa son đỏ.
   - Thẻ dòng họ trong danh bạ hiển thị rõ:
     - Tên dòng họ, mô tả giới thiệu công khai.
     - Người phụ trách (Admin dòng họ) và số lượng thành viên.
     - Cụm nút: *"Xem thông tin"* (chi tiết công khai) và *"Gửi yêu cầu tham gia"* (Server Action).
4. **Phân trang (Pagination):**
   - Thiết kế nút chuyển trang phong cách mộc bản thư tịch (Trước / Sau) thanh lịch.

---

### 3.2. Trang `/dashboard/[familySlug]` (Không gian làm việc dòng họ)
1. **Khối Hero Trướng Phủ Dòng Họ:**
   - Được đóng gói trang trọng trong `HeritageFrame` bề thế.
   - Huy hiệu *"Không gian riêng tư dòng họ"*.
   - Tên dòng họ font chữ thư pháp cổ phong to bản (`text-3xl sm:text-4xl text-[#183b28]`).
   - Khối lịch âm - dương song hành (Âm lịch ngày tháng Can Chi và Dương lịch chuẩn Việt Nam).
   - 3 Thẻ bài chỉ số: Thành viên, Mối quan hệ, Sự kiện trong 30 ngày.
2. **Lưới Tính Năng Gia Tộc (Heritage Feature Grid):**
   - 7 tính năng chính (Cây gia phả, Tra danh xưng, Thống kê, Sự kiện giỗ chạp, Hồ sơ dòng họ, Ghi chép nội bộ, Quản trị viên).
   - Các thẻ được thiết kế dạng thẻ bài sơn mài với icon màu ngọc bích, chu sa, vàng kim, hổ phách, hiệu ứng hover viền sáng và bóng đổ hoàng gia.
3. **Khu vực Quản trị & Công cụ nâng cao (Admin/Editor):**
   - Quản lý cây gia phả, Yêu cầu tham gia, Thứ tự gia phả, Sao lưu dữ liệu.
4. **Khối Người phụ trách & Mã QR:**
   - Danh thiếp Quản trị viên với ấn son "Quản trị chính".
   - Khối QR thẻ dòng họ (`FamilyQrCard`) tích hợp hài hòa với viền truyền thống.
5. **Khối Sự kiện & Kỵ nhật sắp tới:**
   - Trình bày thẻ kỵ nhật trang trọng báo trước số ngày tới ngày giỗ của các bậc tiền nhân.

---

## 4. Luồng Dữ Liệu, Bảo Mật & Kế Hoạch Kiểm Thử

### 4.1. Luồng dữ liệu (Data Flow)
- Giữ nguyên các hàm truy vấn Server-side: `getAccessibleFamilies`, `getFamilyDirectory`, `getFamilyContextBySlug`, `computeEvents`, `getTodayLunar`, `getProfile`.
- Giữ nguyên Server Action `requestJoinFamilyAction` và luồng redirect an toàn.

### 4.2. Bảo mật (Security)
- Tuyệt đối không thay đổi logic RLS hay làm lộ khóa Supabase client.
- Tiếp tục duy trì che giấu (masking) thông tin liên hệ của quản trị viên đối với người dùng chưa đăng nhập.

### 4.3. Kế hoạch kiểm thử (Verification)
1. **Unit & Integration Tests:** Chạy `npm test` để xác minh tất cả 48 bài kiểm tra (bao gồm `multitenant-private.test.mjs`, `security-hardening.test.mjs`, `landing-page.test.mjs`, `genealogy-engine.test.ts`, v.v.) tiếp tục PASS 100%.
2. **Production Build:** Chạy `npm run build` để kiểm tra biên dịch TypeScript và tối ưu hóa trang thành công không có lỗi type.
3. **Kiểm tra trực quan:** Xác minh giao diện hoạt động trơn tru tại `http://localhost:3000/dashboard` và các route gia phả.
