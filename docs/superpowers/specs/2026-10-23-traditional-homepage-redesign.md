# Thiết Kế Chi Tiết Giao Diện Trang Chủ Phong Cách Truyền Thống

- **Ngày tạo:** 2026-10-23
- **Tác giả:** huynh0801
- **Dự án:** Gia Phả Dòng Họ (`giaphadongho`)
- **Trạng thái:** Chờ phê duyệt (Pending Approval)

---

## 1. Mục Tiêu & Bối Cảnh (Context & Goal)

Người dùng cung cấp bản thiết kế hoàn chỉnh phong cách mỹ thuật hoài cổ / tranh thủy mặc dân gian Việt Nam (`media_1792732568214_94c9b4b6.jpg`) cùng toàn bộ ảnh tư liệu trong thư mục `E:\Work\giaphadongho\icon`.

Mục tiêu là tái cấu trúc toàn diện trang chủ (`app/page.tsx`) theo đúng 100% ngôn ngữ thiết kế mỹ thuật này, đồng thời tích hợp dữ liệu động từ Supabase (bài viết tin tức mới nhất) và đảm bảo chuẩn responsive mượt mà từ màn hình điện thoại (Mobile) đến máy tính để bàn (Desktop).

---

## 2. Hệ Thống Tài Nguyên Hình Ảnh (Asset Pipeline)

Sao chép và chuẩn hóa tên file từ `icon/` sang `public/images/landing/`:

| Tên file nguồn | Đường dẫn đích | Mục đích sử dụng |
| :--- | :--- | :--- |
| `herosection.png` | `public/images/landing/hero-banner.png` | Tranh thủy mặc toàn cảnh non nước & từ đường (Hero Banner) |
| `icon (1).png` | `public/images/landing/nav-genealogy.png` | Icon Nhà thờ tổ cho mục "Gia phả dòng họ" |
| `icon (2).png` | `public/images/landing/nav-members.png` | Icon Con cháu cho mục "Thành viên" |
| `icon (3).png` | `public/images/landing/nav-documents.png` | Icon Sách cổ cho mục "Tư liệu" |
| `icon (4).png` | `public/images/landing/nav-news.png` | Icon Cuộn giấy & bút lông cho mục "Tin tức - Sự kiện" |
| `icon (5).png` | `public/images/landing/nav-contact.png` | Icon Cành lá xanh cho mục "Liên hệ" |
| `img-detail.png` | `public/images/landing/about-temple.png` | Tranh từ đường trong khối "Về dòng họ chúng tôi" |
| `img-detail2.png` | `public/images/landing/cloud-ornament.png` | Họa tiết áng mây truyền thống trang trí góc |
| `icon-footer.png` | `public/images/landing/footer-clouds.png` | Họa tiết áng mây dải lụa chân trang |

---

## 3. Kiến Trúc Thành Phần (Component Architecture)

Cấu trúc thư mục mới: `components/landing/`

```
components/landing/
├── LandingHeader.tsx         # Thanh điều hướng trên cùng phong cách hoài cổ
├── LandingHero.tsx           # Khối Hero tranh thủy mặc & thư pháp
├── LandingQuickNav.tsx       # Hàng 5 biểu tượng danh mục điều hướng nhanh
├── LandingAbout.tsx          # Khối "Về dòng họ chúng tôi"
├── LandingLatestNews.tsx     # Khối "Tin tức mới nhất" (kết nối Supabase SSR)
├── LandingFooter.tsx        # Dải banner chân trang xanh ngọc hoài cổ
└── types.ts                  # Kiểu dữ liệu Landing Page
```

### 3.1. `LandingHeader.tsx`
- **Logo bên trái:**
  - Con dấu triện đỏ vuông bo góc chứa chữ Hán/Nôm **祖** (Tổ).
  - Tên thương hiệu: **Gia Phả Dòng Họ** (font serif/đậm hoài cổ).
  - Slogan nhỏ bên dưới: *Tôn vinh cội nguồn - Gìn giữ truyền thống*.
- **Menu điều hướng giữa:**
  - *Trang chủ* (có gạch chân đỏ active), *Gia phả* (`/dashboard`), *Thành viên* (`/dashboard`), *Tư liệu* (`/about`), *Tin tức* (`/news`), *Liên hệ* (`/about`).
- **Bên phải:**
  - Biểu tượng kính lúp tìm kiếm (mở thanh tìm kiếm hoặc link `/news`).
  - Họa tiết áng mây phong cách Á Đông.
  - Hamburger menu trên thiết bị di động (Mobile drawer).

### 3.2. `LandingHero.tsx`
- Sử dụng ảnh nền `hero-banner.png` sắc nét với tông màu ấm áp (giấy điệp / giấy dó cổ).
- Bố cục bên trái:
  - Dòng tiêu đề thư pháp cách điệu: **"Dòng họ là gốc rễ của mỗi chúng ta"** (màu xanh rêu đậm `#1b3a29` / đỏ gụ `#7d1d1d`).
  - Cặp câu đối 2 dòng:
    - *Gìn giữ gia phả - Kết nối con cháu*
    - *Duy trì truyền thống - Vững bước tương lai*
  - Nút bấm chính (CTA): Hình con nhộng đỏ gụ mộc bản bo tròn `bg-[#8f1d1d]` với chữ trắng: **"Khám phá gia phả →"** dẫn tới `/dashboard`.

### 3.3. `LandingQuickNav.tsx`
- Hàng 5 thẻ điều hướng nhanh, nền màu giấy cổ sáng `#fcf8ee` với đường viền kẻ phân tách tinh tế:
  1. **Gia phả dòng họ**: "Xem sơ đồ, lịch sử của dòng họ" ➜ `/dashboard`
  2. **Thành viên**: "Danh sách con cháu trong dòng họ" ➜ `/dashboard`
  3. **Tư liệu**: "Lưu trữ hình ảnh, văn bản, hiện vật quý" ➜ `/about`
  4. **Tin tức - Sự kiện**: "Các hoạt động của dòng họ" ➜ `/news`
  5. **Liên hệ**: "Góp ý, liên hệ với ban quản trị" ➜ `/about`
- Responsive: Trên Desktop 5 cột; trên Tablet 3 cột; trên Mobile 2 cột hoặc hàng trượt ngang mượt mà.

### 3.4. `LandingAbout.tsx` & `LandingLatestNews.tsx` (Khối Nội Dung Hai Cột)
- Khung lưới 2 cột tỷ lệ 7 : 5 hoặc 1 : 1 trên Desktop:
  - **Cột trái - "Về dòng họ chúng tôi":**
    - Khung nền giấy cổ có viền bo tròn nhẹ và họa tiết mây vàng `cloud-ornament.png` ở góc dưới.
    - Tranh nhà thờ họ cổ truyền `about-temple.png`.
    - Đoạn văn giới thiệu truyền thống gia phong, đạo lý uống nước nhớ nguồn.
    - Nút bấm đỏ gụ: **"Xem chi tiết →"** dẫn tới `/about`.
  - **Cột phải - "Tin tức mới nhất":**
    - Tiêu đề mục: **Tin tức mới nhất** kèm liên kết **"Xem tất cả →"** dẫn tới `/news`.
    - 3 bài viết mới nhất với ảnh thu nhỏ (thumbnail), tiêu đề, ngày đăng (dd/MM/yyyy), và phần tóm tắt ngắn (excerpt).
    - Dữ liệu được truyền từ Server Component Supabase (kèm fallback 3 bài viết mẫu chuẩn theo thiết kế).

### 3.5. `LandingFooter.tsx`
- Dải lụa chân trang màu xanh rêu cổ điển (`#173824` / `#1a3d28`) với viền mạ vàng tinh tế.
- Họa tiết áng mây `footer-clouds.png` hai bên.
- Thông điệp trung tâm: **"Dòng họ trường tồn - Con cháu hưng thịnh"**.

---

## 4. Dữ Liệu & Server-Side Rendering (`app/page.tsx`)

`app/page.tsx` đóng vai trò là Next.js Server Component:
- Fetch trực tiếp từ bảng `blog_posts` (`is_published = true`, `scope = 'system'`) giới hạn 3 bài mới nhất.
- Truyền danh sách bài viết vào `LandingLatestNews`.
- Nếu database chưa có bài viết hệ thống, tự động hiển thị 3 bài viết mẫu chuẩn thiết kế:
  1. *Lễ giỗ Tổ dòng họ năm 2025* (15/03/2025)
  2. *Cập nhật danh sách con cháu* (10/02/2025)
  3. *Số hóa gia phả dòng họ* (05/01/2025)

---

## 5. Kế Hoạch Kiểm Thử (Testing & Verification)

1. **Kiểm thử tự động:**
   - Đảm bảo toàn bộ 37/37 tests hiện tại trong `npm test` tiếp tục vượt qua 100%.
   - Thêm test case kiểm tra render Landing Page mới, các liên kết điều hướng và fallback tin tức.
2. **Kiểm tra tương thích hiển thị (Visual Verification):**
   - Kiểm tra `herosection.png` và các icon hiển thị sắc nét, không bị méo tỷ lệ (aspect-ratio).
   - Kiểm tra hiển thị chuẩn trên màn hình di động (iPhone / Android) và màn hình máy tính (Desktop).
3. **Build xác thực:**
   - Chạy `npm run build` xác nhận không có lỗi TypeScript, không có hydration mismatch và biên dịch 100% thành công.
