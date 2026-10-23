# Roadmap Use Case Member Dòng Họ

## 1. Mục tiêu

Member Dòng Họ không nên chỉ là người đăng nhập để xem dữ liệu. Vai trò này cần có một luồng cá nhân hoàn chỉnh: cập nhật hồ sơ, tìm và xin tham gia dòng họ, rút yêu cầu khi cần, theo dõi trạng thái, đổi mật khẩu, xem thông tin của mình và đóng góp xây dựng cây gia phả thông qua cơ chế đề xuất chờ duyệt.

Roadmap này chia thành 8 phase, mỗi phase tương ứng 1 tuần phát triển.

## 2. Hiện trạng từ source code

Member hiện đã có các nền tảng chính:

- Đăng nhập/đăng ký bằng Supabase Auth.
- Vào `/dashboard` để xem các dòng họ mình có quyền truy cập.
- Tìm dòng họ để xin tham gia thông qua `requestJoinFamilyAction`.
- Xem thông tin giới thiệu dòng họ tại `/dashboard/families/[familySlug]`.
- Khi membership `active`, member xem được workspace dòng họ:
  - Trang tổng quan dòng họ.
  - Danh sách thành viên.
  - Cây gia phả dạng list/tree/mindmap/bubble map.
  - Chi tiết hồ sơ thành viên.
  - Sự kiện.
  - Blog dòng họ.
  - Thống kê.
  - Tra danh xưng.

Các bảng và nền tảng DB đã có nhưng chưa khai thác đủ:

- `profiles` có `full_name`, `phone_number`, `avatar_url`, `must_change_password`.
- `join_requests` có trạng thái `pending`, `approved`, `rejected`, `cancelled`.
- `change_requests` đã có schema và RLS để member gửi đề xuất.
- `notifications` đã có schema và RLS cho thông báo cá nhân.
- `profiles_self_update` cho phép user tự cập nhật profile.

## 3. Gap hiện tại

- Chưa có route hoàn chỉnh cho `/dashboard/profile`, dù UI có link hồ sơ cá nhân.
- Chưa xem được thông tin cá nhân của chính mình trong giao diện rõ ràng.
- Chưa có flow bắt buộc cập nhật hồ sơ trước khi xin tham gia dòng họ.
- Chưa có action/UI cập nhật `full_name`, `phone_number`, `avatar_url`.
- Chưa có chức năng đổi mật khẩu cho member thường.
- Chưa có chức năng rút lại yêu cầu tham gia dòng họ khi request đang `pending`.
- Chưa có trang "Yêu cầu của tôi" để theo dõi yêu cầu tham gia.
- Chưa có chức năng đóng góp xây dựng cây gia phả cho member.
- Chưa có UI gửi đề xuất chỉnh sửa hồ sơ thành viên/cây gia phả.
- Chưa có notification center để member biết yêu cầu hoặc đề xuất đã được xử lý.

## 4. Nguyên tắc thiết kế chức năng

- Member thường không sửa trực tiếp dữ liệu gia phả trong giai đoạn đầu.
- Mọi đóng góp dữ liệu cây gia phả đi qua bảng `change_requests`.
- Admin Dòng Họ hoặc Super Admin duyệt thì dữ liệu thật mới thay đổi.
- Trước khi xin tham gia dòng họ, member bắt buộc cập nhật tối thiểu:
  - Họ và tên.
  - Số điện thoại.
- Member luôn được xem và cập nhật hồ sơ tài khoản của chính mình.
- Member chỉ thấy dữ liệu trong các dòng họ mà họ có membership `active`.
- Member không thấy nút quản trị, xóa, sửa trực tiếp hoặc cấu hình dòng họ.

## 5. Phase 1 - Tuần 1: Hồ sơ cá nhân và onboarding bắt buộc

### Mục tiêu

Member phải có hồ sơ cá nhân tối thiểu trước khi xin tham gia dòng họ. Đây là nền tảng để Admin Dòng Họ nhận diện người xin tham gia.

### Task chi tiết

- Tạo route `/dashboard/profile`.
- Hiển thị email đăng nhập, họ tên, số điện thoại, avatar, vai trò nền tảng, trạng thái tài khoản.
- Tạo form cập nhật hồ sơ cá nhân.
- Validate họ tên và số điện thoại trước khi lưu.
- Tạo server action `updateOwnProfileAction(formData)`.
- Cập nhật Header/Menu để link hồ sơ cá nhân trỏ đúng route.
- Nếu member chưa có họ tên hoặc số điện thoại, redirect từ flow xin tham gia về trang hồ sơ.
- Sau khi cập nhật xong, cho quay lại trang tìm dòng họ.

### Acceptance criteria

- Member xem được hồ sơ cá nhân của mình.
- Member cập nhật được họ tên, số điện thoại, avatar.
- Member chưa đủ hồ sơ không gửi được yêu cầu tham gia.
- Update hồ sơ không cho sửa role, status hoặc dữ liệu của người khác.

## 6. Phase 2 - Tuần 2: Đổi mật khẩu cho member

### Mục tiêu

Member có thể tự đổi mật khẩu mà không cần Super Admin can thiệp.

### Task chi tiết

- Tạo route `/dashboard/change-password`.
- Tạo form nhập mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu mới.
- Tạo server action `changeMemberPasswordAction(formData)`.
- Cho phép member thường dùng chức năng đổi mật khẩu.
- Nếu `must_change_password = true`, bắt buộc đổi mật khẩu trước khi vào dashboard.
- Hiển thị loading/error/success rõ ràng.

### Acceptance criteria

- Member đổi được mật khẩu thành công.
- Mật khẩu mới phải đạt độ dài tối thiểu và khớp confirm.
- Sau khi đổi mật khẩu thành công, `must_change_password` được tắt.
- Lỗi đổi mật khẩu không làm đơ giao diện.

## 7. Phase 3 - Tuần 3: Yêu cầu tham gia dòng họ và rút yêu cầu

### Mục tiêu

Member quản lý được vòng đời yêu cầu tham gia dòng họ của mình.

### Task chi tiết

- Tạo route `/dashboard/my-requests`.
- Liệt kê các yêu cầu tham gia của user:
  - Dòng họ.
  - Trạng thái.
  - Ngày gửi.
  - Ghi chú.
  - Ngày xử lý.
- Cho rút yêu cầu nếu trạng thái đang `pending`.
- Tạo server action `cancelJoinRequestAction(formData)`.
- Cập nhật trang tìm dòng họ:
  - Nếu đã gửi pending request, hiển thị trạng thái "Đang chờ duyệt".
  - Nếu bị từ chối, cho gửi lại với ghi chú mới.
  - Nếu đã là thành viên, hiển thị nút mở workspace.

### Acceptance criteria

- Member xem được toàn bộ yêu cầu của mình.
- Member rút được request đang chờ.
- Không rút được request đã approved/rejected.
- Admin Dòng Họ không còn thấy request đã cancelled trong hàng chờ duyệt chính.

## 8. Phase 4 - Tuần 4: Notification center cho member

### Mục tiêu

Member có nơi theo dõi thông báo liên quan đến yêu cầu tham gia và đóng góp dữ liệu.

### Task chi tiết

- Tạo route `/dashboard/notifications`.
- Hiển thị danh sách thông báo cá nhân từ bảng `notifications`.
- Hỗ trợ trạng thái đã đọc/chưa đọc.
- Tạo action `markNotificationReadAction`.
- Tạo action `markAllNotificationsReadAction`.
- Tạo thông báo khi:
  - Yêu cầu tham gia được duyệt.
  - Yêu cầu tham gia bị từ chối.
  - Đề xuất đóng góp được duyệt.
  - Đề xuất đóng góp bị từ chối.
- Hiển thị badge số thông báo chưa đọc ở header.

### Acceptance criteria

- Member thấy thông báo của chính mình.
- Member không xem được thông báo của người khác.
- Duyệt/từ chối request tạo notification đúng người.

## 9. Phase 5 - Tuần 5: Đóng góp chỉnh sửa hồ sơ thành viên

### Mục tiêu

Member có thể đề xuất sửa thông tin gia phả nhưng không ghi thẳng vào dữ liệu thật.

### Task chi tiết

- Trên trang chi tiết thành viên, thêm nút "Đề xuất chỉnh sửa".
- Tạo form đề xuất sửa:
  - Họ tên.
  - Tên gọi khác.
  - Ngày sinh/ngày mất.
  - Giới tính.
  - Quê quán.
  - Ghi chú công khai.
  - Lý do/nguồn thông tin.
- Ghi đề xuất vào `change_requests`.
- Hiển thị trang `/dashboard/my-contributions`.
- Member xem được trạng thái các đề xuất của mình.

### Acceptance criteria

- Member gửi được đề xuất sửa hồ sơ.
- Dữ liệu thật không đổi trước khi được duyệt.
- Member chỉ gửi đề xuất trong dòng họ mình có membership active.
- Đề xuất có payload đủ để Admin Dòng Họ review diff trước/sau.

## 10. Phase 6 - Tuần 6: Đóng góp thêm người và quan hệ

### Mục tiêu

Member có thể đề xuất thêm người mới hoặc thêm quan hệ vào cây gia phả.

### Task chi tiết

- Tạo form "Đề xuất thêm thành viên".
- Cho chọn người đang muốn liên kết với người mới.
- Cho chọn loại quan hệ:
  - Con ruột.
  - Con nuôi.
  - Con riêng.
  - Vợ/chồng.
  - Quan hệ khác nếu cần.
- Cho nhập thông tin người mới.
- Ghi toàn bộ vào `change_requests`.
- Cho member xem preview quan hệ trước khi gửi.
- Cho member hủy/sửa nháp đề xuất khi chưa gửi nếu có cơ chế draft.

### Acceptance criteria

- Member gửi được đề xuất thêm người.
- Member gửi được đề xuất thêm quan hệ.
- Không ghi trực tiếp vào `persons` hoặc `relationships`.
- Admin Dòng Họ có đủ dữ liệu để duyệt.

## 11. Phase 7 - Tuần 7: Trải nghiệm xem dữ liệu cá nhân hóa

### Mục tiêu

Member không chỉ xem cây chung mà còn có trải nghiệm xoay quanh bản thân và nhánh gia đình của mình.

### Task chi tiết

- Cho member liên kết tài khoản với một hồ sơ `person` trong cây nếu được Admin Dòng Họ xác nhận.
- Tạo trang "Nhánh của tôi".
- Hiển thị:
  - Hồ sơ gắn với tài khoản.
  - Cha/mẹ.
  - Vợ/chồng.
  - Con.
  - Anh chị em.
  - Quan hệ gần.
- Thêm quick link từ profile cá nhân sang hồ sơ gia phả tương ứng.
- Cho member gửi yêu cầu xác nhận "Đây là hồ sơ của tôi".

### Acceptance criteria

- Member có thể xem nhanh nhánh gia đình của mình.
- Việc liên kết tài khoản với person phải được Admin Dòng Họ duyệt.
- Member không tự chiếm hồ sơ của người khác.

## 12. Phase 8 - Tuần 8: Hoàn thiện, audit nhẹ và polish UX

### Mục tiêu

Hoàn thiện trải nghiệm member để dùng ổn định, dễ hiểu và ít lỗi.

### Task chi tiết

- Chuẩn hóa loading/error/success cho các form member.
- Thêm empty state có hành động tiếp theo.
- Thêm audit log nhẹ cho các hành động quan trọng:
  - Cập nhật profile.
  - Gửi/rút yêu cầu tham gia.
  - Gửi đề xuất đóng góp.
- Cập nhật tài liệu hướng dẫn sử dụng cho member.
- Test responsive mobile/tablet.
- Kiểm tra tất cả route member không lộ nút quản trị.

### Acceptance criteria

- Member có luồng hoàn chỉnh từ đăng nhập đến tham gia dòng họ.
- Member đóng góp được dữ liệu nhưng không phá được dữ liệu thật.
- UI rõ trạng thái, không để người dùng bấm xong không biết chuyện gì xảy ra.

## 13. Backlog dài hạn

- Bình luận/thảo luận trên từng hồ sơ thành viên.
- Theo dõi người thân hoặc nhánh yêu thích.
- Gửi tài liệu/hình ảnh làm bằng chứng gia phả.
- Mời người thân vào dòng họ.
- Chế độ xem riêng tư cho hồ sơ của chính mình.
- Lịch nhắc ngày giỗ/sự kiện liên quan đến nhánh của mình.
- Xuất PDF nhánh gia đình cá nhân.

## 14. Test plan tổng thể

- Member chưa cập nhật hồ sơ bị chặn khi xin tham gia.
- Member cập nhật hồ sơ thành công.
- Member đổi mật khẩu thành công.
- Member gửi, xem và rút yêu cầu tham gia.
- Member chỉ xem được dòng họ có membership active.
- Member gửi đề xuất chỉnh sửa/thêm người nhưng dữ liệu thật chưa đổi.
- Member nhận notification sau khi request/contribution được xử lý.
- Member không thấy nút quản trị, xóa, sửa trực tiếp.

## 15. Thứ tự ưu tiên implement

1. Hồ sơ cá nhân.
2. Đổi mật khẩu.
3. Rút yêu cầu tham gia và trang yêu cầu của tôi.
4. Notification center.
5. Đề xuất chỉnh sửa hồ sơ.
6. Đề xuất thêm người/quan hệ.
7. Nhánh của tôi.
8. Polish UX và tài liệu hướng dẫn.
