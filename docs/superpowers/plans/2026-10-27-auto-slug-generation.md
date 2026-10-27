# Tự Động Sinh Slug Cho Các Biểu Mẫu Thêm Mới Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai cơ chế tự động sinh Slug theo thời gian thực (realtime) từ tiếng Việt có dấu cho các biểu mẫu thêm mới (Dòng họ, Cây gia phả, Bài viết), đồng thời tự động xử lý chống trùng lặp slug ở phía Server Actions.

**Architecture:** Tạo tiện ích dùng chung `utils/slug.ts` (`slugify` & `generateUniqueSlug`). Đồng bộ realtime giữa ô nhập Tên/Tiêu đề và ô Slug ở Client components với cờ `isCustomSlug`. Tại Server Actions, chuẩn hóa slug và tự động tăng hậu tố `-1`, `-2`,... nếu xảy ra xung đột slug trong database.

**Tech Stack:** Next.js 15 (App Router, Server Actions, Client Components), React 19, TypeScript, Supabase DB, Node.js Test Runner.

## Global Constraints

- Hỗ trợ đầy đủ tiếng Việt có dấu, chữ `đ/Đ`, các dấu thanh gộp trong NFD.
- Slug chỉ chứa `[a-z0-9-]`, không có 2 dấu `-` liền nhau, không bắt đầu hoặc kết thúc bằng `-`.
- Không làm gián đoạn các test hiện có (`npm test`).

---

### Task 1: Tiện ích dùng chung `utils/slug.ts` và Unit Test

**Files:**
- Create: `utils/slug.ts`
- Create: `tests/slug.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export function slugify(input: string): string;
  export async function generateUniqueSlug(
    baseSlug: string,
    isTaken: (slug: string) => Promise<boolean> | boolean
  ): Promise<string>;
  ```

- [ ] **Step 1: Write unit test for slugify and generateUniqueSlug**

Create `tests/slug.test.ts`:
```typescript
import test from "node:test";
import assert from "node:assert/strict";
import { slugify, generateUniqueSlug } from "../utils/slug";

test("slugify converts Vietnamese diacritics and special characters correctly", () => {
  assert.equal(slugify("Dòng Họ Nguyễn Văn"), "dong-ho-nguyen-van");
  assert.equal(slugify("  Lê Quý Đôn - Chi 1  "), "le-quy-don-chi-1");
  assert.equal(slugify("Phả ký & Lịch sử (2026)"), "pha-ky-lich-su-2026");
  assert.equal(slugify("---Đồng Khởi---"), "dong-khoi");
  assert.equal(slugify(""), "");
});

test("generateUniqueSlug handles collision and increments suffix", async () => {
  const existingSlugs = new Set(["dong-ho-le", "dong-ho-le-1", "dong-ho-le-2"]);
  const isTaken = async (slug: string) => existingSlugs.has(slug);

  const unique = await generateUniqueSlug("dong-ho-le", isTaken);
  assert.equal(unique, "dong-ho-le-3");

  const available = await generateUniqueSlug("dong-ho-nguyen", isTaken);
  assert.equal(available, "dong-ho-nguyen");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import tsx --test tests/slug.test.ts`
Expected: FAIL with module `../utils/slug` not found.

- [ ] **Step 3: Implement `utils/slug.ts`**

Create `utils/slug.ts`:
```typescript
export function slugify(input: string): string {
  if (!input) return "";
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function generateUniqueSlug(
  baseSlug: string,
  isTaken: (slug: string) => Promise<boolean> | boolean
): Promise<string> {
  const cleanBase = slugify(baseSlug) || "item";
  const taken = await isTaken(cleanBase);
  if (!taken) return cleanBase;

  let counter = 1;
  while (true) {
    const candidate = `${cleanBase}-${counter}`;
    const candidateTaken = await isTaken(candidate);
    if (!candidateTaken) {
      return candidate;
    }
    counter += 1;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --import tsx --test tests/slug.test.ts`
Expected: PASS with 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add utils/slug.ts tests/slug.test.ts
git commit -m "feat: add shared slugify and generateUniqueSlug utility with tests"
```

---

### Task 2: Realtime Slug Auto-Generation in `AdminFamilyCreateForm.tsx`

**Files:**
- Modify: `components/AdminFamilyCreateForm.tsx`

**Interfaces:**
- Consumes: `slugify` from `utils/slug`

- [ ] **Step 1: Update `AdminFamilyCreateForm.tsx`**

1. Import `slugify` from `@/utils/slug`.
2. Add state for `nameValue`, `slugValue`, and `isCustomSlug`:
   ```typescript
   const [nameValue, setNameValue] = useState("");
   const [slugValue, setSlugValue] = useState("");
   const [isCustomSlug, setIsCustomSlug] = useState(false);
   ```
3. Update `useEffect` when `state.success` triggers to also reset:
   ```typescript
   setNameValue("");
   setSlugValue("");
   setIsCustomSlug(false);
   ```
4. Handle name input change:
   ```typescript
   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const nextName = e.target.value;
     setNameValue(nextName);
     if (!isCustomSlug) {
       setSlugValue(slugify(nextName));
     }
   };
   ```
5. Handle slug input change:
   ```typescript
   const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const nextSlug = e.target.value;
     setSlugValue(nextSlug);
     if (!nextSlug.trim()) {
       setIsCustomSlug(false);
       setSlugValue(slugify(nameValue));
     } else {
       setIsCustomSlug(true);
     }
   };
   ```
6. Bind `value={nameValue}` and `onChange={handleNameChange}` to `name` input.
7. Bind `value={slugValue}` and `onChange={handleSlugChange}` to `slug` input.

- [ ] **Step 2: Run test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/AdminFamilyCreateForm.tsx
git commit -m "feat: enable realtime slug auto-generation in AdminFamilyCreateForm"
```

---

### Task 3: Extract `CreateFamilyTreeForm.tsx` with Realtime Slug Generation

**Files:**
- Create: `components/CreateFamilyTreeForm.tsx`
- Modify: `app/dashboard/[familySlug]/trees/page.tsx`

**Interfaces:**
- Consumes: `slugify` from `utils/slug`, `createFamilyTreeAction` from `app/actions/family`

- [ ] **Step 1: Create `components/CreateFamilyTreeForm.tsx`**

Create `components/CreateFamilyTreeForm.tsx`:
```tsx
"use client";

import { createFamilyTreeAction } from "@/app/actions/family";
import { slugify } from "@/utils/slug";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateFamilyTreeFormProps {
  familyId: string;
}

export default function CreateFamilyTreeForm({
  familyId,
}: CreateFamilyTreeFormProps) {
  const [nameValue, setNameValue] = useState("");
  const [slugValue, setSlugValue] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = e.target.value;
    setNameValue(nextName);
    if (!isCustomSlug) {
      setSlugValue(slugify(nextName));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextSlug = e.target.value;
    setSlugValue(nextSlug);
    if (!nextSlug.trim()) {
      setIsCustomSlug(false);
      setSlugValue(slugify(nameValue));
    } else {
      setIsCustomSlug(true);
    }
  };

  return (
    <form
      action={createFamilyTreeAction}
      className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <input type="hidden" name="family_id" value={familyId} />
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <Plus className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-900">
            Tạo cây gia phả mới
          </h2>
          <p className="text-sm text-stone-500">
            Dành cho chi phái hoặc nhánh dữ liệu riêng.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-stone-700">
            Tên cây
          </span>
          <input
            name="name"
            required
            value={nameValue}
            onChange={handleNameChange}
            placeholder="Ví dụ: Cây gia phả chính"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-stone-700">
            Slug
          </span>
          <input
            name="slug"
            value={slugValue}
            onChange={handleSlugChange}
            placeholder="cay-gia-pha-chinh"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-stone-700">
            Mô tả
          </span>
          <textarea
            name="description"
            rows={4}
            placeholder="Ghi chú về phạm vi cây, chi phái hoặc dữ liệu đang nhập."
            className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-stone-700">
            Chế độ hiển thị
          </span>
          <select
            name="visibility"
            defaultValue="private"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
          >
            <option value="private">Riêng tư</option>
            <option value="family_only">Chỉ trong dòng họ</option>
          </select>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
          <input
            type="checkbox"
            name="is_primary"
            className="size-4 rounded border-amber-300"
          />
          Đặt làm cây chính sau khi tạo
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
        >
          Tạo cây gia phả
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Update `app/dashboard/[familySlug]/trees/page.tsx`**

Replace inline `<form action={createFamilyTreeAction}>` with:
```tsx
import CreateFamilyTreeForm from "@/components/CreateFamilyTreeForm";
...
{context.canManage ? (
  <CreateFamilyTreeForm familyId={context.family.id} />
) : null}
```

- [ ] **Step 3: Run test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/CreateFamilyTreeForm.tsx app/dashboard/[familySlug]/trees/page.tsx
git commit -m "feat: extract CreateFamilyTreeForm with realtime slug auto-generation"
```

---

### Task 4: Realtime Slug Auto-Generation in `BlogAdminPanel.tsx`

**Files:**
- Modify: `components/BlogAdminPanel.tsx`

**Interfaces:**
- Consumes: `slugify` from `utils/slug`

- [ ] **Step 1: Update `BlogAdminPanel.tsx`**

1. Replace internal `slugify` function with import from `@/utils/slug`.
2. Add state for `slugValue` and `isCustomSlug`:
   ```typescript
   const [slugValue, setSlugValue] = useState("");
   const [isCustomSlug, setIsCustomSlug] = useState(false);
   ```
3. When `startEditing(post)` is called:
   - `setSlugValue(post.slug);`
   - `setIsCustomSlug(true);`
4. When `resetForm()` is called:
   - `setSlugValue("");`
   - `setIsCustomSlug(false);`
5. In Title `<input>`:
   - Add `onChange`:
     ```typescript
     onChange={(e) => {
       if (!editingPost && !isCustomSlug) {
         setSlugValue(slugify(e.target.value));
       }
     }}
     ```
6. In Slug `<input>`:
   - Replace `defaultValue` with `value={slugValue}`
   - Add `onChange`:
     ```typescript
     onChange={(e) => {
       const val = e.target.value;
       setSlugValue(val);
       if (!val.trim()) {
         setIsCustomSlug(false);
         const titleInput = e.currentTarget.form?.elements.namedItem("title") as HTMLInputElement | null;
         if (titleInput) {
           setSlugValue(slugify(titleInput.value));
         }
       } else {
         setIsCustomSlug(true);
       }
     }}
     ```

- [ ] **Step 2: Run test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/BlogAdminPanel.tsx
git commit -m "feat: enable realtime slug auto-generation in BlogAdminPanel"
```

---

### Task 5: Backend Collision Handling in Server Actions (`family.ts` & `blog.ts`)

**Files:**
- Modify: `app/actions/family.ts`
- Modify: `app/actions/blog.ts`

**Interfaces:**
- Consumes: `slugify`, `generateUniqueSlug` from `utils/slug`

- [ ] **Step 1: Update `createFamilyAction` in `app/actions/family.ts`**

1. Import `slugify` and `generateUniqueSlug` from `@/utils/slug`.
2. Replace local `slugify` function.
3. In `createFamilyAction`:
   ```typescript
   const baseSlug = slugify(requestedSlug || name);
   if (!baseSlug) return { error: "Slug không hợp lệ." };

   const supabase = await getSupabase();
   const slug = await generateUniqueSlug(baseSlug, async (candidate) => {
     const { data } = await supabase
       .from("families")
       .select("id")
       .eq("slug", candidate)
       .maybeSingle();
     return Boolean(data);
   });
   ```
4. Pass `slug` to `create_family_with_admin`.

- [ ] **Step 2: Update `createFamilyTreeAction` in `app/actions/family.ts`**

In `createFamilyTreeAction`:
```typescript
const baseSlug = slugify(requestedSlug || name);
if (!baseSlug) throw new Error("Slug cây gia phả không hợp lệ.");

const supabase = await getSupabase();
const slug = await generateUniqueSlug(baseSlug, async (candidate) => {
  const { data } = await supabase
    .from("family_trees")
    .select("id")
    .eq("family_id", familyId)
    .eq("slug", candidate)
    .maybeSingle();
  return Boolean(data);
});
```
Use `slug` in `.insert({ family_id: familyId, name, slug, ... })`.

- [ ] **Step 3: Update `createOrUpdatePostAction` in `app/actions/blog.ts`**

1. Import `slugify` and `generateUniqueSlug` from `@/utils/slug`.
2. In `createOrUpdatePostAction`:
   ```typescript
   const baseSlug = slugify(requestedSlug || title);
   if (!baseSlug) return { error: "Slug không hợp lệ." };

   const slug = await generateUniqueSlug(baseSlug, async (candidate) => {
     let query = supabase
       .from("blog_posts")
       .select("id")
       .eq("scope", scope)
       .eq("slug", candidate);

     if (familyId) {
       query = query.eq("family_id", familyId);
     } else {
       query = query.is("family_id", null);
     }

     if (id) {
       query = query.neq("id", id);
     }

     const { data } = await query.maybeSingle();
     return Boolean(data);
   });
   ```
3. Use `slug` for saving and revalidating paths.

- [ ] **Step 4: Run test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/actions/family.ts app/actions/blog.ts
git commit -m "feat: handle slug collision resolution in family and blog server actions"
```

---

### Task 6: Toàn Bộ Verification & Integration Testing

**Files:**
- Create: `tests/slug-integration.test.ts`

- [ ] **Step 1: Write integration tests verifying actions and utilities**

Create `tests/slug-integration.test.ts`:
```typescript
import test from "node:test";
import assert from "node:assert/strict";
import { slugify, generateUniqueSlug } from "../utils/slug";

test("slugify handles edge cases and Vietnamese accents cleanly", () => {
  assert.equal(slugify("Họ Đỗ (Chi Phía Bắc)"), "ho-do-chi-phia-bac");
  assert.equal(slugify("Nguyễn Đình Chiểu @ 2026!"), "nguyen-dinh-chieu-2026");
  assert.equal(slugify("---   ---"), "");
});

test("generateUniqueSlug correctly avoids conflicts across multiple collisions", async () => {
  const existing = new Set(["tin-tuc-dong-ho", "tin-tuc-dong-ho-1", "tin-tuc-dong-ho-2"]);
  const isTaken = (candidate: string) => existing.has(candidate);

  const res = await generateUniqueSlug("tin-tuc-dong-ho", isTaken);
  assert.equal(res, "tin-tuc-dong-ho-3");
});
```

- [ ] **Step 2: Run all test suites**

Run: `npm test && node --import tsx --test tests/slug-integration.test.ts`
Expected: All suites pass without errors.

- [ ] **Step 3: Commit**

```bash
git add tests/slug-integration.test.ts
git commit -m "test: add slug integration tests and verify full suite"
```
