# Roadmap Use Case Admin Dòng Họ

## 1. Mục tiêu

Admin Dòng Họ là người vận hành nội bộ của một dòng họ cụ thể. Vai trò này cần đủ công cụ để quản lý cây gia phả, thành viên, yêu cầu tham gia, nội dung, sự kiện, dữ liệu riêng tư và các đóng góp từ member. Tuy nhiên Admin Dòng Họ tuyệt đối không được nhìn thấy hoặc can thiệp dữ liệu của dòng họ khác, và không được động vào cấu hình hệ thống của Super Admin.

Roadmap này tập trung biến Admin Dòng Họ thành một vai trò vận hành thật sự: có dashboard riêng, có workflow rõ ràng, có kiểm soát rủi ro và có audit để tránh sửa/xóa dữ liệu nhầm.

## 2. Hiện trạng từ source code

### 2.1. Đã có

- `family_admin` được cấp `context.canEdit` và `context.canManage` trong workspace dòng họ.
- Trang tổng quan dòng họ tại `/dashboard/[familySlug]` đã có các module:
  - Cây gia phả.
  - Tra danh xưng.
  - Thống kê.
  - Sự kiện.
  - Hồ sơ dòng họ.
  - Blog dòng họ.
  - Quản lý cây.
  - Yêu cầu tham gia.
  - Thứ tự gia phả.
  - Sao lưu riêng tư.
- Trang `/dashboard/[familySlug]/requests` đã có duyệt/từ chối yêu cầu tham gia.
- Trang `/dashboard/[familySlug]/about` đã cho Admin Dòng Họ cập nhật thông tin dòng họ.
- Trang `/dashboard/[familySlug]/trees` đã cho tạo cây và đặt cây chính.
- Trang `/dashboard/[familySlug]/members` đã cho xem cây/list/grid và truyền quyền `canEdit/canManage` vào component.
- Trang thêm/sửa thành viên đã chặn member thường bằng `context.canEdit`.
- Sự kiện, blog, import/export dữ liệu đã có server actions kiểm tra quyền theo family context.
- Schema đã có các bảng phù hợp để mở rộng:
  - `family_memberships`.
  - `join_requests`.
  - `change_requests`.
  - `notifications`.
  - `audit_logs`.
  - `documents`.
  - `custom_events`.
  - `blog_posts`.

### 2.2. Đang yếu hoặc chưa trọn workflow

- Chưa có dashboard vận hành riêng cho Admin Dòng Họ; các chức năng đang nằm rải rác theo card.
- Quản lý thành viên dòng họ chưa thành module đầy đủ:
  - Chưa có roster lọc theo role/status.
  - Chưa có thao tác block/unblock/remove membership rõ ràng.
  - Chưa có màn hình lịch sử thành viên và trạng thái tham gia.
- Yêu cầu đóng góp xây dựng cây gia phả của member chưa có workflow review hoàn chỉnh, dù bảng `change_requests` đã tồn tại.
- Một số luồng ghi dữ liệu quan trọng vẫn nằm ở client component, ví dụ `MemberForm` và `RelationshipManager`; nên đưa dần về server actions để thống nhất validate, audit và phân quyền.
- Chưa có notification center cho Admin Dòng Họ và member sau khi duyệt yêu cầu/đóng góp.
- Chưa có công cụ kiểm tra chất lượng dữ liệu cây:
  - Trùng hồ sơ.
  - Quan hệ bị thiếu.
  - Người bị rời cây.
  - Sai đời thứ/generation.
  - Quan hệ tạo vòng lặp.
- Chưa có audit log viewer cho Admin Dòng Họ.
- Chưa có quy trình backup/import có dry-run và cảnh báo trước khi ghi dữ liệu lớn.

## 3. Nguyên tắc thiết kế phân quyền

- Không tạo role phụ như `editor`.
- Chỉ giữ hai role trong phạm vi dòng họ:
  - `family_admin`: quản lý nội bộ dòng họ.
  - `member`: xem và gửi đóng góp nếu được phép.
- `family_admin` chỉ được thao tác trong family mình có membership active.
- `family_admin` không được can thiệp tài khoản có platform role `system_admin`.
- Không cho dòng họ mất Admin Dòng Họ cuối cùng, trừ khi Super Admin chủ động thay thế.
- Mọi thao tác ghi dữ liệu quan trọng phải đi qua server action hoặc RPC có check `family_id`.
- Các thao tác xóa/sửa dữ liệu quan trọng phải có confirm, loading state, lỗi rõ ràng và audit log.

## 4. Phase 1 - Tuần 1: Dashboard vận hành cho Admin Dòng Họ

### Mục tiêu

Tạo một màn hình điều hành cho Admin Dòng Họ, giúp admin mở vào là thấy ngay việc cần làm, thay vì phải dò từng card tính năng.

### Task chi tiết

- Nâng cấp `/dashboard/[familySlug]` để hiển thị dashboard vận hành khi user là `family_admin`.
- Giữ trải nghiệm member gọn hơn, không hiển thị các khối quản trị.
- Thêm các chỉ số nhanh:
  - Tổng thành viên trong dòng họ.
  - Số cây gia phả.
  - Số yêu cầu tham gia đang chờ duyệt.
  - Số đề xuất đóng góp đang chờ review.
  - Sự kiện sắp tới.
  - Bài viết nháp/đang chờ đăng.
- Thêm khu "Việc cần xử lý".
- Thêm checklist khởi tạo dòng họ.
- Tạo link điều hướng nhanh tới các module quản trị.

### Acceptance criteria

- Admin Dòng Họ vào workspace thấy dashboard có việc cần làm và chỉ số quan trọng.
- Member thường không thấy card quản trị.
- Super Admin khi mở workspace vẫn thấy đủ dashboard quản trị để cứu hộ.
- Tất cả card có link thật, không để nút trang trí không bấm được.

## 5. Phase 2 - Tuần 2: Quản lý thành viên dòng họ

### Mục tiêu

Biến quản lý membership thành một module rõ ràng, thay vì chỉ duyệt request rồi để thành viên nằm rải rác trong cây.

### Route đề xuất

- `/dashboard/[familySlug]/memberships`

### Task chi tiết

- Tạo màn hình danh sách membership theo family.
- Hỗ trợ tìm kiếm theo tên, email, số điện thoại.
- Hỗ trợ lọc theo Admin Dòng Họ, member active, blocked, mới duyệt gần đây.
- Hiển thị tên profile, email, vai trò, trạng thái membership, ngày tham gia.
- Thêm action:
  - Thêm thành viên vào dòng họ từ profile active.
  - Block thành viên.
  - Mở block thành viên.
  - Xóa membership khỏi dòng họ.
  - Cấp/hạ quyền Admin Dòng Họ nếu policy cho phép.
- Cảnh báo khi thao tác với Admin Dòng Họ cuối cùng.
- Không cho Admin Dòng Họ tác động lên profile có role `system_admin`.
- Thêm audit log cho các thao tác membership.

### Acceptance criteria

- Admin Dòng Họ quản lý được membership trong đúng dòng họ của mình.
- Admin Dòng Họ không xem được membership của dòng họ khác.
- Member thường không vào được route này.
- Thao tác block/remove có confirm và hiển thị lỗi nếu bị chặn bởi rule.

## 6. Phase 3 - Tuần 3: Review đóng góp xây dựng cây gia phả

### Mục tiêu

Tạo workflow để member gửi đề xuất sửa/thêm dữ liệu, Admin Dòng Họ review và chấp nhận/từ chối có lý do.

### Route đề xuất

- `/dashboard/[familySlug]/contributions`
- `/dashboard/[familySlug]/contributions/[id]`

### Task chi tiết

- Xây module đọc `change_requests` theo family.
- Hỗ trợ các loại đề xuất:
  - Tạo hồ sơ thành viên mới.
  - Sửa thông tin cá nhân.
  - Sửa thông tin riêng tư.
  - Thêm/sửa/xóa quan hệ.
  - Đóng góp tài liệu/hình ảnh.
- Hiển thị diff trước/sau để Admin Dòng Họ review.
- Cho approve/reject với ghi chú bắt buộc khi reject.
- Khi approve, ghi dữ liệu vào bảng đích, cập nhật status, tạo audit log và notification.
- Khi reject, lưu lý do reject và tạo notification cho người gửi.

### Acceptance criteria

- Admin Dòng Họ review được đóng góp của member trong family mình.
- Member nhận được trạng thái của đề xuất.
- Không có ghi dữ liệu trực tiếp khi chưa approve.
- Mọi approve/reject có audit log.

## 7. Phase 4 - Tuần 4: Chuẩn hóa ghi dữ liệu cây gia phả qua server actions

### Mục tiêu

Giảm rủi ro ghi sai/xóa nhầm bằng cách đưa các luồng sửa dữ liệu quan trọng về server actions có check quyền, scope và audit.

### Task chi tiết

- Refactor `MemberForm`:
  - Tạo/sửa `persons` qua server action.
  - Tạo/sửa `person_details_private` qua server action.
  - Validate `family_id`, `tree_id`, `person_id`.
  - Revalidate các route liên quan sau khi lưu.
- Refactor `RelationshipManager`:
  - Search person có scope theo family/tree.
  - Thêm/xóa quan hệ qua server action.
  - Bulk add children qua server action.
- Chuẩn hóa delete member:
  - Confirm rõ ràng.
  - Xóa relationship liên quan.
  - Xóa private details.
  - Xóa person.
  - Audit log.
- Thêm rule validate:
  - Không tạo quan hệ với person khác family/tree.
  - Không tạo self-relationship.
  - Cảnh báo quan hệ trùng.
  - Cảnh báo quan hệ tạo vòng lặp cha/con.

### Acceptance criteria

- Các thao tác tạo/sửa/xóa cây gia phả của Admin Dòng Họ đều qua server action.
- Lỗi phân quyền hoặc sai scope không làm đơ UI.
- Sau mỗi thao tác, tree/list/detail refresh đúng.
- Có audit log cho thao tác quan trọng.

## 8. Phase 5 - Tuần 5: Công cụ kiểm tra chất lượng dữ liệu

### Mục tiêu

Giúp Admin Dòng Họ phát hiện và sửa dữ liệu gia phả sai trước khi cây lớn và khó bảo trì.

### Route đề xuất

- `/dashboard/[familySlug]/quality`

### Task chi tiết

- Tạo health check cho cây gia phả:
  - Person nghi trùng.
  - Person không có quan hệ nào.
  - Person thiếu đời thứ/generation.
  - Quan hệ cha/con tạo vòng lặp.
  - Con có generation không lớn hơn cha/mẹ.
  - Spouse bị trùng lặp.
  - Birth order trùng hoặc thiếu.
  - Hồ sơ thiếu thông tin cơ bản.
- Hiển thị issue theo mức độ nghiêm trọng.
- Tạo quick fix có preview cho các lỗi an toàn.

### Acceptance criteria

- Admin Dòng Họ chạy kiểm tra dữ liệu cho từng cây.
- Hệ thống hiển thị issue rõ ràng và có link tới hồ sơ liên quan.
- Không có quick fix nào tự động ghi dữ liệu nếu chưa confirm.

## 9. Phase 6 - Tuần 6: Nội dung, sự kiện và tư liệu dòng họ

### Mục tiêu

Hoàn thiện vai trò Admin Dòng Họ trong việc xây dựng nội dung và vận hành sinh hoạt dòng họ.

### Task chi tiết

- Blog dòng họ:
  - Quản lý bài nháp, đã đăng, đã ẩn.
  - Preview bài viết trước khi đăng.
  - Gắn tag/category.
  - Quản lý ảnh cover.
  - Lịch sử sửa bài.
- Sự kiện dòng họ:
  - Tạo/sửa/xóa sự kiện.
  - Hỗ trợ ngày dương lịch và âm lịch.
  - Gắn sự kiện với person hoặc branch.
  - Nhắc sự kiện sắp tới.
- Tư liệu:
  - Danh sách document theo family.
  - Upload/gắn tài liệu vào person/sự kiện/bài viết.
  - Trạng thái công khai/nội bộ/riêng tư.
  - Mô tả nguồn tư liệu.

### Acceptance criteria

- Admin Dòng Họ quản lý được nội dung, sự kiện và tư liệu trong workflow rõ ràng.
- Member chỉ xem nội dung được phép xem.
- Nội dung bị ẩn/nháp không lộ ra ngoài public.

## 10. Phase 7 - Tuần 7: Backup, import, export và phục hồi dữ liệu

### Mục tiêu

Giảm rủi ro khi dòng họ có dữ liệu lớn, cần import từ file cũ hoặc sao lưu trước khi sửa nhiều.

### Task chi tiết

- Export dữ liệu cây dạng CSV/JSON.
- Tùy chọn có/không bao gồm thông tin riêng tư.
- Ghi audit log mỗi lần export private data.
- Import dữ liệu có dry-run:
  - Upload file.
  - Validate schema.
  - Báo lỗi theo từng dòng.
  - Preview số person/relationship sẽ tạo/sửa/bỏ qua.
- Tạo snapshot trước thao tác lớn.
- Quản lý cây:
  - Clone cây để thử nghiệm.
  - Archive cây không dùng.
  - Chặn xóa cây chính nếu chưa chọn cây chính khác.

### Acceptance criteria

- Admin Dòng Họ có thể export backup trước khi import/sửa lớn.
- Import có dry-run và không ghi dữ liệu nếu file lỗi.
- Thao tác liên quan private data có audit log.

## 11. Phase 8 - Tuần 8: Notification, audit và báo cáo vận hành

### Mục tiêu

Cho Admin Dòng Họ khả năng theo dõi hoạt động, lịch sử thay đổi và hiệu quả vận hành dòng họ.

### Task chi tiết

- Notification center:
  - Yêu cầu tham gia mới.
  - Đóng góp mới.
  - Đóng góp được approve/reject.
  - Sự kiện sắp tới.
  - Cảnh báo dữ liệu bất thường.
- Audit log viewer:
  - Lọc theo actor, action, entity, ngày.
  - Link về hồ sơ/cây/bài viết liên quan.
- Báo cáo:
  - Số thành viên active.
  - Số thành viên mới theo tháng.
  - Số đóng góp đã xử lý.
  - Tỷ lệ hồ sơ thiếu thông tin.
  - Sự kiện sắp tới.
- Polish UI:
  - Điều hướng quản trị gọn hơn.
  - Empty state có hành động tiếp theo.
  - Loading/error state đồng nhất.
  - Mobile/tablet không vỡ layout.

### Acceptance criteria

- Admin Dòng Họ thấy rõ việc cần xử lý.
- Có thể truy lại lịch sử sửa/xóa quan trọng.
- Báo cáo giúp đánh giá độ đầy đủ của dữ liệu dòng họ.

## 12. Backlog dài hạn

- Workflow xác minh dữ liệu bởi nhiều Admin Dòng Họ.
- Bình luận/thảo luận trên hồ sơ person.
- Công cụ merge person nâng cao.
- Lịch sử phiên bản của từng hồ sơ person.
- Xuất PDF cây gia phả.
- Chia sẻ public giới hạn cho một nhánh/cây.

## 13. Test plan tổng thể

- Admin Dòng Họ vào được route quản trị của family mình.
- Admin Dòng Họ bị chặn khi truy cập family khác.
- Member thường không thấy nút quản trị và bị từ chối nếu gọi action trực tiếp.
- Super Admin vẫn mở được mọi workspace để cứu hộ.
- Duyệt join request tạo membership active.
- Block member làm member mất quyền truy cập workspace.
- Delete person xóa relationships và private details liên quan.
- Approve/reject contribution tạo notification và audit log.
- Import dry-run báo lỗi đúng dòng và không ghi dữ liệu khi file lỗi.

## 14. Thứ tự ưu tiên implement

1. Dashboard vận hành Admin Dòng Họ.
2. Quản lý membership đầy đủ.
3. Review đóng góp `change_requests`.
4. Đưa write path của person/relationship về server actions.
5. Data quality tools.
6. Nội dung, sự kiện, tư liệu.
7. Backup/import/export an toàn.
8. Notification, audit, reporting.

## 15. Ghi chú triển khai

- Nên ưu tiên sửa các route hiện có thay vì tạo quá nhiều route mới trong giai đoạn đầu.
- Các action ghi dữ liệu nên đặt trong `app/actions/*` và dùng chung `getFamilyContextById`/`getFamilyContextBySlug`.
- Các bảng đã có trong schema nên được tận dụng trước khi thêm bảng mới.
- Mỗi migration mới phải đi kèm cập nhật `docs/schema.sql`; không cần chạy lại `seed.sql` cho database đang có dữ liệu.
- UI quản trị nên thiết kế theo hướng dashboard thao tác: bảng, filter, empty state, action rõ ràng; tránh card quá lớn gây khó quản lý khi dữ liệu nhiều.
