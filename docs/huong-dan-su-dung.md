# Hướng Dẫn Sử Dụng Webapp Gia Phả

Tài liệu này mô tả luồng sử dụng hiện tại sau khi tách rõ hai tầng quản trị: **Super Admin** quản lý toàn bộ nền tảng, còn **Admin dòng họ** quản lý riêng hệ sinh thái của dòng họ được cấp quyền.

## 1. Nguyên tắc phân quyền

- **Super Admin**: quản lý nền tảng, tạo tài khoản, tạo dòng họ và bàn giao Admin dòng họ đầu tiên; sau khi bàn giao không xem/sửa workspace hoặc thêm member cho dòng họ đó.
- **Admin dòng họ**: quản lý dữ liệu trong dòng họ được gán, gồm hồ sơ dòng họ, cây gia phả, thành viên, sự kiện, blog nội bộ và các chức năng riêng của dòng họ.
- **Thành viên**: chỉ xem dữ liệu của dòng họ khi membership ở trạng thái `active`.
- **Guest**: chỉ xem trang công khai và blog hệ thống, không xem được dữ liệu gia phả.

Dữ liệu gia phả mặc định là riêng tư. Người thuộc dòng họ A không xem được cây, hồ sơ, sự kiện hoặc blog nội bộ của dòng họ B.

## 2. Tài khoản seed

Sau khi chạy `docs/schema.sql` và `docs/seed.sql`, dùng tài khoản sau để đăng nhập Super Admin:

- Email: `admin@gmail.com`
- Mật khẩu: `admin1234`

## 3. Super Admin

### Đăng nhập khu hệ thống

1. Vào trang chủ.
2. Bấm **Quản trị**.
3. Đăng nhập tại `/admin/login`.
4. Nếu hệ thống yêu cầu đổi mật khẩu, đổi mật khẩu trước khi vào dashboard.

### Quản lý dòng họ

1. Vào **Admin > Dòng họ**.
2. Tạo dòng họ mới, nhập tên, slug và mô tả.
3. Chọn tài khoản làm **Admin dòng họ đầu tiên**.
4. Sau khi tạo, hệ thống tự sinh cây gia phả mặc định ở trạng thái riêng tư.

Super Admin chỉ tạo dòng họ và bàn giao Admin dòng họ đầu tiên. Sau bước này, Super Admin không mở workspace, không xem cây gia phả, không thêm member và không chỉnh blog nội bộ của dòng họ đó.

### Đăng bài hệ thống

1. Vào **Admin > Blog hệ thống**.
2. Soạn bài, upload ảnh bìa, chọn trạng thái xuất bản.
3. Bài hệ thống xuất hiện ở trang chủ/trang tin công khai.
4. Không đưa dữ liệu gia phả riêng tư vào bài hệ thống.

Admin dòng họ không có quyền vào khu này và không thể đăng bài lên trang chính.

## 4. Admin Dòng Họ

### Vào workspace dòng họ

1. Đăng nhập tại `/login`.
2. Vào `/dashboard`.
3. Chọn dòng họ được cấp quyền.
4. Nếu chỉ có một dòng họ, hệ thống tự chuyển vào workspace dòng họ đó.

### Cập nhật hồ sơ dòng họ

1. Trong workspace, vào **Hồ sơ dòng họ** hoặc `/dashboard/[familySlug]/about`.
2. Cập nhật tên dòng họ, nơi khởi nguyên, mô tả, logo và chế độ hiển thị phần giới thiệu.
3. Dữ liệu gia phả vẫn không bị công khai dù phần giới thiệu có thể được cấu hình cho mục đích tương lai.

### Tạo và quản lý cây gia phả

1. Vào **Quản lý cây** hoặc `/dashboard/[familySlug]/trees`.
2. Tạo cây mới khi cần tách chi phái hoặc nhánh dữ liệu.
3. Có thể đặt một cây làm **cây chính** để làm mặc định.
4. Bấm **Mở cây** trên từng dòng cây để vào `/dashboard/[familySlug]/members?treeId=[treeId]`.
5. Khi đang mở đúng cây, Admin dòng họ có thể thêm thành viên, tạo quan hệ cha/mẹ/con/vợ/chồng và xem 4 dạng view gồm danh sách, sơ đồ cây, mindmap và bubble map.

### Nhập liệu thành viên và quan hệ

1. Vào **Cây gia phả** hoặc `/dashboard/[familySlug]/members?treeId=[treeId]`.
2. Bấm thêm thành viên mới.
3. Nhập họ tên, giới tính, ngày sinh, ngày mất, thứ tự sinh, đời thứ, ghi chú và thông tin riêng tư nếu có.
4. Mở hồ sơ thành viên để chỉnh sửa hoặc quản lý quan hệ cha/mẹ/con/vợ/chồng.

Mọi thao tác chỉ áp dụng trong `family_id` và `tree_id` hiện tại. Thành viên thường chỉ xem được, không thấy nút thêm/sửa/xóa.

### Duyệt yêu cầu tham gia

1. Người dùng chưa có quyền vào `/dashboard`, tìm dòng họ bằng danh bạ, mở chi tiết dòng họ nếu cần và bấm **Gửi yêu cầu**.
2. Admin dòng họ vào **Yêu cầu tham gia** hoặc `/dashboard/[familySlug]/requests`.
3. Xem tên, số điện thoại nếu người dùng đã cập nhật và lời nhắn tự giới thiệu.
4. Bấm **Duyệt** để hệ thống tạo membership active role Thành viên, hoặc **Từ chối** nếu thông tin chưa phù hợp.

### Cập nhật sự kiện

1. Vào **Sự kiện** hoặc `/dashboard/[familySlug]/events`.
2. Xem sinh nhật, ngày giỗ và sự kiện nội bộ.
3. Nếu có quyền chỉnh sửa, bấm **Thêm sự kiện** để tạo lịch họp họ, lễ nghi hoặc ghi chú nội bộ.

### Blog nội bộ dòng họ

1. Vào **Blog dòng họ** hoặc `/dashboard/[familySlug]/blog`.
2. Admin dòng họ có thể soạn bài nội bộ, upload ảnh và xuất bản cho thành viên cùng dòng họ.
3. Bài này không xuất hiện ở trang chủ hoặc trang tin công khai.
4. Thành viên active trong cùng dòng họ có thể đọc bài đã xuất bản.

### Sao lưu và phục hồi

1. Vào **Sao lưu riêng tư** hoặc `/dashboard/[familySlug]/data`.
2. Export JSON, GEDCOM hoặc CSV Zip trong phạm vi cây hiện tại.
3. Import chỉ thay thế dữ liệu trong đúng cây/dòng họ hiện tại, không tác động tenant khác.

## 5. Thành Viên Thường

Thành viên chỉ có quyền xem khi membership trong dòng họ là `active`.

Thành viên có thể:

- Xem dashboard dòng họ.
- Xem cây gia phả, hồ sơ tổ tiên và quan hệ.
- Xem thống kê, tra danh xưng và sự kiện.
- Đọc blog nội bộ đã xuất bản của dòng họ.

Thành viên không được:

- Tạo/sửa/xóa thành viên.
- Tạo cây gia phả mới.
- Sửa hồ sơ dòng họ.
- Đăng bài hệ thống hoặc blog nội bộ.
- Import/export dữ liệu.
- Xem dữ liệu của dòng họ khác.

## 6. Kiểm tra kỹ thuật trước khi demo

Chạy các lệnh sau trong thư mục dự án:

```bash
npm run test
npm run lint
npm run build
```

Nếu thay đổi schema Supabase:

- Cập nhật `docs/schema.sql` để giữ bản full reset mới nhất.
- Cập nhật `docs/seed.sql` nếu dữ liệu mẫu cần đổi.
- Tạo file SQL migration mới trong `supabase/migrations` cho database đang có dữ liệu.
- Review SQL migration rồi apply bằng Supabase Dashboard/SQL Editor hoặc pipeline deploy riêng.

Không chạy lại `docs/schema.sql` và `docs/seed.sql` trên database đang có dữ liệu thật, vì các file này dùng cho reset/dựng mới.
