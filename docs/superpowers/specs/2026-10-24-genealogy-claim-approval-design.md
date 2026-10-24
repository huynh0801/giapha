# Thiết Kế Quy Trình Phê Duyệt Phả Hệ (Genealogy Claim & Tree Approval)

## 1. Mục Tiêu
Cung cấp cơ chế tiền kiểm chặt chẽ cho việc định danh thành viên và bổ sung con cháu vào cây gia phả:
- Thành viên gửi yêu cầu nhận danh tính hoặc xin thêm tên vào phả đồ kèm lời nhắn căn cứ huyết thống.
- Yêu cầu ở trạng thái chờ duyệt (`pending`).
- Ban quản trị dòng họ (Tộc trưởng / Admin) xem xét, đối chiếu phả đồ và bấm **Chấp thuận** hoặc **Từ chối**.
- Khi được chấp thuận, hệ thống mới chính thức thực thi gắn kết tài khoản hoặc tạo nhánh phả hệ mới.

---

## 2. Cấu Trúc Dữ Liệu (`families.settings`)
Dữ liệu lưu trữ trong `families.settings` (JSONB) nhằm đảm bảo tương thích 100% với Supabase mà không cần thay đổi schema:

```typescript
export interface GenealogyRequest {
  id: string; // uuid
  family_id: string;
  tree_id: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  type: "claim_person" | "add_person";
  // Nếu là claim_person:
  person_id?: string;
  person_name?: string;
  // Nếu là add_person:
  new_person_data?: {
    full_name: string;
    gender: "male" | "female" | "other";
    birth_year?: number;
    parent_id: string;
    parent_name?: string;
    relationship_type: "father" | "mother";
  };
  message?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
}

export interface FamilySettings {
  member_links?: Record<string, string>; // userId -> personId
  genealogy_requests?: GenealogyRequest[];
}
```

---

## 3. Server Actions (`app/actions/family-claim.ts`)
1. **`requestClaimPersonAction(formData)`**:
   - Xác thực người dùng là thành viên của dòng họ.
   - Thêm bản ghi yêu cầu vào `family.settings.genealogy_requests` với `type: "claim_person"`.
   - Nếu người gửi là Admin dòng họ: tự động chấp thuận ngay (`auto-approve`).
2. **`requestAddPersonAction(formData)`**:
   - Xác thực người dùng là thành viên của dòng họ.
   - Thêm bản ghi yêu cầu vào `family.settings.genealogy_requests` với `type: "add_person"`.
   - Nếu người gửi là Admin dòng họ: tự động chấp thuận ngay (`auto-approve`).
3. **`cancelGenealogyRequestAction(formData)`**:
   - Thành viên tự hủy yêu cầu đang ở trạng thái `pending`.
4. **`reviewGenealogyRequestAction(formData)`**:
   - Dành riêng cho Quản trị viên dòng họ (`canManage`).
   - Nếu `decision === "approved"`:
     - `claim_person`: cập nhật `member_links[userId] = personId`.
     - `add_person`: tạo hồ sơ trong bảng `persons`, tạo quan hệ trong bảng `relationships`, tính toán lại thế hệ bằng `applyTreeLineage`, cập nhật `member_links[userId] = newPerson.id`.
     - Đổi trạng thái yêu cầu thành `approved`.
   - Nếu `decision === "rejected"`:
     - Đổi trạng thái yêu cầu thành `rejected`, lưu `rejection_reason`.

---

## 4. Giao Diện Người Dùng (UI/UX)
1. **Banner Thành viên (`components/dashboard/MemberClaimBanner.tsx`):**
   - **Chưa gửi yêu cầu**: Hiển thị nút "Nhận tên tôi trên cây" và "Thêm tôi vào gia phả" (kèm ô nhập lời nhắn huyết thống).
   - **Đang chờ duyệt (`pending`)**: Huy hiệu màu hổ phách "Đang chờ Ban quản trị duyệt", thông tin người/cha mẹ xin gắn kết, lời nhắn và nút "Hủy yêu cầu".
   - **Bị từ chối (`rejected`)**: Thông báo lý do từ chối từ ban quản trị, nút đóng để gửi yêu cầu mới.
   - **Đã duyệt / Đã liên kết**: Huy hiệu màu ngọc bích "Đã xác thực danh tính", phím tắt tới trang *Tra cứu xưng hô*, *Xem vị trí* và *Hồ sơ cá nhân*.
2. **Trang Quản Trị Yêu Cầu (`app/dashboard/[familySlug]/requests/page.tsx`):**
   - Tab hoặc Phân khu: **"Yêu Cầu Xác Nhận Phả Hệ & Nhận Diện Cây Gia Phả"**.
   - Hiển thị danh sách yêu cầu chờ duyệt với đầy đủ thông tin: Người gửi, Mục tiêu (Nhận ai / Con ai), Lời nhắn, Nút [Chấp thuận] và [Từ chối].
3. **Tự Sửa Hồ Sơ Bản Thân (`app/dashboard/[familySlug]/members/[id]/edit/page.tsx`):**
   - Cho phép thành viên tự cập nhật thông tin cá nhân của chính mình khi `userId` được liên kết với `id` mà không bị chặn quyền.
4. **Trang Tra Cứu Xưng Hô (`app/dashboard/[familySlug]/kinship/page.tsx`):**
   - Tự động điền Người A là thành viên hiện tại nếu đã liên kết.
