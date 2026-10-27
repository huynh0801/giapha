# Tự Động Sinh Slug Cho Các Biểu Mẫu Thêm Mới Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai cơ chế tự động sinh Slug theo thời gian thực (realtime) từ tiếng Việt có dấu cho các biểu mẫu thêm mới (Dòng họ, Cây gia phả, Bài viết), đồng thời tự động xử lý chống trùng lặp slug ở phía Server Actions.

**Architecture:** Tạo tiện ích dùng chung `utils/slug.ts` (`slugify` & `generateUniqueSlug`). Đồng bộ realtime giữa ô nhập Tên/Tiêu đề và ô Slug ở Client components với cờ `isCustomSlug`. Tại Server Actions, chuẩn hóa slug và tự động tăng hậu tố `-1`, `-2`,... nếu xảy ra xung đột slug.

**Tech Stack:** Next.js 15 (App Router, Server Actions, Client Components), React 19, TypeScript, Supabase DB.

## Global Constraints

- Hỗ trợ đầy đủ tiếng Việt có dấu, chữ `đ/Đ`, các dấu thanh gộp trong NFD.
- Slug chỉ chứa `[a-z0-9-]`, không có 2 dấu `-` liền nhau, không bắt đầu hoặc kết thúc bằng `-`.
- Không làm gián đoạn các test hiện có (`npm test`).

---

### Task 1: Tiện ích dùng chung `utils/slug.ts` và Unit Test

**Files:**
- Create: `utils/slug.ts`
- Test: `tests/slug.test.ts`

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

- [ ] **Step 1: Update `AdminFamilyCreateForm.tsx` with name and slug state**

In `components/AdminFamilyCreateForm.tsx`:
1. Import `slugify` from `@/utils/slug`.
2. Add states:
   ```typescript
   const [name, setName] = useState("");
   const [slug, setSlug] = useState("");
   const [isCustomSlug, setIsCustomSlug] = useState(false);
   ```
3. When form resets on success, reset `name`, `slug`, and `isCustomSlug`.
4. On `name` input change:
   ```typescript
   const newName = event.target.value;
   setName(newName);
   if (!isCustomSlug) {
     setSlug(slugify(newName));
   }
   ```
5. On `slug` input change:
   ```typescript
   const newSlug = event.target.value;
   setSlug(newSlug);
   if (!newSlug.trim()) {
     setIsCustomSlug(false);
     setSlug(slugify(name));
   } else {
     setIsCustomSlug(true);
   }
   ```
6. Bind `value={name}` and `value={slug}` to respective inputs.

- [ ] **Step 2: Verify `AdminFamilyCreateForm.tsx` compiles and test suite passes**

Run: `npm test`
Expected: All existing tests PASS.

- [ ] **Step 3: Commit**

```bash
git add components/AdminFamilyCreateForm.tsx
git commit -m "feat: add realtime slug auto-generation to AdminFamilyCreateForm"
```

---

### Task 3: Realtime Slug Auto-Generation in Tree Creation (`CreateFamilyTreeForm.tsx`)

**Files:**
- Create: `components/CreateFamilyTreeForm.tsx`
- Modify: `app/dashboard/[familySlug]/trees/page.tsx`

**Interfaces:**
- Consumes: `slugify` from `utils/slug`, `createFamilyTreeAction` from `app/actions/family`
- Produces: `CreateFamilyTreeForm` component accepting `{ familyId: string; currentSlug: string; hasTrees: boolean }`

- [ ] **Step 1: Create `components/CreateFamilyTreeForm.tsx`**

Create client component `components/CreateFamilyTreeForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import { GitBranch, ShieldCheck } from "lucide-react";
import { createFamilyTreeAction } from "@/app/actions/family";
import { slugify } from "@/utils/slug";

interface CreateFamilyTreeFormProps {
  familyId: string;
  hasTrees: boolean;
}

export function CreateFamilyTreeForm({
  familyId,
  hasTrees,
}: CreateFamilyTreeFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isCustomSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSlug(val);
    if (!val.trim()) {
      setIsCustomSlug(false);
      setSlug(slugify(name));
    } else {
      setIsCustomSlug(true);
    }
  };

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-[#800000]/10 p-2.5 text-[#800000]">
          <GitBranch className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-stone-900">
            Tạo cây gia phả mới
          </h2>
          <p className="text-xs text-stone-500">
            Tạo thêm nhánh hoặc cây bổ trợ cho dòng họ này.
          </p>
        </div>
      </div>

      <form action={createFamilyTreeAction} className="space-y-4">
        <input type="hidden" name="family_id" value={familyId} />

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-stone-700">
              Tên cây
            </span>
            <input
              name="name"
              required
              value={name}
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
              value={slug}
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
              Quyền xem cây
            </span>
            <select
              name="visibility"
              defaultValue="family_only"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
            >
              <option value="private">Chỉ quản trị viên</option>
              <option value="family_only">Thành viên dòng họ</option>
              <option value="public">Công khai</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              name="is_primary"
              defaultChecked={!hasTrees}
              className="rounded border-stone-300 text-[#800000] focus:ring-[#800000]"
            />
            <span className="font-semibold">
              Đặt làm cây mặc định của dòng họ
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#800000] px-4 py-3 text-sm font-black text-amber-100 transition hover:bg-[#600000]"
        >
          <ShieldCheck className="size-4" />
          Tạo cây gia phả
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Use `CreateFamilyTreeForm` in `app/dashboard/[familySlug]/trees/page.tsx`**

Replace the static tree creation form in `app/dashboard/[familySlug]/trees/page.tsx` with:
```tsx
<CreateFamilyTreeForm
  familyId={family.id}
  hasTrees={trees.length > 0}
/>
```

- [ ] **Step 3: Run tests to verify compatibility**

Run: `npm test`
Expected: PASS. Note: Ensure `tests/multitenant-private.test.mjs` matches `createFamilyTreeAction` which will still be referenced in `CreateFamilyTreeForm`.

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
2. Add state for `slug` and `isCustomSlug`:
   ```typescript
   const [slugValue, setSlugValue] = useState("");
   const [isCustomSlug, setIsCustomSlug] = useState(false);
   ```
3. When `handleSelectPost` is called:
   - If `post`: `setSlugValue(post.slug)`, `setIsCustomSlug(true)`.
   - If `!post` (new post): `setSlugValue("")`, `setIsCustomSlug(false)`.
4. In `handleTitleChange` (or when typing in Title):
   ```typescript
   if (!editingPost && !isCustomSlug) {
     setSlugValue(slugify(event.currentTarget.value));
   }
   ```
5. In `slug` input `onChange`:
   ```typescript
   const val = event.currentTarget.value;
   setSlugValue(val);
   if (!val.trim()) {
     setIsCustomSlug(false);
     if (titleInputRef.current) {
       setSlugValue(slugify(titleInputRef.current.value));
     }
   } else {
     setIsCustomSlug(true);
   }
   ```
6. Bind `value={slugValue}` to the slug `<input>`.

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
2. Use `generateUniqueSlug` to verify and resolve slug collisions:
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
3. Call `create_family_with_admin` with `family_slug: slug`.

- [ ] **Step 2: Update `createFamilyTreeAction` in `app/actions/family.ts`**

1. In `createFamilyTreeAction`:
   ```typescript
   const baseSlug = slugify(requestedSlug || name);
   if (!baseSlug) throw new Error("Slug cây gia phả không hợp lệ.");

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
2. Insert into `family_trees` with `slug`.

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

- [ ] **Step 4: Run all test suites**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/actions/family.ts app/actions/blog.ts
git commit -m "feat: handle slug collision resolution in family and blog server actions"
```

---

### Task 6: Toàn Bộ Verification & E2E Testing

**Files:**
- Test: `tests/slug-integration.test.ts`

- [ ] **Step 1: Write integration tests verifying actions and utilities**

Create `tests/slug-integration.test.ts`:
Verify that `generateUniqueSlug` works with mock db checks and edge cases (empty strings, special unicode characters, multiple collisions).

- [ ] **Step 2: Run all test suites**

Run: `npm test`
Expected: All suites pass without errors.

- [ ] **Step 3: Commit**

```bash
git add tests/slug-integration.test.ts
git commit -m "test: add slug integration tests and verify test suite"
```
