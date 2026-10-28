# Thiết kế: Nâng cấp Bảng tin Dòng tộc sang Giao diện Di sản & Mở khóa Quyền xem Công khai

**Ngày:** 2026-10-28  
**Tác giả:** Antigravity  
**Trạng thái:** Approved by User  

---

## 1. Vấn đề & Mục tiêu

### 1.1 Vấn đề hiện tại
1. **Không ai xem được bài viết khi đăng:**
   - Khi Admin dòng họ đăng bài viết nội bộ (`scope = 'family'`), bài bị mặc định lưu `visibility = 'private'`.
   - Chính sách RLS database chỉ cho phép thành viên đã duyệt (`can_view_family`) xem. Khách vãng lai, bà con họ hàng chưa đăng nhập/chưa tham gia tài khoản khi truy cập đường link sẽ bị Middleware chặn chuyển hướng về `/login`, hoặc bị lỗi 404.
2. **Bị giới hạn 1 bài duy nhất & mất ảnh bìa:**
   - Trong `app/actions/blog.ts`, hệ thống đang chặn mỗi dòng họ chỉ được có 1 thông tri duy nhất (`existingNotice`).
   - Ảnh bìa bị cố tình xóa về rỗng (`coverImageUrl = ""`), khiến bài viết không thể có ảnh bìa đại diện như các bài viết tin tức.
3. **Giao diện đọc bài thô sơ:**
   - Trang đọc bài dòng họ `/dashboard/[familySlug]/blog/[slug]` đang có giao diện dashboard tối giản, thiếu khung viền hoa văn di sản (`HeritageFrame`), thiếu nền giấy hoàng triều (`BackgroundDecor`) và bố cục tạp chí di sản như trang `/blog/[slug]`.

### 1.2 Mục tiêu giải pháp
1. **Nâng cấp giao diện đọc bản tin dòng họ:**
   - Bố cục trang trọng với `HeritageFrame` hoa văn vàng đồng (`#deb887`), nền giấy truyền thống `BackgroundDecor`, ảnh bìa lớn đóng khung truyền thống, Drop Cap chữ hoa đầu bài và định dạng ảnh theo chuẩn phong cách hoàng gia.
   - Thêm nút "Sao chép liên kết chia sẻ" (Zalo/Facebook) cho bà con trong họ.
2. **Mở khóa xuất bản & Ảnh bìa cho bài viết dòng họ:**
   - Cho phép tải lên Ảnh bìa (tối ưu nén WebP / Supabase Storage / R2).
   - Xóa bỏ giới hạn 1 bài viết, cho phép dòng họ đăng nhiều bài viết, tin tức, thông báo, cáo phó, phóng sự ngày giỗ tổ,...
3. **Hỗ trợ quyền xem linh hoạt (Công khai & Nội bộ):**
   - Admin có thể chọn chế độ hiển thị:
     - **Công khai (`visibility = 'public'`):** Bất kỳ ai có đường link (người trong họ, con cháu ở xa chưa có tài khoản) đều có thể bấm vào đọc bài viết đẹp như một bài báo tin tức.
     - **Nội bộ (`visibility = 'family_only'`):** Chỉ những ai là thành viên dòng họ đã đăng nhập mới đọc được.
   - Cập nhật RLS Policy của Supabase để hỗ trợ `(scope = 'family' AND is_published = true AND visibility = 'public')`.
   - Hỗ trợ xem bài viết dòng họ công khai trực tiếp qua route `/blog/[slug]` (với huy hiệu nguồn gốc dòng họ) và cho phép xem trực tiếp tại `/dashboard/[familySlug]/blog/[slug]`.

---

## 2. Kiến trúc & Thay đổi chi tiết

### 2.1 Cơ sở dữ liệu (Database Migration)
- File: `supabase/migrations/20261028173000_family_blog_public_and_heritage.sql`
- Cập nhật RLS Policy `blog_posts_system_public_or_private_family_select`:
  ```sql
  DROP POLICY IF EXISTS blog_posts_system_public_or_private_family_select ON public.blog_posts;
  CREATE POLICY blog_posts_system_public_or_private_family_select ON public.blog_posts
    FOR SELECT TO anon, authenticated
    USING (
      (
        scope = 'system'
        AND (
          (is_published = true AND visibility = 'public')
          OR public.is_system_admin()
        )
      )
      OR (
        scope = 'family'
        AND family_id IS NOT NULL
        AND (
          (is_published = true AND visibility = 'public')
          OR public.can_view_family(family_id)
        )
      )
    );
  ```

### 2.2 Server Actions (`app/actions/blog.ts`)
- **Ảnh bìa:** Cho phép upload ảnh bìa cho `scope === 'family'` khi có file gửi lên; nếu không có file mới thì giữ nguyên ảnh cũ.
- **Xóa giới hạn 1 bài:** Xóa bỏ đoạn mã kiểm tra `existingNotice` chặn tạo bài thứ 2 trong `saveBlogPostAction`.
- **Tùy chọn hiển thị (`visibility`):** 
  - Đọc trường `visibility` từ formData (`public` hoặc `family_only`).
  - Khi lưu: Nếu là `scope === 'family'`, lưu đúng `visibility` người dùng chọn (mặc định `public` nếu đã xuất bản, hoặc `family_only`).

### 2.3 Giao diện Soạn thảo (`components/BlogAdminPanel.tsx`)
- Hiển thị ô chọn Ảnh bìa và ô chọn Chế độ hiển thị (Công khai / Chỉ nội bộ dòng họ) khi soạn thảo tin dòng họ.

### 2.4 Giao diện Đọc bài Dòng họ (`app/dashboard/[familySlug]/blog/[slug]/page.tsx`)
- Tích hợp `HeritageFrame`, `BackgroundDecor`, `LandingHeader` / nút quay về thông minh, huy hiệu Dòng họ, ảnh bìa trang trọng, thời gian đọc, nút sao chép link chia sẻ, và lưới các bài viết liên quan của cùng dòng họ.

### 2.5 Hỗ trợ Route Đọc Tin tức Chung (`app/blog/[slug]/page.tsx`)
- Mở rộng query trong `app/blog/[slug]/page.tsx`:
  - Tìm bài viết theo slug với `is_published = true`.
  - Nếu là bài của dòng họ (`scope = 'family'`), hiển thị thông tin Dòng họ tác giả (Tên dòng họ, logo, đường dẫn về dòng họ) ngay dưới tiêu đề.

### 2.6 Middleware (`utils/supabase/middleware.ts`)
- Miễn bảo vệ auth đối với route đọc bài dòng họ nếu bài viết được truy cập công khai:
  `request.nextUrl.pathname.match(/^\/dashboard\/[^\/]+\/blog\/[^\/]+$/)` cho phép truy cập nếu bài viết công khai (hoặc chuyển hướng mượt mà sang `/blog/[slug]`).
