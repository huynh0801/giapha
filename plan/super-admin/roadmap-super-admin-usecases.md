# Roadmap Use Case Super Admin

## 1. Mục tiêu

Super Admin là tài khoản chủ hệ thống, có quyền cao nhất trên toàn bộ website. Vai trò này không phải là Admin Dòng Họ của một family cụ thể, mà là lớp quản trị nền tảng và cứu hộ dữ liệu khi hệ thống gặp lỗi, khi Admin Dòng Họ cần hỗ trợ, hoặc khi cần can thiệp để bảo vệ tính đúng đắn của dữ liệu.

Roadmap này định nghĩa bộ chức năng dài hạn cho Super Admin theo từng phase 1 tuần, tập trung vào:

- Quản trị toàn bộ dòng họ trên hệ thống.
- Tạo dòng họ và bàn giao cho Admin Dòng Họ.
- Đổi Admin Dòng Họ chính khi cần.
- Xóa/khóa/khôi phục dòng họ theo quy trình an toàn.
- Quản lý tài khoản nền tảng.
- Quản lý nội dung hệ thống.
- Cứu hộ dữ liệu trên mọi workspace.
- Theo dõi audit, bảo mật, RLS và tình trạng vận hành.

## 2. Hiện trạng từ source code

### 2.1. Đã có

- Platform role hiện tại:
  - `system_admin`: Super Admin.
  - `member`: tài khoản người dùng thông thường.
- Family role hiện tại:
  - `family_admin`: Admin Dòng Họ.
  - `member`: thành viên dòng họ.
- Route Super Admin đã có:
  - `/admin`.
  - `/admin/login`.
  - `/admin/change-password`.
  - `/admin/users`.
  - `/admin/blog`.
  - `/admin/families`.
  - `/admin/families/dashboard`.
- `/dashboard` của `system_admin` hiện redirect sang `/admin/families/dashboard`.
- Super Admin active mới được vào khu `/admin`.
- Super Admin bắt buộc đổi mật khẩu nếu `must_change_password = true`.
- Action/RPC đã có:
  - Tạo user admin/member qua `adminCreateUser`.
  - Đổi trạng thái/role user qua các action trong `app/actions/user.ts`.
  - Tạo dòng họ với Admin Dòng Họ đầu tiên qua `create_family_with_admin`.
  - Lấy danh sách dòng họ quản trị qua `get_admin_families`.
  - Đổi Admin Dòng Họ chính qua `replace_family_admin`.
  - Xóa dòng họ qua `delete_family`.
  - Tạo/sửa/xóa blog hệ thống qua `app/actions/blog.ts`.
- RLS/function đã được chỉnh theo hướng Super Admin có quyền cứu hộ:
  - `can_view_family`.
  - `can_edit_family`.
  - `can_manage_family`.
  - `get_family_directory`.
  - Policy cho families, memberships, trees, persons, relationships, events, private details, documents, blog, audit.

### 2.2. Đang yếu hoặc chưa trọn workflow

- `/admin` vẫn thiên về dashboard tổng quan đơn giản, chưa phải command center toàn hệ thống.
- `/admin/families` và `/admin/families/dashboard` đang tách ý nghĩa chưa thật rõ:
  - Một trang tạo dòng họ.
  - Một trang quản trị danh sách dòng họ.
  - Cần định nghĩa lại vai trò từng route để tránh trùng lặp.
- Super Admin đã xóa được dòng họ nhưng cần quy trình an toàn hơn:
  - Soft delete/archive trước hard delete.
  - Xác nhận bằng slug/tên dòng họ.
  - Cảnh báo số person/relationship/membership sẽ bị ảnh hưởng.
  - Audit log bắt buộc.
- Đổi Admin Dòng Họ chính đã có, nhưng cần thêm:
  - Tìm kiếm user tốt hơn.
  - Lịch sử thay đổi admin.
  - Kiểm tra admin mới có profile đầy đủ.
  - Thông báo cho admin cũ/admin mới.
- Quản lý user còn có nguy cơ lớn:
  - Cần workflow khóa tài khoản, reset mật khẩu, bắt buộc đổi mật khẩu.
  - Cần lọc/search/pagination tốt hơn.
  - Cần lịch sử hành động trên user.
- Chưa có dashboard sức khỏe hệ thống:
  - Tổng visit.
  - Lỗi DB/RPC.
  - Dòng họ thiếu admin active.
  - Family có dữ liệu bất thường.
  - User bị block, pending, inactive.
- Chưa có audit log viewer đầy đủ cho Super Admin.
- Chưa có công cụ kiểm tra RLS/migration/schema drift.
- Chưa có quy trình cứu hộ dữ liệu có checklist và ghi nhận lý do can thiệp.
- Chưa có notification/task inbox riêng cho Super Admin.

## 3. Nguyên tắc thiết kế phân quyền

- `system_admin` được xem là Super Admin, không tạo enum mới `super_admin`.
- Super Admin có quyền mở mọi workspace, xem/sửa/xóa/thêm dữ liệu mọi dòng họ khi cần cứu hộ.
- Super Admin không cần membership trong `family_memberships` để truy cập workspace.
- Super Admin thao tác trực tiếp lên family nào thì action phải ghi audit log:
  - Ai thao tác.
  - Thao tác gì.
  - Family nào.
  - Entity nào.
  - Lý do nếu là thao tác rủi ro.
- Các thao tác nguy hiểm phải có confirm 2 lớp:
  - UI confirm.
  - Server validation.
- Xóa dữ liệu lớn nên ưu tiên archive/soft delete trước hard delete.
- Không để nút chức năng trang trí. Nút nào hiện trên UI phải bấm được hoặc bị disable có lý do rõ ràng.

## 4. Phase 1 - Tuần 1: Super Admin command center

### Mục tiêu

Thiết kế lại `/admin` thành command center đúng nghĩa cho chủ hệ thống, để mở vào là thấy tình trạng toàn bộ nền tảng.

### Task chi tiết

- Nâng cấp `/admin` thành dashboard tổng hợp:
  - Tổng số dòng họ active/archived/suspended.
  - Tổng user active/inactive/blocked.
  - Số Admin Dòng Họ active.
  - Số dòng họ chưa có Admin Dòng Họ active.
  - Số join request pending toàn hệ thống.
  - Số change request pending toàn hệ thống.
  - Số blog hệ thống đã publish/draft.
  - Visit hôm nay/7 ngày/30 ngày.
- Thêm khu "Cần xử lý ngay":
  - Dòng họ không có admin active.
  - User cần đổi mật khẩu.
  - Dòng họ có lỗi dữ liệu nghiêm trọng.
  - Yêu cầu cứu hộ chưa xử lý.
- Thêm quick actions:
  - Tạo dòng họ mới.
  - Mở dashboard dòng họ.
  - Tạo tài khoản.
  - Đăng bài hệ thống.
  - Xem audit log.
- Làm rõ điều hướng:
  - `/admin` = tổng quan hệ thống.
  - `/admin/families` = tạo dòng họ mới.
  - `/admin/families/dashboard` = quản trị danh sách dòng họ.
  - `/admin/users` = quản trị tài khoản.

### Acceptance criteria

- Super Admin vào `/admin` thấy ngay tình trạng hệ thống.
- Tất cả card có dữ liệu thật hoặc empty state có hành động tiếp theo.
- Không hiển thị chỉ số sai vì RLS; nếu RPC lỗi phải hiện lỗi rõ, không hiện "0" gây hiểu nhầm.

## 5. Phase 2 - Tuần 2: Quản trị dòng họ toàn hệ thống

### Mục tiêu

Biến `/admin/families/dashboard` thành màn hình quản trị dòng họ dùng tốt khi có hàng trăm dòng họ.

### Task chi tiết

- Thêm pagination/server-side pagination cho danh sách dòng họ.
- Thêm search theo tên dòng họ, slug, tên/email Admin Dòng Họ, trạng thái.
- Thêm filter active, archived, suspended, chưa có admin active, mới tạo gần đây.
- Click vào cả card/row dòng họ để chọn dòng họ, không bắt buộc bấm nút "Quản trị".
- Panel bên phải chỉ hiển thị:
  - Thông tin dòng họ đang chọn.
  - Admin Dòng Họ active.
  - Nút mở workspace.
  - Nút đổi Admin Dòng Họ chính.
  - Nút archive/suspend/delete theo mức độ rủi ro.
  - Link sang trang thành viên đầy đủ của dòng họ.
- Bỏ việc hiển thị danh sách thành viên đầy đủ trong panel phụ; chỉ hiển thị summary.
- Thêm action archive, restore, suspend, delete có confirm bằng slug.
- Mọi thao tác rủi ro yêu cầu nhập lý do.

### Acceptance criteria

- Danh sách dòng họ dùng được với 100+ dòng họ.
- Super Admin đổi Admin Dòng Họ chính không làm mất admin active.
- Xóa/archive/suspend có confirm và audit log.
- Không load toàn bộ membership chi tiết của mọi family trong một lần.

## 6. Phase 3 - Tuần 3: Tạo dòng họ và bàn giao admin chuẩn chỉnh

### Mục tiêu

Làm flow tạo dòng họ mới gọn, chuyên nghiệp và giảm lỗi khi chọn Admin Dòng Họ đầu tiên.

### Task chi tiết

- Polish `/admin/families` thành form tạo dòng họ riêng, không trộn với dashboard danh sách.
- Trường Admin Dòng Họ đầu tiên đổi thành search combobox:
  - Tìm theo tên/email/số điện thoại.
  - Chỉ hiện profile active role `member`.
  - Hiện badge nếu profile thiếu tên/phone.
  - Không cho chọn `system_admin`.
- Validate slug:
  - Tự sinh từ tên.
  - Check trùng slug trước khi submit.
  - Gợi ý slug thay thế nếu trùng.
- Sau khi tạo thành công:
  - Tạo family.
  - Gán Admin Dòng Họ đầu tiên.
  - Tạo audit log.
  - Tạo notification cho Admin Dòng Họ.
  - Chuyển đến `/admin/families/dashboard?family=<id>` hoặc hiển thị family vừa tạo đang selected.
- Thêm checklist bàn giao.

### Acceptance criteria

- Super Admin tạo dòng họ mới không cần dùng select dài khó chọn.
- Không tạo được dòng họ nếu thiếu Admin Dòng Họ đầu tiên.
- Nếu RPC/migration thiếu, UI báo lỗi rõ ràng.

## 7. Phase 4 - Tuần 4: Quản lý user nền tảng

### Mục tiêu

Hoàn thiện `/admin/users` thành module quản lý tài khoản an toàn, có filter, audit và workflow rõ.

### Task chi tiết

- Thêm search/pagination cho user.
- Lọc theo Super Admin, member, active, inactive, must change password, chưa có profile đầy đủ.
- Action user:
  - Tạo user mới.
  - Khóa/mở khóa tài khoản.
  - Bắt buộc đổi mật khẩu.
  - Reset mật khẩu tạm thời.
  - Đổi role platform member/system_admin có confirm mạnh.
- Chặn thao tác nguy hiểm:
  - Không tự khóa tài khoản Super Admin đang login.
  - Không để hệ thống mất Super Admin active cuối cùng.
- Thêm tab "Memberships" trong detail user.
- Thêm audit log user actions.

### Acceptance criteria

- Quản lý user dùng được với nhiều user.
- Tất cả action nguy hiểm có confirm và server guard.
- Không làm mất Super Admin active cuối cùng.

## 8. Phase 5 - Tuần 5: Cứu hộ workspace và dữ liệu dòng họ

### Mục tiêu

Biến quyền "Super Admin có thể mở mọi workspace" thành một workflow cứu hộ có ghi nhận, tránh thao tác tùy tiện.

### Task chi tiết

- Khi Super Admin mở workspace dòng họ:
  - Hiện banner "Đang ở chế độ cứu hộ Super Admin".
  - Hiện family đang thao tác.
  - Hiện link quay lại dashboard Super Admin.
- Trước khi sửa/xóa dữ liệu trong workspace:
  - Yêu cầu nhập lý do cứu hộ với thao tác rủi ro.
  - Ghi audit log.
- Thêm "Rescue Session":
  - Bắt đầu phiên cứu hộ.
  - Ghi lý do.
  - Ghi các action trong phiên.
  - Kết thúc phiên.
- Thêm quick tools trong workspace:
  - Mở danh sách thành viên family.
  - Mở data quality.
  - Mở audit của family.
  - Export backup trước khi sửa lớn.

### Acceptance criteria

- Super Admin có thể can thiệp dữ liệu mọi family.
- Mọi thao tác cứu hộ quan trọng có audit và reason.
- Admin Dòng Họ/member không thấy chế độ cứu hộ.

## 9. Phase 6 - Tuần 6: Audit log, site analytics và security center

### Mục tiêu

Tạo nơi theo dõi hệ thống để Super Admin biết ai đã làm gì và hệ thống có dấu hiệu bất thường không.

### Route đề xuất

- `/admin/audit`.
- `/admin/analytics`.
- `/admin/security`.

### Task chi tiết

- Audit log viewer:
  - Lọc theo actor, family, action, entity, thời gian.
  - Link tới dữ liệu liên quan nếu còn tồn tại.
- Analytics:
  - Visit theo ngày.
  - Trang được xem nhiều.
  - Dòng họ có hoạt động nhiều.
  - Login/failed login nếu có log.
- Security center:
  - Tài khoản inactive lâu ngày.
  - User cần đổi mật khẩu.
  - Family không có admin active.
  - RPC/RLS warning.
  - Storage policy warning nếu có.
- Export audit/analytics có scope và thời gian.

### Acceptance criteria

- Super Admin tra cứu được lịch sử thao tác quan trọng.
- Có filter để không bị ngợp dữ liệu.
- Các cảnh báo bảo mật có action để xử lý.

## 10. Phase 7 - Tuần 7: Nội dung hệ thống và truyền thông công khai

### Mục tiêu

Hoàn thiện vai trò Super Admin trong việc quản lý trang chủ, tin tức, blog hệ thống và nội dung công khai.

### Task chi tiết

- Nâng cấp `/admin/blog`:
  - Draft/published/archived.
  - Preview trước khi publish.
  - Search/filter/tag/category.
  - Quản lý cover image.
  - Lịch sử sửa bài.
  - Schedule publish nếu cần.
- Quản lý nội dung trang chủ:
  - Email liên hệ.
  - Hotline.
  - Giới thiệu viện/tổ chức.
  - Footer/copyright/link.
  - Blog carousel/trang tin.
- Phân biệt rõ:
  - Blog hệ thống: Super Admin quản lý.
  - Blog dòng họ: Admin Dòng Họ quản lý trong workspace.
- Thêm audit log cho publish/unpublish/delete.

### Acceptance criteria

- Super Admin quản lý được nội dung công khai không cần sửa code.
- Bài viết hệ thống không lẫn với bài viết family.
- Publish/unpublish có audit.

## 11. Phase 8 - Tuần 8: Migration, backup, monitoring và vận hành dài hạn

### Mục tiêu

Giảm phụ thuộc vào thao tác thủ công, giúp Super Admin vận hành hệ thống ổn định khi dữ liệu lớn hơn.

### Task chi tiết

- Migration/schema health:
  - Trang hiển thị version migration đã apply.
  - Cảnh báo khi RPC cần thiết thiếu.
  - Cảnh báo schema docs khác migration gần nhất nếu có cơ chế check.
- Backup:
  - Export toàn bộ metadata family.
  - Export family cụ thể.
  - Export audit log theo thời gian.
  - Hướng dẫn restore an toàn.
- Monitoring:
  - Log lỗi server action.
  - Log lỗi RPC.
  - Trạng thái kết nối Supabase.
  - Thời gian response các RPC quan trọng.
- Maintenance mode:
  - Thông báo hệ thống sắp bảo trì.
  - Tạm ẩn các action ghi nếu cần.
- Tài liệu vận hành:
  - Checklist tạo dòng họ.
  - Checklist đổi Admin Dòng Họ.
  - Checklist xóa/archive dòng họ.
  - Checklist cứu hộ dữ liệu.

### Acceptance criteria

- Super Admin biết DB/RPC có sẵn sàng hay không.
- Có quy trình backup trước khi thao tác rủi ro.
- Có tài liệu vận hành để người mới tiếp quản không bị rối.

## 12. Backlog dài hạn

- Hệ thống ticket hỗ trợ nội bộ giữa Admin Dòng Họ và Super Admin.
- Ghi nhận "yêu cầu cứu hộ" từ Admin Dòng Họ.
- Phân tích chất lượng dữ liệu toàn hệ thống bằng điểm health score.
- Quota theo family:
  - Số thành viên.
  - Dung lượng media/document.
  - Số cây.
- Cảnh báo dung lượng storage.
- Quản lý billing/gói dịch vụ nếu dự án có thu phí.
- Công cụ merge family nếu tạo trùng dòng họ.
- Công cụ transfer ownership khi thay đổi đơn vị quản lý.
- Hệ thống import family hàng loạt cho giai đoạn mở rộng.

## 13. Test plan tổng thể

- User không login bị redirect khỏi `/admin`.
- Member thường không vào được `/admin`.
- Admin Dòng Họ không vào được `/admin`.
- Super Admin inactive không vào được `/admin`.
- Super Admin `must_change_password` bị redirect về `/admin/change-password`.
- Super Admin active vào được tất cả route admin.
- Tạo family thành công với Admin Dòng Họ đầu tiên.
- Không tạo family nếu slug trùng hoặc admin profile không hợp lệ.
- Đổi Admin Dòng Họ chính thành công.
- Archive/restore/suspend/delete có confirm và audit.
- Không khóa Super Admin active cuối cùng.
- Super Admin mở được mọi workspace và thao tác cứu hộ có audit log.
- Bài draft hệ thống không hiển thị ngoài public.

## 14. Thứ tự ưu tiên implement

1. Làm rõ và polish `/admin`, `/admin/families`, `/admin/families/dashboard`.
2. Hoàn thiện pagination/search/filter cho dashboard dòng họ.
3. Làm flow tạo dòng họ + chọn Admin Dòng Họ đầu tiên bằng search combobox.
4. Hoàn thiện quản lý user nền tảng.
5. Thêm audit log viewer và reason cho action nguy hiểm.
6. Thêm rescue mode khi Super Admin mở workspace.
7. Nâng cấp blog/nội dung hệ thống.
8. Thêm monitoring, backup và migration health.

## 15. Ghi chú triển khai

- Nên giữ `/admin/families` cho flow tạo dòng họ, và `/admin/families/dashboard` cho danh sách/quản trị dòng họ để tránh UI bị quá tải.
- Với danh sách lớn, cần pagination và query server-side; không nên load toàn bộ memberships chi tiết của mọi family trong một lần.
- Các RPC Super Admin phải có guard `public.is_system_admin()`.
- Các action nguy hiểm phải có confirm text, reason, audit log và revalidate route liên quan.
- `docs/schema.sql` nên cập nhật song song với migration mới.
- Không cần chạy lại `seed.sql` trên database đang có dữ liệu, trừ khi reset mới môi trường dev.
