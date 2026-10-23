# Test phân quyền Quản trị chính / Quản trị phụ

## Mục tiêu đã sửa

- Dòng họ có 1 **Quản trị chính** và tối đa 10 **Quản trị phụ**.
- Quản trị chính được thêm/bỏ Quản trị phụ.
- Quản trị phụ vẫn được vận hành dữ liệu dòng họ: nhập Excel, sửa cây gia phả, duyệt yêu cầu tham gia, thêm/xóa hồ sơ.
- Quản trị phụ không được thêm/bỏ/chuyển quyền quản trị viên.
- Khi Super Admin đổi Quản trị chính, người cũ vẫn là Quản trị phụ, không bị hạ xuống thành viên thường.
- Trang workspace dòng họ có thêm ô **Quản trị viên** và breadcrumb quay lại bảng chức năng.

## Cần chạy trước khi test

1. Apply migration mới:

```bash
supabase db push
```

Nếu CI báo thiếu token, vào GitHub/Vercel secrets thêm:

```text
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_ID
SUPABASE_DB_PASSWORD
```

2. Chạy app:

```bash
npm run dev
```

## Test bằng Super Admin

1. Đăng nhập Super Admin.
2. Vào `/admin/families/dashboard`.
3. Chọn một dòng họ.
4. Kiểm tra bảng bên phải:
   - Thấy danh sách tài khoản quản trị.
   - Người chính có nhãn **Quản trị chính** hoặc **Chính**.
   - Người phụ có nhãn **Quản trị phụ** hoặc **Phụ**.
   - Cột **Người gia phả** là số người trong cây gia phả, không phải số tài khoản đăng nhập.
5. Bấm **Quản trị viên** để mở `/dashboard/[familySlug]/admins`.
6. Ở trang này:
   - Super Admin thấy khối **Đổi Quản trị chính**.
   - Chọn một thành viên hoặc Quản trị phụ khác và bấm **Đặt làm Quản trị chính**.
   - Kết quả đúng: người mới thành Quản trị chính, người cũ vẫn còn trong danh sách với nhãn Quản trị phụ.

## Test bằng Quản trị chính

1. Đăng nhập tài khoản đang là Quản trị chính của dòng họ.
2. Vào `/dashboard/[familySlug]`.
3. Kiểm tra có ô **Quản trị viên**.
4. Mở ô đó.
5. Chọn một thành viên active trong khối **Thêm quản trị phụ**.
6. Bấm **Thêm Quản trị phụ**.
7. Kết quả đúng:
   - Thành viên được thêm xuất hiện trong danh sách Quản trị phụ.
   - Có nút **Bỏ quyền quản trị** và **Chặn khỏi dòng họ** với Quản trị phụ.
   - Không có khối **Đổi Quản trị chính** vì chức năng này chỉ dành cho Super Admin.

## Test bằng Quản trị phụ

1. Đăng nhập tài khoản Quản trị phụ.
2. Vào `/dashboard/[familySlug]`.
3. Kiểm tra vẫn thao tác được các chức năng vận hành như:
   - Cây gia phả.
   - Nhập Excel.
   - Yêu cầu tham gia.
   - Thêm/sửa/xóa hồ sơ người trong cây.
4. Vào `/dashboard/[familySlug]/admins`.
5. Kết quả đúng:
   - Xem được danh sách quản trị viên.
   - Không thể thêm/bỏ quản trị viên.
   - Không thấy khối đổi Quản trị chính.

## Test bằng Thành viên thường

1. Đăng nhập tài khoản thành viên thường của dòng họ.
2. Vào `/dashboard/[familySlug]/admins`.
3. Kết quả đúng:
   - Xem được người phụ trách dòng họ.
   - Không thấy form thêm/bỏ/chuyển quyền quản trị.

## Test breadcrumb

1. Từ `/dashboard/[familySlug]`, mở một chức năng bất kỳ như Cây gia phả, Blog, Sự kiện, Quản trị viên.
2. Kiểm tra thanh điều hướng phía trên có nút quay lại bảng chức năng.
3. Bấm nút quay lại.
4. Kết quả đúng: quay về trang có các ô chức năng của dòng họ, không phải đi vòng ra trang chủ.

## Test giới hạn và lỗi cần đúng

- Thêm quá 10 Quản trị phụ: hệ thống phải báo không thêm được.
- Quản trị phụ cố thêm/bỏ admin bằng URL/form: hệ thống phải báo chỉ Super Admin hoặc Quản trị chính được thao tác.
- Super Admin đổi Quản trị chính: Quản trị chính cũ không mất quyền sửa dữ liệu dòng họ.
