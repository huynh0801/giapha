# Thiết Kế: Chức Năng Tâm Thư Trong Hồ Sơ Thành Viên Gia Phả (Person Memorial Letter)

## 1. Mục Đích & Bối Cảnh
Trong gia phả dòng họ, bên cạnh các thông số nhân khẩu học (ngày sinh, ngày mất, mộ phần, nghề nghiệp, thế hệ), các thế hệ con cháu rất coi trọng **di ngôn, tâm thư, lời nhắn nhủ, đạo lý gia phong** do tiền nhân hoặc người thân để lại.
Nhiều trường hợp cụ già lớn tuổi không tự dùng máy tính/điện thoại, hoặc người đã khuất đã để lại di bút trước đây, nên **con/cháu hoặc ban quản trị dòng họ cần có tính năng hỗ trợ chấp bút/viết giùm** và ghi rõ thông tin người chép lại.

Tính năng này cung cấp:
- Mỗi thành viên trong gia phả có thể lưu trữ một bức **Tâm Thư & Lời Dặn Dò** chính thức.
- Thành viên dòng họ đã liên kết với người đó (chính chủ), con/cháu, hoặc Admin dòng họ có thể viết, chỉnh sửa, hoặc chấp bút hộ.
- Giao diện thể hiện trang trọng theo phong cách thư tịch cổ / giấy dó hoàng gia (Heritage Parchment) trong hồ sơ thành viên và popup chi tiết thành viên trên cây gia phả.

---

## 2. Mô Hình Dữ Liệu (Database Schema)

### 2.1. Bảng `public.person_memorial_letters`
Tạo migration mới: `supabase/migrations/20261029150000_person_memorial_letters.sql`:

```sql
CREATE TABLE IF NOT EXISTS public.person_memorial_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Tâm thư gửi đời sau',
    content TEXT NOT NULL,
    author_type TEXT NOT NULL DEFAULT 'self' CHECK (author_type IN ('self', 'descendant', 'admin')),
    author_name TEXT NOT NULL,
    author_relationship TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_person_memorial_letter UNIQUE (person_id)
);

CREATE INDEX IF NOT EXISTS idx_person_memorial_letters_person_id ON public.person_memorial_letters(person_id);
CREATE INDEX IF NOT EXISTS idx_person_memorial_letters_family_id ON public.person_memorial_letters(family_id);

ALTER TABLE public.person_memorial_letters ENABLE ROW LEVEL SECURITY;
```

### 2.2. Row Level Security (RLS)
- **Quyền đọc (`SELECT`):** Cho phép mọi người dùng có quyền xem dòng họ (`can_view_family(family_id)`) hoặc khách nếu dòng họ ở chế độ công khai.
- **Quyền tạo / cập nhật (`INSERT` / `UPDATE`):** Cho phép thành viên tích cực của dòng họ (`has_family_role(family_id, ARRAY['family_admin', 'member'])`) hoặc System Admin.
- **Quyền xóa (`DELETE`):** Cho phép Admin dòng họ hoặc người trực tiếp tạo bức thư (`created_by = auth.uid()`).

---

## 3. Server Actions (`app/actions/memorial-letter.ts`)

### 3.1. `getMemorialLetterAction(personId: string, familyId: string)`
- Truy vấn bảng `person_memorial_letters` theo `person_id`.
- Trả về đối tượng `MemorialLetter | null`.

### 3.2. `saveMemorialLetterAction(input: SaveMemorialLetterInput)`
- **Input:**
  - `personId: string`
  - `familyId: string`
  - `treeId: string`
  - `title: string` (tối đa 200 ký tự)
  - `content: string` (tối thiểu 10 ký tự, hỗ trợ xuống dòng)
  - `authorType: 'self' | 'descendant' | 'admin'`
  - `authorName: string`
  - `authorRelationship?: string`
- **Quy trình:**
  1. Kiểm tra xác thực (`getUser()`).
  2. Xác minh quyền của người dùng trong dòng họ (`getFamilyContextById(familyId)`). Phải có membership active hoặc là Admin.
  3. Tự động nhận diện xưng hô nếu người dùng đã claim hồ sơ này:
     - Nếu `context.family.settings.member_links[user.id] === personId` -> Mặc định là `self`.
  4. Thực hiện `upsert` vào bảng `person_memorial_letters` với `onConflict: 'person_id'`.
  5. Gọi `revalidatePath` cho trang thành viên `/dashboard/[familySlug]/members/[id]` và trang danh sách `/dashboard/[familySlug]/members`.
  6. Trả về `{ success: true, letter: ... }`.

### 3.3. `deleteMemorialLetterAction(personId: string, familyId: string)`
- Kiểm tra quyền: Admin dòng họ hoặc người tạo (`created_by === user.id`).
- Xóa bản ghi trong `person_memorial_letters`.
- `revalidatePath`.
- Trả về `{ success: true }`.

---

## 4. Giao Diện Người Dùng (Frontend UI Components)

### 4.1. Component `MemorialLetterCard` (`components/dashboard/MemorialLetterCard.tsx`)
- Hiển thị trên cả trang chi tiết thành viên và trong modal chi tiết thành viên `MemberDetailModal`.
- **Trạng thái chưa có tâm thư:**
  - Khung viền nét đứt thanh nhã màu cát/hoàng gia.
  - Thông báo: *"Chưa có tâm thư hoặc lời nhắn nhủ từ tiền nhân / thành viên này."*
  - Nút: **"✍️ Để lại tâm thư / Viết giùm"** (chỉ hiển thị với thành viên có quyền).
- **Trạng thái đã có tâm thư:**
  - Khung giấy dó cổ (màu kem ấm `#fcf9f2`, viền đồng mạ `#deb887`, họa tiết truyền thống).
  - Biểu tượng cuộn thư (`Scroll` / `FileText`) và tiêu đề tâm thư.
  - Nội dung tâm thư hiển thị trang trọng, chữ nghiêng nhẹ hoặc font serif truyền thống, định dạng ngắt dòng tự nhiên.
  - Phần chân thư:
    - Huy hiệu người chấp bút: *"Tác giả / Người chấp bút: [authorName] ([authorRelationship])"*.
    - Thời gian: Ngày tạo hoặc ngày cập nhật gần nhất.
    - Nút bấm **"Sửa tâm thư"** và **"Xóa"** (cho người có quyền).

### 4.2. Modal `MemorialLetterModal` (`components/dashboard/MemorialLetterModal.tsx`)
- Popup soạn thảo với giao diện gọn gàng, hỗ trợ cả di động và máy tính:
  - Trường **Tiêu đề** (mặc định gợi ý: *"Tâm thư gửi cháu con muôn đời"*, *"Lời dặn dò tâm huyết"*,...).
  - Trường **Loại người viết / chấp bút**:
    - `self`: "Chính bản thân tôi viết"
    - `descendant`: "Con / Cháu chấp bút ghi lại"
    - `admin`: "Ban quản trị / Người thân đại diện ghi chép"
  - Trường **Họ tên người viết** (tự điền họ tên tài khoản đang đăng nhập).
  - Trường **Quan hệ / Xưng hô** (ví dụ: "Con trai cả", "Cháu nội", "Hậu duệ đời thứ 12",...).
  - Trường **Nội dung tâm thư** (Textarea lớn, tự co giãn, hướng dẫn nhập lời dặn dò, tâm sự).
  - Nút "Lưu tâm thư" kèm trạng thái loading và thông báo lỗi/thành công.

---

## 5. Kiểm Thử & Tiêu Chí Nghiệm Thu (Testing & Acceptance Criteria)
1. **Kiểm thử Schema & Migration:**
   - File SQL tạo bảng có đầy đủ khóa ngoại, unique constraint, trigger, và RLS policies.
2. **Kiểm thử Server Action:**
   - Người chưa đăng nhập không thể lưu/xóa tâm thư.
   - Thành viên trong dòng họ có thể lưu tâm thư cho bất kỳ người nào với tư cách viết giùm (descendant/admin).
   - Bản thân người đã liên kết có thể lưu với tư cách `self`.
   - Admin có thể xóa/chỉnh sửa tâm thư của bất kỳ ai.
3. **Kiểm thử Giao Diện (Unit / Integration Test):**
   - Viết test suite `tests/memorial-letter.test.mjs` kiểm tra xuất khẩu component, props, logic render khi có/không có tâm thư, và các tương tác modal.
   - Toàn bộ 115 bài test cũ và test mới đều phải vượt qua (`npm test`).
   - `npm run build` không có lỗi biên dịch TypeScript.
