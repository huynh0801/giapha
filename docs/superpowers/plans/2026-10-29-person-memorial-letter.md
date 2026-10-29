# Person Memorial Letter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm chức năng lưu trữ và hiển thị "Tâm thư & Lời dặn dò" trong hồ sơ thành viên (profile), cho phép chính chủ, con/cháu (viết giùm), hoặc admin soạn thảo và chỉnh sửa.

**Architecture:** Bảng dữ liệu `person_memorial_letters` riêng biệt với quan hệ 1-1 tới `persons`, bảo vệ qua RLS; Server Actions xử lý xác thực, phân quyền và upsert; các UI component mang phong cách Heritage thư tịch cổ tích hợp vào trang chi tiết thành viên và modal xem nhanh trên cây gia phả.

**Tech Stack:** Next.js (App Router, Server Actions), Supabase (PostgreSQL, RLS), React 19, TypeScript, Lucide Icons, Node test runner (`node --test`).

## Global Constraints
- Không làm thay đổi cấu trúc các cột bảng `persons` để bảo tồn tính toàn vẹn khi import/export Excel và render cây gia phả.
- Tự động nhận diện tư cách `self` nếu tài khoản đã liên kết (`member_links`) với `person_id`.
- Mọi thành viên có quyền truy cập dòng họ đều có thể đọc tâm thư; Admin hoặc người tạo có thể sửa/xóa; con/cháu và thành viên dòng họ có thể viết giùm (lưu rõ họ tên & xưng hô người chấp bút).
- Đảm bảo toàn bộ test pass (`npm test`) và `npm run build` không có lỗi TypeScript.

---

### Task 1: Database Migration & TypeScript Interface

**Files:**
- Create: `supabase/migrations/20261029150000_person_memorial_letters.sql`
- Modify: `types/index.ts`
- Test: `tests/memorial-letter-db.test.mjs`

**Interfaces:**
- Produces: `PersonMemorialLetter` interface trong `types/index.ts`:
  ```typescript
  export type MemorialAuthorType = "self" | "descendant" | "admin";

  export interface PersonMemorialLetter {
    id: string;
    person_id: string;
    family_id: string;
    tree_id: string;
    title: string;
    content: string;
    author_type: MemorialAuthorType;
    author_name: string;
    author_relationship: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
  }
  ```

- [ ] **Step 1: Viết test kiểm tra migration SQL và types**

Tạo `tests/memorial-letter-db.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("memorial letter database migration contains required schema, constraints, and RLS", () => {
  const migrationPath = path.join(root, "supabase/migrations/20261029150000_person_memorial_letters.sql");
  assert.ok(fs.existsSync(migrationPath), "Migration file must exist");
  const sql = fs.readFileSync(migrationPath, "utf8");

  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.person_memorial_letters/);
  assert.match(sql, /person_id UUID NOT NULL REFERENCES public\.persons\(id\) ON DELETE CASCADE/);
  assert.match(sql, /family_id UUID NOT NULL REFERENCES public\.families\(id\) ON DELETE CASCADE/);
  assert.match(sql, /tree_id UUID NOT NULL REFERENCES public\.family_trees\(id\) ON DELETE CASCADE/);
  assert.match(sql, /title TEXT NOT NULL/);
  assert.match(sql, /content TEXT NOT NULL/);
  assert.match(sql, /author_type TEXT NOT NULL/);
  assert.match(sql, /author_name TEXT NOT NULL/);
  assert.match(sql, /author_relationship TEXT/);
  assert.match(sql, /CONSTRAINT uq_person_memorial_letter UNIQUE \(person_id\)/);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
});

test("types/index.ts exports PersonMemorialLetter interface", () => {
  const typesPath = path.join(root, "types/index.ts");
  const content = fs.readFileSync(typesPath, "utf8");

  assert.match(content, /export type MemorialAuthorType/);
  assert.match(content, /export interface PersonMemorialLetter/);
});
```

- [ ] **Step 2: Chạy test và xác nhận thất bại (đỏ)**

Run: `node --test tests/memorial-letter-db.test.mjs`
Expected: FAIL (file không tồn tại).

- [ ] **Step 3: Tạo migration SQL và cập nhật `types/index.ts`**

Tạo `supabase/migrations/20261029150000_person_memorial_letters.sql` với bảng `public.person_memorial_letters`, index và RLS.
Bổ sung `PersonMemorialLetter` và `MemorialAuthorType` vào `types/index.ts`.

- [ ] **Step 4: Chạy test và xác nhận vượt qua (xanh)**

Run: `node --test tests/memorial-letter-db.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20261029150000_person_memorial_letters.sql types/index.ts tests/memorial-letter-db.test.mjs
git commit -m "feat(db): add person_memorial_letters schema and types"
```

---

### Task 2: Server Actions (`app/actions/memorial-letter.ts`)

**Files:**
- Create: `app/actions/memorial-letter.ts`
- Test: `tests/memorial-letter-actions.test.mjs`

**Interfaces:**
- Consumes: `PersonMemorialLetter` từ `types/index.ts`, `getUser`, `getFamilyContextById`, `getAdminSupabase`, `getSupabase` từ `utils/supabase/queries.ts`.
- Produces:
  ```typescript
  export async function getMemorialLetterAction(
    personId: string,
    familyId: string
  ): Promise<{ success: boolean; data?: PersonMemorialLetter | null; error?: string }>;

  export async function saveMemorialLetterAction(input: {
    personId: string;
    familyId: string;
    treeId: string;
    title: string;
    content: string;
    authorType: "self" | "descendant" | "admin";
    authorName: string;
    authorRelationship?: string;
  }): Promise<{ success: boolean; data?: PersonMemorialLetter; error?: string }>;

  export async function deleteMemorialLetterAction(
    personId: string,
    familyId: string
  ): Promise<{ success: boolean; error?: string }>;
  ```

- [ ] **Step 1: Viết test kiểm tra Server Actions**

Tạo `tests/memorial-letter-actions.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("memorial-letter server action file exports required actions and security guards", () => {
  const actionsPath = path.join(root, "app/actions/memorial-letter.ts");
  assert.ok(fs.existsSync(actionsPath), "memorial-letter.ts must exist");
  const code = fs.readFileSync(actionsPath, "utf8");

  assert.match(code, /"use server"/);
  assert.match(code, /export async function getMemorialLetterAction/);
  assert.match(code, /export async function saveMemorialLetterAction/);
  assert.match(code, /export async function deleteMemorialLetterAction/);
  assert.match(code, /getUser\(\)/);
  assert.match(code, /revalidatePath/);
  assert.match(code, /person_memorial_letters/);
});
```

- [ ] **Step 2: Chạy test và xác nhận thất bại (đỏ)**

Run: `node --test tests/memorial-letter-actions.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Triển khai `app/actions/memorial-letter.ts`**

Viết các hàm `getMemorialLetterAction`, `saveMemorialLetterAction`, `deleteMemorialLetterAction` với kiểm tra phân quyền chặt chẽ, tự động fallback `authorType` thông minh, revalidate đường dẫn Next.js.

- [ ] **Step 4: Chạy test và xác nhận vượt qua (xanh)**

Run: `node --test tests/memorial-letter-actions.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/actions/memorial-letter.ts tests/memorial-letter-actions.test.mjs
git commit -m "feat(actions): implement memorial letter server actions"
```

---

### Task 3: Giao Diện Người Dùng Heritage UI (`MemorialLetterCard` & `MemorialLetterModal`)

**Files:**
- Create: `components/dashboard/MemorialLetterModal.tsx`
- Create: `components/dashboard/MemorialLetterCard.tsx`
- Test: `tests/memorial-letter-ui.test.mjs`

**Interfaces:**
- Consumes: `PersonMemorialLetter`, `saveMemorialLetterAction`, `deleteMemorialLetterAction`.
- Produces: `MemorialLetterCard` và `MemorialLetterModal` components.

- [ ] **Step 1: Viết test kiểm tra UI components**

Tạo `tests/memorial-letter-ui.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("MemorialLetterCard component contains heritage styling and state handling", () => {
  const cardPath = path.join(root, "components/dashboard/MemorialLetterCard.tsx");
  assert.ok(fs.existsSync(cardPath), "MemorialLetterCard.tsx must exist");
  const code = fs.readFileSync(cardPath, "utf8");

  assert.match(code, /"use client"/);
  assert.match(code, /MemorialLetterCard/);
  assert.match(code, /MemorialLetterModal/);
  assert.match(code, /Tâm thư|Lời dặn dò/);
  assert.match(code, /Người chấp bút|Tác giả/);
});

test("MemorialLetterModal component contains form inputs for title, author and content", () => {
  const modalPath = path.join(root, "components/dashboard/MemorialLetterModal.tsx");
  assert.ok(fs.existsSync(modalPath), "MemorialLetterModal.tsx must exist");
  const code = fs.readFileSync(modalPath, "utf8");

  assert.match(code, /"use client"/);
  assert.match(code, /MemorialLetterModal/);
  assert.match(code, /saveMemorialLetterAction/);
  assert.match(code, /author_type|authorType/);
  assert.match(code, /author_name|authorName/);
  assert.match(code, /author_relationship|authorRelationship/);
});
```

- [ ] **Step 2: Chạy test và xác nhận thất bại (đỏ)**

Run: `node --test tests/memorial-letter-ui.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Triển khai `MemorialLetterModal.tsx` và `MemorialLetterCard.tsx`**

- `MemorialLetterModal.tsx`: Modal popover phong cách Heritage với form nhập Tiêu đề, Loại tác giả (Chính chủ / Con cháu / Admin), Tên người viết, Xưng hô, và Nội dung textarea.
- `MemorialLetterCard.tsx`: Thẻ hiển thị trên nền giấy dó truyền thống, có nút "✍️ Viết tâm thư / Ghi chép di ngôn", hiển thị tiêu đề, nội dung, huy hiệu người chấp bút, ngày viết, cùng nút sửa/xóa.

- [ ] **Step 4: Chạy test và xác nhận vượt qua (xanh)**

Run: `node --test tests/memorial-letter-ui.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/MemorialLetterModal.tsx components/dashboard/MemorialLetterCard.tsx tests/memorial-letter-ui.test.mjs
git commit -m "feat(ui): add memorial letter card and modal components"
```

---

### Task 4: Tích hợp vào Hồ sơ Thành viên & Popup Cây Gia Phả

**Files:**
- Modify: `components/MemberDetailContent.tsx`
- Modify: `app/dashboard/[familySlug]/members/[id]/page.tsx`
- Modify: `package.json` (thêm test vào kịch bản kiểm thử tự động)
- Test: `tests/memorial-letter-integration.test.mjs`

- [ ] **Step 1: Viết test tích hợp trang chi tiết và modal cây**

Tạo `tests/memorial-letter-integration.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("MemberDetailContent and member detail page integrate MemorialLetterCard", () => {
  const contentCode = fs.readFileSync(path.join(root, "components/MemberDetailContent.tsx"), "utf8");
  assert.match(contentCode, /MemorialLetterCard/);

  const pageCode = fs.readFileSync(path.join(root, "app/dashboard/[familySlug]/members/[id]/page.tsx"), "utf8");
  assert.match(pageCode, /person_memorial_letters|memorialLetter|getMemorialLetter/);
});
```

- [ ] **Step 2: Chạy test và xác nhận thất bại (đỏ)**

Run: `node --test tests/memorial-letter-integration.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Tích hợp `MemorialLetterCard` vào `MemberDetailContent` và trang chi tiết**

Cung cấp dữ liệu `memorialLetter` vào `MemberDetailContent` để hiển thị trên cả màn hình chi tiết và popup trên cây gia phả.

- [ ] **Step 4: Chạy toàn bộ test suite và xác nhận vượt qua**

Run: `npm test`
Expected: PASS toàn bộ các test.

- [ ] **Step 5: Chạy build Next.js kiểm tra tương thích production**

Run: `npm run build`
Expected: Build thành công 100%, 0 lỗi.

- [ ] **Step 6: Commit**

```bash
git add components/MemberDetailContent.tsx app/dashboard/[familySlug]/members/[id]/page.tsx package.json tests/memorial-letter-integration.test.mjs
git commit -m "feat(member): integrate memorial letter into member profile and tree detail"
```
