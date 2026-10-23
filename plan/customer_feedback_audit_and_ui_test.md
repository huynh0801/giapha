# Audit feedback khách hàng - Blog, QR, quản trị dòng họ

Ngày rà soát: 06/07/2026.

## Đã chỉnh trong lượt này

1. QR dòng họ
   - QR không còn trỏ thẳng vào màn sơ đồ cây/import Excel.
   - QR trỏ sang trang hồ sơ dòng họ: `/dashboard/families/[familySlug]`.
   - Card QR vẫn giữ `Copy link`, `Tải SVG`, `Mở thử`.

2. Ô lưới blog trang chủ
   - Hiệu ứng sương khói dùng linear-gradient chạy theo toàn cạnh, phủ khoảng 30-40% rồi trong dần.
   - Màu sương khói đa dạng: đỏ, cam, vàng, xanh, lam, tím, trắng.
   - Tiêu đề card giảm cỡ chữ để bớt rối.
   - Chuyên mục chỉ ưu tiên hàng đầu; các ô sau bớt chữ gây rối.

3. Chèn ảnh trong trình soạn blog
   - Chèn ảnh tại vị trí con trỏ gần nhất, tự xuống dòng.
   - Ảnh không còn sinh chữ mặc định `Chú thích ảnh`.
   - Nếu caption rỗng hoặc chỉ có `<br>`, hệ thống sẽ bỏ caption khi lưu/hiển thị.
   - Ảnh inline và ảnh bìa vẫn đi qua luồng tối ưu WebP.

4. Bảng tin nội bộ dòng họ
   - Đổi copy từ blog riêng sang `Bảng tin nội bộ` / `Thông báo nội bộ`.
   - Mỗi dòng họ chỉ có một thông báo nội bộ. Muốn đăng mới thì sửa đè hoặc xóa thông báo cũ.
   - Có nút `Xem thêm` dẫn ra trang tin công khai `/news`.

5. Dashboard Super Admin dòng họ
   - Cột `Người gia phả` đếm bảng `persons`, không còn đếm tài khoản admin/member.
   - Card `Tài khoản quản trị đang hoạt động` hiển thị tên/email admin dòng họ.
   - Có nút `Bỏ vai trò quản lý` cho từng admin, chỉ hạ vai trò trong dòng họ, không khóa tài khoản.
   - Card `Tổng số thành viên trong gia phả` dẫn sang danh sách thành viên.

6. Trang dashboard dòng họ
   - Hiển thị `Danh sách quản trị viên` với tên, email, số điện thoại nếu có.
   - Super Admin vẫn có quyền chỉnh sửa như Admin dòng họ thông qua `canEdit/canManage`.

7. Logo
   - Thêm logo SVG riêng tại `public/logo-gia-pha.svg`.
   - Header dashboard đổi từ favicon cũ sang logo mới.

## Đã có sẵn từ trước, cần test lại

1. Tối ưu ảnh upload
   - `utils/imageOptimization.ts` dùng `sharp` để convert ảnh blog sang WebP.
   - Ảnh mới upload sẽ có đuôi `.webp`.
   - Ảnh cũ trên Supabase Storage chưa được backfill vật lý; chỉ ảnh mới đi qua tối ưu.

2. Dữ liệu mẫu cây lớn
   - `docs/seed.sql` đã có nhánh test nhiều thế hệ và nhiều thành viên.
   - Nếu muốn test đúng 40-50 người trên môi trường thật, cần chạy seed trên database test, không chạy trên database production.

3. Thông báo tạo dòng họ
   - Form tạo dòng họ đã có success state và message.
   - Cần test trực tiếp vì nếu refresh/điều hướng quá nhanh có thể người dùng không kịp thấy.

## Cách test trực tiếp trên UI

1. Test ô lưới blog trang chủ
   - Mở `http://localhost:3000`.
   - Kéo tới khu blog dạng ô lưới.
   - Kiểm tra sương khói phủ từ cạnh vào trong, không tụ thành một cục ở góc.
   - Kiểm tra tiêu đề không quá to, không chen lấn chuyên mục.

2. Test chèn ảnh vào nội dung blog
   - Vào `/admin/blog`.
   - Đặt con trỏ giữa hai đoạn văn trong khung `Nội dung`.
   - Bấm `Chèn ảnh`, chọn ảnh.
   - Ảnh phải hiện đúng vị trí con trỏ, nằm riêng một dòng, nội dung cũ không mất.
   - Lưu bài, mở trang bài viết. Nếu không nhập caption thì dưới ảnh không còn chữ `Chú thích ảnh`.

3. Test bảng tin nội bộ dòng họ
   - Vào `/dashboard/[familySlug]/blog`.
   - Kiểm tra tiêu đề là `Thông báo của [tên dòng họ]`.
   - Nếu đã có thông báo, form phải mở thông báo hiện tại để sửa.
   - Thử mở form mới bằng nhiều tab và lưu thêm thông báo thứ hai: server phải báo chỉ được có một bảng tin nội bộ.

4. Test QR
   - Vào `/dashboard/[familySlug]`.
   - Ở card QR, bấm `Copy link` hoặc `Mở thử`.
   - Link phải mở `/dashboard/families/[familySlug]`, không mở `/members?...view=tree`.
   - Bấm `Tải SVG` kiểm tra tải được file QR.

5. Test dashboard Super Admin
   - Vào `/admin/families/dashboard`.
   - Cột `Người gia phả` phải khớp số người trong cây, không phải số tài khoản.
   - Chọn một dòng họ, mở `Xem danh sách tài khoản quản trị`.
   - Kiểm tra email admin hiện ra; bấm `Bỏ vai trò quản lý` chỉ hạ quyền trong dòng họ.

6. Test danh sách quản trị viên trong dòng họ
   - Vào `/dashboard/[familySlug]`.
   - Kiểm tra block `Danh sách quản trị viên` có tên/email admin.
   - Đăng nhập bằng Super Admin và Admin dòng họ đều phải thấy quyền chỉnh sửa workspace.

7. Test migration
   - Cần có `SUPABASE_ACCESS_TOKEN` trong CI/CD trước khi chạy Supabase push.
   - Chạy local hoặc CI: `supabase migration list` và `supabase db push`.
   - Migration mới cần tạo lại `get_admin_families`, cập nhật `get_family_directory`, thêm `get_family_admin_contacts`.
