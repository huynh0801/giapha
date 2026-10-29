# Thiết Kế: Nhật Ký Cuộc Đời & Niên Biểu Từng Năm (Person Life Timeline)

## 1. Mục Đích & Bối Cảnh
Thay vì chỉ là một bức tâm thư đơn lẻ, hồ sơ của mỗi thành viên trong gia phả cần có tính năng **Nhật ký cuộc đời / Niên biểu từng năm** (Life Timeline). 
Tính năng này giúp lưu giữ lại những cột mốc, sự kiện, dòng nhật ký và kỷ niệm qua từng năm trong cuộc đời của thành viên (ví dụ: năm sinh, năm đi học, năm nhập ngũ, năm kết hôn, năm sinh con, các mốc thăng trầm, thành tựu, kỷ niệm sâu sắc).
Chính người đó (nếu đã liên kết tài khoản) hoặc con/cháu, ban quản trị dòng họ có thể hỗ trợ ghi chép giùm từng mốc năm kèm ảnh kỷ niệm.

---

## 2. Mô Hình Dữ Liệu (Database Schema)

### 2.1. Bảng `public.person_life_events`
Tạo migration: `supabase/migrations/20261029160000_person_life_events.sql`

```sql
CREATE TABLE IF NOT EXISTS public.person_life_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
    year INT NOT NULL,
    month INT CHECK (month IS NULL OR (month >= 1 AND month <= 12)),
    day INT CHECK (day IS NULL OR (day >= 1 AND day <= 31)),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author_type TEXT NOT NULL DEFAULT 'self' CHECK (author_type IN ('self', 'descendant', 'admin')),
    author_name TEXT NOT NULL,
    author_relationship TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_person_life_events_person_year ON public.person_life_events(person_id, year ASC);
CREATE INDEX IF NOT EXISTS idx_person_life_events_family_id ON public.person_life_events(family_id);

ALTER TABLE public.person_life_events ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy
DROP POLICY IF EXISTS "Allow family members to read life events" ON public.person_life_events;
CREATE POLICY "Allow family members to read life events"
ON public.person_life_events
FOR SELECT
USING (
    public.can_view_family(family_id)
    OR EXISTS (
        SELECT 1 FROM public.families
        WHERE id = family_id AND visibility = 'public'
    )
);

-- 2. INSERT Policy
DROP POLICY IF EXISTS "Allow family members to insert life events" ON public.person_life_events;
CREATE POLICY "Allow family members to insert life events"
ON public.person_life_events
FOR INSERT
WITH CHECK (
    public.has_family_role(family_id, ARRAY['family_admin', 'member'])
    OR public.is_system_admin()
);

-- 3. UPDATE Policy
DROP POLICY IF EXISTS "Allow author or admin to update life events" ON public.person_life_events;
CREATE POLICY "Allow author or admin to update life events"
ON public.person_life_events
FOR UPDATE
USING (
    public.has_family_role(family_id, ARRAY['family_admin'])
    OR created_by = auth.uid()
    OR public.is_system_admin()
);

-- 4. DELETE Policy
DROP POLICY IF EXISTS "Allow author or admin to delete life events" ON public.person_life_events;
CREATE POLICY "Allow author or admin to delete life events"
ON public.person_life_events
FOR DELETE
USING (
    public.has_family_role(family_id, ARRAY['family_admin'])
    OR created_by = auth.uid()
    OR public.is_system_admin()
);
```

### 2.2. TypeScript Interface (`types/index.ts`)
```typescript
export interface PersonLifeEvent {
  id: string;
  person_id: string;
  family_id: string;
  tree_id: string;
  year: number;
  month: number | null;
  day: number | null;
  title: string;
  content: string;
  image_url: string | null;
  author_type: "self" | "descendant" | "admin";
  author_name: string;
  author_relationship: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
```

---

## 3. Server Actions (`app/actions/life-events.ts`)

- `getPersonLifeEventsAction(personId: string, familyId: string)`:
  - Lấy danh sách các mốc niên biểu/nhật ký của người đó sắp xếp theo năm tăng dần (`year ASC, month ASC NULLS FIRST, day ASC NULLS FIRST`).
- `savePersonLifeEventAction(payload)`:
  - Thêm mới hoặc cập nhật một mốc năm.
  - Tự động nhận diện tư cách người viết nếu tài khoản liên kết với `person_id`.
  - Revalidate đường dẫn member và tree.
- `deletePersonLifeEventAction(eventId: string, familyId: string, personId: string)`:
  - Cho phép người tạo hoặc Admin xóa mốc năm.

---

## 4. Giao Diện Người Dùng (Heritage Timeline UI)

- **`PersonLifeTimeline.tsx`**:
  - Dòng thời gian liên tục với các mốc năm (Vertical Timeline with Heritage Golden Line).
  - Từng node hiển thị:
    - Huy hiệu năm nổi bật: VD `1975`, `1986`, `2000`
    - Tiêu đề mốc năm
    - Ảnh kỷ niệm (nếu có, viền bo tròn nhẹ, click phóng to)
    - Nội dung dòng nhật ký / ghi chép
    - Người ghi chép (*"Chính chủ ghi chép"*, *"Con gái thứ hai ghi lại"*, v.v.)
    - Nút Sửa / Xóa cho người có quyền
  - Nút **"+ Thêm mốc năm / nhật ký"** ở đầu/cuối dòng thời gian.
  - Khi chưa có mốc nào: Lời mời trang nhã và nút bấm **"+ Thêm mốc năm đầu tiên"**.
- **`PersonLifeEventModal.tsx`**:
  - Modal nhập: Năm (số), Tháng/Ngày (tùy chọn), Tiêu đề, Nội dung nhật ký, Upload hoặc nhập link ảnh kỷ niệm, Người ghi chép, Xưng hô.

---

## 5. Tích Hợp
- Thay thế card tâm thư đơn lẻ trong [components/MemberDetailContent.tsx](file:///e:/Work/giaphadongho/components/MemberDetailContent.tsx) và [app/dashboard/[familySlug]/members/[id]/page.tsx](file:///e:/Work/giaphadongho/app/dashboard/[familySlug]/members/[id]/page.tsx).
