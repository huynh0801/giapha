# Thiết Kế Kỹ Thuật: Tối Ưu Hóa Tốc Độ Tải Dữ Liệu & Hiệu Năng Hệ Thống

**Ngày:** 2026-10-28  
**Trạng thái:** Chờ phê duyệt  
**Mục tiêu:** Giảm thiểu độ trễ mạng (latency), triệt tiêu các truy vấn cơ sở dữ liệu dư thừa, loại bỏ hiện tượng gọi tuần tự (waterfall), và tối ưu thời gian khởi động lạnh (cold start) trên môi trường Vercel + Supabase.

---

## 1. Bối cảnh & Nguyên nhân gốc rễ

Qua phân tích và đo đạc mã nguồn dự án:
1. **Vị trí địa lý:** Nếu không có file cấu hình `vercel.json`, Vercel mặc định triển khai Serverless Function tại `iad1` (Washington D.C., Mỹ), trong khi cơ sở dữ liệu Supabase đặt tại Singapore (`ap-southeast-1`). Khoảng cách này gây ra độ trễ mạng ~250ms cho mỗi lượt truy vấn.
2. **Dư thừa kiểm tra DB trong Middleware (`utils/supabase/middleware.ts`):** Trên mọi lượt điều hướng đến các route bảo mật hoặc trang đăng nhập, middleware đều gọi `SELECT id FROM profiles LIMIT 1` để kiểm tra schema đã cài đặt chưa. Trong môi trường production, schema đã hoàn tất từ lâu nhưng câu lệnh này vẫn bị gọi lặp đi lặp lại.
3. **Truy vấn tuần tự (Waterfall queries):**
   - Tại `app/dashboard/page.tsx`: Lần lượt gọi `getProfile()` -> `getAccessibleFamilies()` -> `getFamilyDirectory()`. Thời gian tải trang bằng tổng thời gian của cả 3 truy vấn.
   - Tại `app/news/page.tsx`: Lần lượt truy vấn danh mục (`categories`) -> đếm số lượng (`countQuery`) -> lấy danh sách bài viết (`postsQuery`).
4. **Kích thước gói thư viện (Bundle size) & Cold Start:** Các thư viện đồ họa và icon nặng như `@xyflow/react`, `d3`, `lucide-react` chưa được cấu hình `optimizePackageImports`, khiến kích thước gói serverless lớn và làm tăng thời gian khởi động lạnh.

---

## 2. Kiến trúc & Các thành phần thay đổi

### 2.1. Cố định vùng triển khai Vercel (`vercel.json`)
- Tạo file `vercel.json` ở thư mục gốc:
  ```json
  {
    "regions": ["sin1"]
  }
  ```
- **Tác dụng:** Cố định khu vực Serverless Function tại Singapore (`sin1`), đảm bảo đồng bộ lâu dài trong mã nguồn Git, tránh trường hợp người dùng tạo preview branch hoặc deploy mới bị nhảy về Mỹ.

### 2.2. Tinh gọn Middleware (`utils/supabase/middleware.ts`)
- **Hiện tại:**
  ```ts
  if (isProtectedPath || isLoginPage) {
    const { error: profileError } = await supabase.from("profiles").select("id").limit(1);
    if (profileError && ...) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.redirect("/setup");
      }
    }
  }
  ```
- **Tối ưu:** Đưa điều kiện `process.env.NODE_ENV !== "production"` lên đầu khối kiểm tra:
  ```ts
  if (process.env.NODE_ENV !== "production" && (isProtectedPath || isLoginPage)) {
    const { error: profileError } = await supabase.from("profiles").select("id").limit(1);
    ...
  }
  ```
- **Hiệu quả:** Ở môi trường production, Middleware hoàn toàn không gọi câu lệnh này, tiết kiệm 1 roundtrip DB (~150-250ms) trên mỗi thao tác click chuyển trang. Đồng thời vẫn bảo toàn kiểm thử `tests/security-hardening.test.mjs`.

### 2.3. Tối ưu song song hóa dữ liệu (Parallel Data Fetching)
#### A. Trang Dashboard danh bạ dòng họ (`app/dashboard/page.tsx`)
- Tái cấu trúc việc đọc tham số URL và gọi đồng thời:
  ```ts
  const [profile, families, directory] = await Promise.all([
    getProfile(),
    getAccessibleFamilies(),
    getFamilyDirectory(q, visibility, currentPage),
  ]);
  ```
- **Hiệu quả:** Giảm thời gian chờ từ `t1 + t2 + t3` xuống chỉ còn `max(t1, t2, t3)`.

#### B. Trang Tin tức (`app/news/page.tsx`)
- Kết hợp truy vấn danh mục, đếm tổng số bài viết và danh sách bài viết theo trang chạy song song trong `Promise.all`:
  ```ts
  const [categoryRes, countRes, postsRes] = await Promise.all([
    categoryQuery,
    countQuery,
    postsQuery,
  ]);
  ```

### 2.4. Tối ưu Compiler & Bundle (`next.config.ts`)
- Thêm `experimental.optimizePackageImports` trong `next.config.ts`:
  ```ts
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "d3",
      "@xyflow/react",
      "lunar-javascript",
    ],
  },
  ```
- **Hiệu quả:** Trình biên dịch chỉ trích xuất đúng các component/icon được import thay vì load cả barrel module lớn, thu nhỏ bundle size và tăng tốc cold start.

---

## 3. Kế hoạch kiểm thử & Đảm bảo an toàn (Testing Strategy)

1. **Bộ kiểm thử hồi quy hiện tại:**
   Chạy `npm test` đảm bảo toàn bộ **78/78 tests** hiện tại tiếp tục vượt qua mà không có bất kỳ lỗi phá vỡ nào (đặc biệt là `security-hardening.test.mjs`, `multitenant-private.test.mjs`, `pwa-and-auth-redirect.test.mjs`).
2. **Bộ kiểm thử tối ưu hóa mới (`tests/performance-optimizations.test.mjs`):**
   - Kiểm tra `vercel.json` tồn tại và chứa `"regions": ["sin1"]`.
   - Kiểm tra `next.config.ts` có cấu hình `optimizePackageImports`.
   - Kiểm tra `utils/supabase/middleware.ts` không truy vấn `profiles` khi `NODE_ENV === "production"`.
   - Kiểm tra `app/dashboard/page.tsx` và `app/news/page.tsx` sử dụng cấu trúc `Promise.all` song song.
