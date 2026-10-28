# Thiết Kế Hệ Thống Tự Động Cào Tin Tức Xã Hòa Trạch Vào Cơ Sở Dữ Liệu

- **Ngày tạo:** 2026-10-28
- **Tác giả:** Antigravity & User
- **Trạng thái:** Chờ phê duyệt (Pending Review)

---

## 1. Mục Tiêu & Yêu Cầu

### 1.1. Mục tiêu
Tự động cào và cập nhật 20 tin tức mới nhất từ Cổng thông tin điện tử UBND Xã Hòa Trạch, Tỉnh Quảng Trị (`https://hoatrach.quangtri.gov.vn/`) vào bảng `blog_posts` của hệ thống giaphadongho.com:
- Định kỳ tự động quét **24 tiếng 1 lần** (hằng ngày vào 06:00 sáng theo giờ Việt Nam, tức 23:00 UTC).
- Có nút bấm **"Cập nhật tin tức Hòa Trạch ngay"** trên trang Quản trị `AdminBlog` ([app/admin/blog/page.tsx](file:///e:/Work/giaphadongho/app/admin/blog/page.tsx)) để Super Admin chủ động quét bất kỳ lúc nào.
- Toàn bộ hình ảnh (ảnh bìa, ảnh trong bài) được tự động tải về và lưu trữ trên **Cloudflare R2** / Supabase Storage của hệ thống để chống lỗi ảnh và chống chặn hotlink từ server nguồn.
- Tự động xuất bản ngay (`is_published: true`, `status: 'published'`, `scope: 'system'`, `visibility: 'public'`).
- Tự động chống trùng lặp bài viết khi chạy định kỳ dựa trên URL bài gốc (`source_url`) hoặc slug tiêu đề.

---

## 2. Kiến Trúc & Luồng Dữ Liệu (Architecture & Data Flow)

```
[ hoatrach.quangtri.gov.vn ]
            │
            ▼ (HTML Fetching)
┌────────────────────────────────────────────────────────┐
│ Crawler Core Engine (lib/crawler/hoatrach.ts)         │
│  1. Quét danh sách bài viết từ các chuyên mục          │
│  2. Sắp xếp lấy 20 bài mới nhất (theo ID epoch time)   │
│  3. Lọc bỏ các bài đã tồn tại trong DB                 │
│  4. Bóc tách chi tiết: Tiêu đề, Tóm tắt, Nội dung, Ảnh │
│  5. Tải ảnh bìa -> Đẩy lên Cloudflare R2 / Storage     │
│  6. Ghi bản ghi vào public.blog_posts                  │
└────────────────────────────────────────────────────────┘
            ▲                           ▲
            │ (Mỗi 24h)                 │ (Kích hoạt thủ công)
┌────────────────────────┐      ┌───────────────────────────────┐
│ Vercel Cron            │      │ Super Admin UI                │
│ (/api/cron/crawl-      │      │ (app/admin/blog/page.tsx)     │
│  hoatrach)             │      │ Server Action trigger         │
└────────────────────────┘      └───────────────────────────────┘
            │                                   │
            └───────────────┬───────────────────┘
                            ▼
                [ Supabase blog_posts ]
                            │
                            ▼
        [ Hiển thị trên /news & Trang chủ / ]
```

---

## 3. Chi Tiết Thành Phần Kỹ Thuật

### 3.1. Cấu Trúc Bóc Tách HTML (Parsing Logic)
Cổng thông tin Hòa Trạch sử dụng Liferay Portal với mẫu cấu trúc ổn định:
- **Danh sách bài viết**:
  - Trang chủ (`/`), chuyên mục `/tin-tuc-su-kien`, `/tin-hoat-dong`, `/tin-nong`.
  - Nhận diện URL dạng: `https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/<catId>/<articleId>`.
  - `<articleId>` là số epoch timestamp mili-giây (ví dụ `1793171184429`), sắp xếp giảm dần để xác định thứ tự bài mới nhất chính xác tuyệt đối.
- **Chi tiết bài viết**:
  - **Tiêu đề**: Thẻ `<h3 class="h1_title_news">...</h3>` hoặc thẻ `.article_title`.
  - **Tóm tắt (Excerpt)**: Thẻ `<div class="article_summary_detail">...</div>` hoặc `.article_summary`.
  - **Nội dung (Content)**: Thẻ `<div class="detail_content_news">...</div>` (lọc bỏ các thẻ script và khối in bài).
  - **Ảnh bìa**: Lấy từ thẻ `img.img_comment` trong danh sách (hoặc ảnh đầu tiên trong bài viết). URL gốc: `/o/3cmsnew-portlet/ViewImage?imagename=...`. Chuyển thành URL tuyệt đối `https://hoatrach.quangtri.gov.vn/...`.
  - **Ngày đăng**: Khớp regex `Ngày đăng:\s*([0-9\/]+)` hoặc chuyển đổi từ epoch timestamp.

### 3.2. Lưu Trữ Hình Ảnh (Storage Pipeline)
- Sử dụng hàm tiện ích `uploadStorageImage(file, { folder: "system/covers", mimeType, fileName })` có sẵn trong hệ thống:
  - Tải file ảnh từ URL nguồn về dưới dạng `Buffer`.
  - Tự động nén sang định dạng `.webp` hiện đại.
  - Tải lên bucket Cloudflare R2 (hoặc Supabase Storage fallback).
  - Trả về CDN URL vĩnh viễn không phụ thuộc server tỉnh Quảng Trị.

### 3.3. Cơ Sở Dữ Liệu (Database Migration)
- Thêm cột `source_url text` và index `idx_blog_posts_source_url` vào bảng `public.blog_posts`:
  ```sql
  ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS source_url text;
  CREATE INDEX IF NOT EXISTS idx_blog_posts_source_url ON public.blog_posts (source_url);
  ```
- Dữ liệu chèn vào `blog_posts`:
  - `scope`: `'system'`
  - `family_id`: `null`
  - `title`: Chuỗi tiêu đề đã chuẩn hóa
  - `slug`: Tạo tự động qua `generateUniqueSlug(title, ...)`
  - `excerpt`: Tóm tắt bài viết
  - `content`: HTML nội dung bài viết kèm chân bài ghi rõ nguồn gốc: *"Nguồn: Cổng thông tin điện tử UBND Xã Hòa Trạch (hoatrach.quangtri.gov.vn)"*
  - `category`: `'TIN ĐỊA PHƯƠNG'` hoặc `'UBND XÃ HÒA TRẠCH'`
  - `cover_image_url`: URL ảnh lưu trên CDN/R2
  - `cover_image_path`: Path trên storage bucket
  - `is_published`: `true`
  - `status`: `'published'`
  - `visibility`: `'public'`
  - `published_at`: Thời điểm đăng bài nguồn
  - `source_url`: URL bài gốc trên hoatrach.quangtri.gov.vn

### 3.4. Định Kỳ Chạy Tự Động (Cron Job & Endpoint)
- **Vercel Cron (`vercel.json`)**:
  ```json
  {
    "regions": ["sin1"],
    "crons": [
      {
        "path": "/api/cron/crawl-hoatrach",
        "schedule": "0 23 * * *"
      }
    ]
  }
  ```
  *(0 23 * * * UTC tương ứng 06:00 sáng giờ Việt Nam mỗi ngày)*.
- **Route Handler (`app/api/cron/crawl-hoatrach/route.ts`)**:
  - Hỗ trợ `GET` (dành cho Vercel Cron) và `POST`.
  - Xác thực qua header `Authorization: Bearer ${CRON_SECRET}` hoặc kiểm tra phiên Super Admin.
  - Cấu hình `export const maxDuration = 60;` (cho phép tối đa 60 giây chạy serverless).

### 3.5. Tác Vụ Quản Trị & Giao Diện (Admin UI & Action)
- **Server Action (`app/actions/crawler.ts`)**:
  - `crawlHoatrachNewsAction()`: Kiểm tra quyền Super Admin, kích hoạt cào tin, trả về kết quả số bài viết mới đã cào.
- **UI Quản trị (`app/admin/blog/page.tsx`)**:
  - Bổ sung nút bấm phong cách Hoàng gia di sản: **"Cào tin Hòa Trạch"** bên cạnh nút "Viết bài mới".
  - Hiển thị spinner khi đang cào và thông báo toast kết quả (ví dụ: *"Đã cào thành công 20 bài viết mới từ UBND Xã Hòa Trạch"*).

---

## 4. Kiểm Thử & Xác Minh (Testing & Verification)

1. **Unit Test**:
   - `tests/hoatrach-crawler.test.ts`:
     - Kiểm tra trích xuất HTML (tiêu đề, nội dung, ngày tháng, ảnh).
     - Kiểm tra logic chống trùng lặp qua `source_url` và `slug`.
     - Kiểm tra cron schedule đúng chuẩn 24h trong `vercel.json`.
     - Kiểm tra xác thực `CRON_SECRET` trong API route.
2. **Integration Test / CLI Verification**:
   - Script chạy thử cào trực tiếp 20 bài viết thực tế vào DB và kiểm tra kết quả hiển thị trên [/news](file:///e:/Work/giaphadongho/app/news/page.tsx).
   - Kiểm tra `npm test` và `npm run build` giữ nguyên 100% pass.

---

## 5. Rủi Ro & Giải Pháp Phòng Ngừa

| Rủi ro | Giải pháp |
|---|---|
| Server hoatrach.quangtri.gov.vn bị nghẽn mạng / timeout | Thêm timeout fetch 10s cho mỗi bài, catch error và bỏ qua bài lỗi mà không làm dừng toàn bộ tiến trình. |
| Ảnh nguồn không tải được | Fallback sử dụng ảnh mặc định hệ thống `/images/landing/logo.png` hoặc ảnh phong cảnh mặc định. |
| Trùng lặp bài viết | Sử dụng `source_url` làm khóa nhận diện duy nhất trước khi tải nội dung chi tiết. |
