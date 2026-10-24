# Kế Hoạch Triển Khai: Phê Duyệt Phả Hệ & Nhận Diện Cây Gia Phả

> **Mục tiêu:** Chuyển đổi cơ chế tự động nhận tên sang cơ chế Tiền kiểm có Ban Quản Trị / Tộc Trưởng phê duyệt chặt chẽ, đồng thời mở rộng quyền tự cập nhật hồ sơ cá nhân và tự động hóa tra cứu xưng hô cho thành viên đã được liên kết.

---

### Task 1: Nâng cấp Server Actions Phê Duyệt Phả Hệ (`app/actions/family-claim.ts`)
- **Mục tiêu:**
  - Hỗ trợ gửi yêu cầu nhận người (`requestClaimPersonAction`) kèm lời nhắn.
  - Hỗ trợ gửi yêu cầu thêm người (`requestAddPersonAction`) kèm lời nhắn.
  - Hỗ trợ hủy yêu cầu (`cancelGenealogyRequestAction`).
  - Hỗ trợ Admin duyệt / từ chối yêu cầu (`reviewGenealogyRequestAction`).
  - Tự động duyệt ngay nếu người gửi là Admin dòng họ.
- **Files to touch:** `app/actions/family-claim.ts`
- **Verification:** Unit test `tests/member-claim.test.mjs` kiểm tra các hàm và xử lý trạng thái `pending`, `approved`, `rejected`, `cancelled`.

---

### Task 2: Cập Nhật Giao Diện Banner Thành Viên (`components/dashboard/MemberClaimBanner.tsx`)
- **Mục tiêu:**
  - Hiển thị form gửi yêu cầu có ô nhập lời nhắn huyết thống.
  - Khi có yêu cầu đang chờ (`pending`), hiển thị Banner hổ phách "Đang chờ Ban quản trị duyệt", thông tin chi tiết và nút "Hủy yêu cầu".
  - Khi yêu cầu bị từ chối (`rejected`), hiển thị lý do từ chối và nút đóng để gửi lại.
  - Khi đã được duyệt (`approved` / `member_links`), hiển thị các phím tắt: *Tra cứu xưng hô*, *Xem vị trí*, *Cập nhật hồ sơ*.
- **Files to touch:** `components/dashboard/MemberClaimBanner.tsx`, `app/dashboard/[familySlug]/page.tsx`, `app/dashboard/[familySlug]/members/page.tsx`

---

### Task 3: Tích Hợp Quản Trị Phê Duyệt Phả Hệ Vào Trang Requests (`app/dashboard/[familySlug]/requests/page.tsx`)
- **Mục tiêu:**
  - Hiển thị danh sách các yêu cầu xác nhận phả hệ (`genealogy_requests`).
  - Cho phép Admin xem người gửi, người xin nhận / con của ai, lời nhắn.
  - Cung cấp form Server Action để bấm [Chấp thuận] hoặc [Từ chối] (kèm lý do).
- **Files to touch:** `app/dashboard/[familySlug]/requests/page.tsx`

---

### Task 4: Cho Phép Thành Viên Tự Cập Nhật Thông Tin Cá Nhân Trên Cây
- **Mục tiêu:**
  - Tại `app/dashboard/[familySlug]/members/[id]/edit/page.tsx`, nếu `user.id` được gắn kết với `id` (`canEditSelf`), cho phép vào trang sửa và lưu thông tin bản thân (không bị chuyển hướng).
  - Server action `updateMemberRecordAction` kiểm tra quyền `canEditAny || canEditSelf`.
- **Files to touch:** `app/dashboard/[familySlug]/members/[id]/edit/page.tsx`, `app/actions/member.ts`

---

### Task 5: Tự Động Chọn Bản Thân Trong Trang Tra Cứu Danh Xưng & Huy Hiệu [Bạn]
- **Mục tiêu:**
  - Trang `app/dashboard/[familySlug]/kinship/page.tsx` truyền ID người được liên kết của user làm mặc định cho `p1` nếu chưa có trên URL.
  - Thẻ thành viên (`PersonCard`) và danh sách hiển thị huy hiệu `[ Bạn ]` nếu là thành viên hiện tại.
- **Files to touch:** `app/dashboard/[familySlug]/kinship/page.tsx`, `components/KinshipFinder.tsx`, `components/PersonCard.tsx`, `components/DashboardMemberList.tsx`

---

### Task 6: Kiểm Thử Toàn Diện & Đóng Gói
- **Mục tiêu:**
  - Cập nhật và bổ sung tests trong `tests/member-claim.test.mjs`.
  - Chạy `npm test` đảm bảo toàn bộ tests đều pass.
  - Chạy `npx tsc --noEmit` và `npm run build`.
  - Git commit & push.
