# Thiết Kế Kỹ Thuật: Người Dùng Gửi Yêu Cầu Tạo Gia Tộc & Admin Phê Duyệt

- **Ngày tạo:** 2026-10-28
- **Tác giả:** Antigravity Agent
- **Trạng thái:** Đã phê duyệt (Approved)
- **Tài liệu tham chiếu:** `app/actions/family.ts`, `app/dashboard/page.tsx`, `app/admin/families/page.tsx`

---

## 1. Mục tiêu & Bối cảnh

### 1.1 Vấn đề hiện tại
Hiện nay, việc tạo mới một dòng họ (gia tộc) trên hệ thống chỉ có thể do Super Admin (`system_admin`) thực hiện thủ công tại trang `/admin/families`. Người dùng thông thường (`member`) không có cách nào đề xuất hoặc gửi thông tin để xin cấp không gian số cho gia tộc của mình, dẫn đến quá trình mở rộng người dùng và gia tộc bị phụ thuộc hoàn toàn vào quản trị viên hệ thống.

### 1.2 Giải pháp
Cho phép mọi người dùng đã đăng ký tài khoản có thể chủ động điền đơn xin thành lập gia tộc ngay trên **Member Dashboard (`/dashboard`)**. Đơn yêu cầu này sẽ được chuyển vào hàng đợi xét duyệt của Quản trị viên hệ thống tại **`/admin/families`**. Khi Quản trị viên bấm **Phê duyệt**, hệ thống tự động:
1. Tạo một dòng họ mới trong bảng `families` với slug độc bản.
2. Thiết lập người gửi đơn làm **Quản trị viên chính (`family_admin` + `is_primary_admin = true`)** của dòng họ đó.
3. Cập nhật trạng thái đơn thành `approved`, dòng họ mới lập tức xuất hiện trong không gian quản trị gia phả của người dùng.

---

## 2. Kiến trúc Dữ liệu & Cơ sở dữ liệu

### 2.1 Bảng dữ liệu `family_creation_requests`
Tạo bảng mới độc lập để lưu trữ toàn bộ vòng đời của yêu cầu, không làm ảnh hưởng hay rác bảng `families`:

```sql
CREATE TABLE IF NOT EXISTS public.family_creation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    family_name TEXT NOT NULL,
    origin_location TEXT,
    phone_contact TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    rejection_reason TEXT,
    approved_family_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_family_creation_requests_user_id ON public.family_creation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_family_creation_requests_status ON public.family_creation_requests(status);
```

### 2.2 Quy tắc Bảo mật Row Level Security (RLS)
- **Bật RLS** trên bảng `family_creation_requests`.
- **Người dùng thường**:
  - `SELECT`: Chỉ xem được các yêu cầu do chính mình gửi (`user_id = auth.uid()`).
  - `INSERT`: Chỉ tạo yêu cầu cho chính mình (`user_id = auth.uid()`). Giới hạn chống spam: Không được tạo thêm yêu cầu mới nếu đang có ít nhất 1 yêu cầu ở trạng thái `pending`.
  - `UPDATE`: Chỉ được đổi trạng thái thành `cancelled` nếu yêu cầu đang ở trạng thái `pending` và do chính mình sở hữu.
- **Quản trị viên hệ thống (`system_admin`)**:
  - `SELECT`: Xem toàn bộ yêu cầu của tất cả người dùng trong hệ thống.
  - `UPDATE`: Cập nhật trạng thái `approved` / `rejected`, ghi nhận `reviewed_by`, `reviewed_at`, `rejection_reason`.

### 2.3 Stored Procedure Phê Duyệt Nguyên Tử (Atomic RPC)
Đảm bảo tính toàn vẹn tuyệt đối khi phê duyệt: nếu có lỗi phát sinh trong quá trình tạo dòng họ hoặc gán quyền, toàn bộ transaction sẽ rollback:

```sql
CREATE OR REPLACE FUNCTION public.approve_family_creation_request(
    p_request_id UUID,
    p_family_slug TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_req RECORD;
    v_family_id UUID;
    v_slug TEXT;
    v_admin_profile_id UUID;
BEGIN
    -- 1. Kiểm tra quyền Super Admin của người gọi
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Chỉ Quản trị viên hệ thống mới có quyền phê duyệt.');
    END IF;

    -- 2. Lấy dữ liệu yêu cầu
    SELECT * INTO v_req FROM public.family_creation_requests
    WHERE id = p_request_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Yêu cầu không tồn tại hoặc đã được xử lý trước đó.');
    END IF;

    -- 3. Xác định slug độc bản
    v_slug := COALESCE(NULLIF(trim(p_family_slug), ''), slugify(v_req.family_name));
    IF v_slug IS NULL OR length(v_slug) = 0 THEN
        v_slug := 'dong-ho-' || substr(v_req.id::text, 1, 8);
    END IF;

    -- Nếu slug đã tồn tại, tự sinh đuôi ngẫu nhiên
    WHILE EXISTS (SELECT 1 FROM public.families WHERE slug = v_slug) LOOP
        v_slug := v_slug || '-' || floor(random() * 900 + 100)::int::text;
    END LOOP;

    -- 4. Tạo bản ghi dòng họ mới
    INSERT INTO public.families (
        name,
        slug,
        description,
        public_origin_location,
        logo_url,
        visibility,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_req.family_name,
        v_slug,
        v_req.description,
        v_req.origin_location,
        v_req.logo_url,
        'private',
        'active',
        now(),
        now()
    ) RETURNING id INTO v_family_id;

    -- 5. Gán người yêu cầu làm Quản trị viên chính của dòng họ
    INSERT INTO public.family_members (
        family_id,
        profile_id,
        role,
        is_primary_admin,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_family_id,
        v_req.user_id,
        'family_admin',
        true,
        'active',
        now(),
        now()
    );

    -- 6. Cập nhật trạng thái yêu cầu
    UPDATE public.family_creation_requests
    SET status = 'approved',
        approved_family_id = v_family_id,
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        updated_at = now()
    WHERE id = p_request_id;

    RETURN jsonb_build_object(
        'success', true,
        'family_id', v_family_id,
        'slug', v_slug
    );
END;
$$;
```

---

## 3. Server Actions & Luồng Xử Lý Nghiệp Vụ

Tập trung tại `app/actions/family-request.ts`:

1. **`requestFamilyCreationAction(prevState, formData)`**:
   - Kiểm tra phiên đăng nhập và tài khoản hoạt động (`is_active = true`).
   - Validate dữ liệu đầu vào:
     - `family_name`: Bắt buộc, tối thiểu 3 ký tự.
     - `phone_contact`: Bắt buộc, định dạng số điện thoại Việt Nam hợp lệ.
     - `origin_location`: Tùy chọn.
     - `description`: Tùy chọn.
   - Kiểm tra chống spam: Nếu người dùng đã có yêu cầu `pending`, trả về thông báo lỗi: *"Bạn đang có một yêu cầu tạo dòng họ đang chờ xét duyệt. Vui lòng chờ phản hồi trước khi gửi yêu cầu mới."*
   - Xử lý tải ảnh logo (nếu có): Gọi `uploadStorageImage` lưu vào `families/logos`.
   - Ghi dữ liệu vào `family_creation_requests`.
   - `revalidatePath("/dashboard")`.

2. **`cancelFamilyCreationAction(requestId)`**:
   - Kiểm tra quyền sở hữu đơn của người dùng hiện tại.
   - Cập nhật trạng thái sang `cancelled`.
   - `revalidatePath("/dashboard")`.

3. **`approveFamilyCreationAction(requestId, customSlug?)`**:
   - Kiểm tra quyền `role === 'system_admin'`.
   - Gọi RPC `approve_family_creation_request`.
   - `revalidatePath("/admin/families")` và `revalidatePath("/dashboard")`.

4. **`rejectFamilyCreationAction(requestId, reason)`**:
   - Kiểm tra quyền `role === 'system_admin'`.
   - Cập nhật `status = 'rejected'`, ghi nhận `rejection_reason` và `reviewed_by`.
   - `revalidatePath("/admin/families")` và `revalidatePath("/dashboard")`.

---

## 4. Giao Diện Người Dùng (UI/UX)

### 4.1 Khách / Thành viên (`app/dashboard/page.tsx`)
- **Nút hành động chính**: Bổ sung nút bấm di sản `+ Đăng ký tạo gia tộc mới` ở khu vực "Dòng họ bạn tham gia".
- **Modal điền đơn (`CreateFamilyRequestModal.tsx`)**:
  - Thiết kế theo phong cách Cung đình / Di sản nhất quán với toàn hệ thống.
  - Các trường nhập liệu: Tên dòng họ, Quê quán, Số điện thoại, Lời nhắn gửi Admin, Tải logo/hình ảnh biểu trưng.
  - Hỗ trợ xem trước logo, thanh báo tiến trình tải lên, thông báo lỗi rõ ràng.
- **Khối thông báo trạng thái (`FamilyRequestStatusCard.tsx`)**:
  - Nếu user có yêu cầu đang chờ (`pending`): Hiển thị card viền vàng cát ánh kim kèm huy hiệu `Đang chờ xét duyệt`, ngày gửi, và nút `Hủy yêu cầu`.
  - Nếu yêu cầu vừa bị từ chối (`rejected`): Hiển thị lý do từ chối để người dùng nắm bắt và gửi lại yêu cầu mới nếu cần.

### 4.2 Quản trị viên hệ thống (`app/admin/families/page.tsx`)
- **Chuyển đổi Tab (Heritage Tabs)**:
  - Tab 1: **"Danh sách dòng họ"** (Giao diện hiện tại).
  - Tab 2: **"Yêu cầu tạo gia tộc"** (Kèm badge đếm số lượng đơn đang chờ duyệt màu đỏ/cam nổi bật).
- **Danh sách yêu cầu (`AdminFamilyRequestsList.tsx`)**:
  - Bảng / Card thông tin chi tiết:
    - Logo & Tên dòng họ dự kiến.
    - Người gửi: Tên hiển thị, Email, Số điện thoại (bấm gọi/Zalo ngay).
    - Quê quán / Nguyên quán & Lời nhắn giới thiệu.
    - Thời gian gửi.
    - Nút thao tác:
      - **Phê duyệt**: Mở modal xác nhận (cho phép Admin tùy chỉnh slug trước khi duyệt hoặc giữ tự động), bấm duyệt -> hoàn tất tức thì.
      - **Từ chối**: Mở modal nhập lý do từ chối gửi lại cho thành viên.

---

## 5. Kế Hoạch Kiểm Thử (Testing & Verification)

Tạo file kiểm thử tự động `tests/family-creation-requests.test.ts` kiểm tra toàn bộ các khía cạnh:
1. **Validation & Anti-Spam**:
   - Chặn người dùng chưa đăng nhập.
   - Chặn gửi đơn khi thiếu tên dòng họ hoặc số điện thoại.
   - Chặn gửi nhiều đơn `pending` cùng lúc từ một tài khoản.
2. **Quy trình Phê duyệt (Approval)**:
   - Super Admin duyệt đơn thành công: Dòng họ mới được tạo đúng tên, slug không trùng lặp, người yêu cầu trở thành `family_admin` chính.
   - Thành viên thường hoặc Admin dòng họ khác không có quyền gọi hành động duyệt.
3. **Quy trình Từ chối & Hủy (Rejection & Cancellation)**:
   - Super Admin từ chối đơn thành công kèm lý do lưu trong `rejection_reason`.
   - Người yêu cầu có thể tự hủy đơn khi đơn vẫn ở trạng thái `pending`.
4. **Bảo mật & Toàn vẹn Multi-tenant**:
   - Người dùng A không thể xem đơn của Người dùng B.
   - Toàn bộ suite kiểm thử hiện tại (90/90 tests) tiếp tục vượt qua 100%.
