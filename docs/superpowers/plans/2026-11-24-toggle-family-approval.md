# Bật/Tắt Duyệt Dòng Họ Khi Tạo Mới - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cho phép Super Admin bật/tắt chức năng kiểm duyệt khi thành viên tạo dòng họ mới: khi tắt thì người dùng tạo xong là có dòng họ ngay và chuyển hướng trực tiếp vào không gian gia tộc; khi bật thì phải chờ Super Admin duyệt như hiện tại.

**Architecture:** Bảng `public.system_settings` lưu cờ cấu hình `family_approval_required` với phân quyền RLS an toàn; Stored Procedure nguyên tử `create_family_direct` đảm bảo khởi tạo dòng họ, cây gia phả chính, gán admin dòng họ và lưu vết lịch sử trong 1 transaction khi tắt duyệt; Server Actions đọc/ghi cấu hình và tự động rẽ nhánh xử lý; UI Super Admin với công tắc Toggle Switch trực quan tại `/admin/families`; UI Người dùng tại `/dashboard` tự động đồng bộ nhãn nút và luồng redirect tức thì.

**Tech Stack:** Next.js 16 (App Router, Server Actions), Supabase (PostgreSQL, RLS, RPCs), TypeScript, Tailwind CSS, Lucide React, Node.js Test Runner.

## Global Constraints

- Tuân thủ kiến trúc Server Actions và Supabase client qua `@/utils/supabase/queries` (không import trực tiếp `@supabase/supabase-js` trong Server Actions).
- Đảm bảo tính nguyên tử: thao tác tạo dòng họ trực tiếp phải diễn ra trong PostgreSQL Transaction an toàn.
- Chỉ tài khoản `role = 'system_admin'` và `is_active = true` mới có quyền bật/tắt cờ duyệt dòng họ.
- Bắt buộc kiểm thử tự động (TDD) cho Schema Migration, Server Actions, Admin UI và Dashboard UI.

---

### Task 1: Database Migration for `system_settings` & `create_family_direct` RPC

**Files:**
- Create: `supabase/migrations/20261124120000_system_settings_and_direct_family_creation.sql`
- Test: `tests/system-settings-db-schema.test.mjs`

**Interfaces:**
- Produces: 
  - Table `public.system_settings (key TEXT PRIMARY KEY, value JSONB, description TEXT, updated_at TIMESTAMPTZ, updated_by UUID)`
  - Function `public.create_family_direct(p_family_name TEXT, p_family_slug TEXT, p_description TEXT, p_origin_location TEXT, p_phone_contact TEXT, p_logo_url TEXT) RETURNS JSONB`
  - Seed row `family_approval_required` with `{"enabled": true}`

- [ ] **Step 1: Write the failing schema test**

Create `tests/system-settings-db-schema.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("migration creates system_settings table with RLS and create_family_direct RPC", () => {
  const migration = read("supabase/migrations/20261124120000_system_settings_and_direct_family_creation.sql");

  // Table system_settings
  assert.match(migration, /CREATE TABLE IF NOT EXISTS public\.system_settings/);
  assert.match(migration, /key TEXT PRIMARY KEY/);
  assert.match(migration, /value JSONB NOT NULL DEFAULT/);
  assert.match(migration, /family_approval_required/);

  // RLS
  assert.match(migration, /ALTER TABLE public\.system_settings ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /CREATE POLICY "Allow authenticated read system_settings"/);
  assert.match(migration, /CREATE POLICY "Only system admin can update system_settings"/);

  // Atomic direct creation RPC
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.create_family_direct/);
  assert.match(migration, /SECURITY DEFINER/);
  assert.match(migration, /INSERT INTO public\.families/);
  assert.match(migration, /INSERT INTO public\.family_trees/);
  assert.match(migration, /INSERT INTO public\.family_memberships/);
  assert.match(migration, /INSERT INTO public\.family_creation_requests/);
  assert.match(migration, /is_primary_admin/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/system-settings-db-schema.test.mjs`
Expected: FAIL with file not found.

- [ ] **Step 3: Create SQL migration**

Create `supabase/migrations/20261124120000_system_settings_and_direct_family_creation.sql`:
```sql
-- Migration: Bảng cấu hình hệ thống & Stored Procedure tạo dòng họ trực tiếp khi tắt duyệt
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 1. Cho phép người dùng đã xác thực đọc cấu hình
DROP POLICY IF EXISTS "Allow authenticated read system_settings" ON public.system_settings;
CREATE POLICY "Allow authenticated read system_settings"
ON public.system_settings
FOR SELECT
USING (auth.role() = 'authenticated');

-- 2. Chỉ Super Admin có quyền cập nhật cấu hình
DROP POLICY IF EXISTS "Only system admin can update system_settings" ON public.system_settings;
CREATE POLICY "Only system admin can update system_settings"
ON public.system_settings
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
);

DROP POLICY IF EXISTS "Only system admin can insert system_settings" ON public.system_settings;
CREATE POLICY "Only system admin can insert system_settings"
ON public.system_settings
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
);

-- Khởi tạo giá trị mặc định cho cờ bắt buộc duyệt dòng họ
INSERT INTO public.system_settings (key, value, description)
VALUES ('family_approval_required', '{"enabled": true}'::jsonb, 'Bắt buộc phê duyệt khi người dùng tạo dòng họ mới')
ON CONFLICT (key) DO NOTHING;

-- 3. Stored Procedure: Tạo dòng họ trực tiếp không cần duyệt
CREATE OR REPLACE FUNCTION public.create_family_direct(
    p_family_name TEXT,
    p_family_slug TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_origin_location TEXT DEFAULT NULL,
    p_phone_contact TEXT DEFAULT '',
    p_logo_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_family_id UUID;
    v_slug TEXT;
    v_approval_setting JSONB;
    v_is_approval_enabled BOOLEAN := true;
BEGIN
    -- 1. Kiểm tra xác thực người dùng
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Vui lòng đăng nhập để tạo dòng họ.');
    END IF;

    -- Kiểm tra tài khoản có active không
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id AND is_active = true) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Tài khoản của bạn đã bị khóa hoặc không hợp lệ.');
    END IF;

    -- 2. Kiểm tra cờ cấu hình duyệt dòng họ
    SELECT value INTO v_approval_setting FROM public.system_settings WHERE key = 'family_approval_required';
    IF v_approval_setting IS NOT NULL AND (v_approval_setting->>'enabled')::boolean = true THEN
        RETURN jsonb_build_object('success', false, 'error', 'Chế độ duyệt dòng họ đang bật, vui lòng gửi đơn xin duyệt.');
    END IF;

    -- 3. Chuẩn hóa tên và slug
    IF p_family_name IS NULL OR length(trim(p_family_name)) < 3 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Tên dòng họ phải có ít nhất 3 ký tự.');
    END IF;

    v_slug := COALESCE(NULLIF(trim(p_family_slug), ''), slugify(p_family_name));
    IF v_slug IS NULL OR length(v_slug) = 0 THEN
        v_slug := 'dong-ho-' || substr(gen_random_uuid()::text, 1, 8);
    END IF;

    WHILE EXISTS (SELECT 1 FROM public.families WHERE slug = v_slug) LOOP
        v_slug := v_slug || '-' || floor(random() * 900 + 100)::int::text;
    END LOOP;

    -- 4. Tạo dòng họ mới
    INSERT INTO public.families (
        name,
        slug,
        description,
        origin_location,
        logo_url,
        visibility,
        status,
        created_at,
        updated_at
    ) VALUES (
        trim(p_family_name),
        v_slug,
        p_description,
        p_origin_location,
        p_logo_url,
        'private',
        'active',
        now(),
        now()
    ) RETURNING id INTO v_family_id;

    -- 5. Khởi tạo cây gia phả chính mặc định
    INSERT INTO public.family_trees (
        family_id,
        name,
        slug,
        description,
        is_primary,
        created_by
    ) VALUES (
        v_family_id,
        'Cây gia phả chính',
        'cay-chinh',
        'Cây gia phả mặc định',
        true,
        v_user_id
    );

    -- 6. Gán người tạo làm Quản trị viên chính (family_admin)
    INSERT INTO public.family_memberships (
        family_id,
        profile_id,
        role,
        is_primary_admin,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_family_id,
        v_user_id,
        'family_admin',
        true,
        'active',
        now(),
        now()
    );

    -- 7. Lưu vết lịch sử yêu cầu tạo dòng họ đã được phê duyệt tự động
    INSERT INTO public.family_creation_requests (
        user_id,
        family_name,
        origin_location,
        phone_contact,
        description,
        logo_url,
        status,
        approved_family_id,
        reviewed_by,
        reviewed_at,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        trim(p_family_name),
        p_origin_location,
        COALESCE(p_phone_contact, ''),
        p_description,
        p_logo_url,
        'approved',
        v_family_id,
        v_user_id,
        now(),
        now(),
        now()
    );

    RETURN jsonb_build_object(
        'success', true,
        'family_id', v_family_id,
        'slug', v_slug
    );
END;
$$;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/system-settings-db-schema.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit Task 1**

```bash
git add supabase/migrations/20261124120000_system_settings_and_direct_family_creation.sql tests/system-settings-db-schema.test.mjs
git commit -m "feat(db): add system_settings table and create_family_direct procedure"
```

---

### Task 2: Server Actions for System Settings & Updated Family Creation Flow

**Files:**
- Create: `app/actions/system-settings.ts`
- Modify: `app/actions/family-request.ts`
- Test: `tests/system-settings-actions.test.ts`

**Interfaces:**
- Consumes: Database `public.system_settings`, RPC `create_family_direct`
- Produces:
  - `isFamilyApprovalRequired(): Promise<boolean>`
  - `toggleFamilyApprovalAction(enabled: boolean): Promise<{ success: boolean; error?: string; enabled?: boolean }>`
  - Updated `requestFamilyCreationAction(prevState, formData): Promise<{ success: boolean; error?: string; message?: string; redirectUrl?: string; slug?: string }>`

- [ ] **Step 1: Write the failing Server Actions test**

Create `tests/system-settings-actions.test.ts`:
```typescript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("system-settings server actions exist and follow security rules", () => {
  const actions = read("app/actions/system-settings.ts");

  assert.match(actions, /export\s+async\s+function\s+isFamilyApprovalRequired/);
  assert.match(actions, /export\s+async\s+function\s+toggleFamilyApprovalAction/);
  assert.match(actions, /system_admin/);
  assert.match(actions, /revalidatePath\("\/admin\/families"\)/);
  assert.match(actions, /revalidatePath\("\/dashboard"\)/);
});

test("family-request action handles both approval-required and direct-creation flows", () => {
  const actions = read("app/actions/family-request.ts");

  assert.match(actions, /isFamilyApprovalRequired/);
  assert.match(actions, /create_family_direct/);
  assert.match(actions, /redirectUrl/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import tsx --test tests/system-settings-actions.test.ts`
Expected: FAIL with file not found.

- [ ] **Step 3: Create `app/actions/system-settings.ts`**

```typescript
"use server";

import { getProfile, getSupabase } from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";

export async function isFamilyApprovalRequired(): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "family_approval_required")
      .maybeSingle();

    if (error || !data || !data.value) {
      return true; // Mặc định là cần duyệt nếu chưa có setting
    }

    const value = data.value as { enabled?: boolean };
    return typeof value.enabled === "boolean" ? value.enabled : true;
  } catch {
    return true;
  }
}

export async function toggleFamilyApprovalAction(
  enabled: boolean,
): Promise<{ success: boolean; error?: string; enabled?: boolean }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active || profile.role !== "system_admin") {
    return { success: false, error: "Chỉ Quản trị viên hệ thống mới có quyền đổi thiết lập." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("system_settings")
    .upsert({
      key: "family_approval_required",
      value: { enabled },
      description: "Bắt buộc phê duyệt khi người dùng tạo dòng họ mới",
      updated_at: new Date().toISOString(),
      updated_by: profile.id,
    }, { onConflict: "key" });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/families");
  revalidatePath("/dashboard");

  return { success: true, enabled };
}
```

- [ ] **Step 4: Update `app/actions/family-request.ts` to branch based on `isFamilyApprovalRequired`**

Modify `app/actions/family-request.ts`:
1. Import `isFamilyApprovalRequired` from `@/app/actions/system-settings`.
2. In `requestFamilyCreationAction`, before inserting into `family_creation_requests`:
```typescript
  const approvalRequired = await isFamilyApprovalRequired();

  // NẾU TẮT DUYỆT: Gọi RPC tạo dòng họ trực tiếp
  if (!approvalRequired) {
    const { data: directData, error: directError } = await supabase.rpc("create_family_direct", {
      p_family_name: familyName,
      p_family_slug: null,
      p_description: description || null,
      p_origin_location: originLocation || null,
      p_phone_contact: phoneContact,
      p_logo_url: logoUrl,
    });

    if (directError) {
      return { success: false, error: directError.message };
    }

    if (directData && typeof directData === "object" && "success" in directData && !directData.success) {
      return { success: false, error: String(directData.error || "Không thể tạo dòng họ.") };
    }

    const slug = directData && typeof directData === "object" && "slug" in directData ? String(directData.slug) : "";

    revalidatePath("/dashboard");
    revalidatePath("/admin/families");
    if (slug) {
      revalidatePath(`/dashboard/${slug}`);
    }

    return {
      success: true,
      message: `Tạo dòng họ "${familyName}" thành công!`,
      redirectUrl: slug ? `/dashboard/${slug}` : "/dashboard",
      slug,
    };
  }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --import tsx --test tests/system-settings-actions.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit Task 2**

```bash
git add app/actions/system-settings.ts app/actions/family-request.ts tests/system-settings-actions.test.ts
git commit -m "feat(actions): add system-settings action and integrate direct creation flow"
```

---

### Task 3: Super Admin Toggle UI at `/admin/families`

**Files:**
- Create: `components/admin/FamilyApprovalToggle.tsx`
- Modify: `app/admin/families/page.tsx`
- Test: `tests/family-approval-admin-ui.test.mjs`

**Interfaces:**
- Consumes: `isFamilyApprovalRequired()` from `@/app/actions/system-settings`, `toggleFamilyApprovalAction(enabled)`
- Produces: `FamilyApprovalToggle` client component rendering switch with active status, description, and smooth transition.

- [ ] **Step 1: Write the failing Admin UI test**

Create `tests/family-approval-admin-ui.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("FamilyApprovalToggle component exists and connects to server action", () => {
  const comp = read("components/admin/FamilyApprovalToggle.tsx");

  assert.match(comp, /toggleFamilyApprovalAction/);
  assert.match(comp, /isFamilyApprovalRequired|initialEnabled/);
  assert.match(comp, /Bắt buộc duyệt|Tự do|Phê duyệt/);
});

test("AdminFamiliesPage loads approval setting and renders FamilyApprovalToggle", () => {
  const page = read("app/admin/families/page.tsx");

  assert.match(page, /isFamilyApprovalRequired/);
  assert.match(page, /FamilyApprovalToggle/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/family-approval-admin-ui.test.mjs`
Expected: FAIL with file not found.

- [ ] **Step 3: Create `components/admin/FamilyApprovalToggle.tsx`**

```tsx
"use client";

import { useState, useTransition } from "react";
import { toggleFamilyApprovalAction } from "@/app/actions/system-settings";
import { CheckCircle2, AlertCircle, Loader2, ShieldCheck, Zap } from "lucide-react";

interface Props {
  initialEnabled: boolean;
}

export default function FamilyApprovalToggle({ initialEnabled }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleToggle = () => {
    const nextState = !enabled;
    setMessage(null);
    startTransition(async () => {
      const res = await toggleFamilyApprovalAction(nextState);
      if (res.success) {
        setEnabled(nextState);
        setMessage({
          type: "success",
          text: nextState
            ? "Đã BẬT chế độ kiểm duyệt. Thành viên tạo dòng họ phải được Super Admin phê duyệt."
            : "Đã TẮT chế độ kiểm duyệt. Thành viên tạo dòng họ sẽ có không gian gia tộc ngay lập tức.",
        });
      } else {
        setMessage({
          type: "error",
          text: res.error || "Không thể cập nhật cấu hình.",
        });
      }
    });
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-stone-900">
              Chế độ phê duyệt khi tạo dòng họ
            </span>
            {enabled ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="size-3.5" />
                ĐANG BẬT DUYỆT
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Zap className="size-3.5" />
                MỞ TỰ DO (KHÔNG CẦN DUYỆT)
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
            {enabled
              ? "Thành viên gửi đơn xin lập dòng họ sẽ vào hàng đợi chờ Super Admin xét duyệt. Dòng họ chỉ xuất hiện sau khi được duyệt."
              : "Thành viên tạo dòng họ sẽ được cấp workspace và trở thành Admin dòng họ ngay lập tức mà không cần chờ duyệt."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
            enabled ? "bg-[#800000]" : "bg-stone-300"
          }`}
          aria-label="Bật tắt chế độ duyệt dòng họ"
        >
          <span
            className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          >
            {isPending && <Loader2 className="size-3 animate-spin text-stone-600" />}
          </span>
        </button>
      </div>

      {message && (
        <div
          className={`mt-3.5 flex items-center gap-2 text-xs font-bold rounded-xl p-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Integrate `FamilyApprovalToggle` into `app/admin/families/page.tsx`**

Modify `app/admin/families/page.tsx`:
1. Import `FamilyApprovalToggle` from `@/components/admin/FamilyApprovalToggle`.
2. Import `isFamilyApprovalRequired` from `@/app/actions/system-settings`.
3. Fetch `isApprovalRequired` alongside `usersResult` and `creationRequests`:
```typescript
  const [usersResult, creationRequests, isApprovalRequired] = await Promise.all([
    supabase.rpc("get_admin_users"),
    getAdminFamilyCreationRequests(),
    isFamilyApprovalRequired(),
  ]);
```
4. Render `<FamilyApprovalToggle initialEnabled={isApprovalRequired} />` right above the tab content or inside the requests tab.

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/family-approval-admin-ui.test.mjs`
Expected: PASS.

- [ ] **Step 6: Commit Task 3**

```bash
git add components/admin/FamilyApprovalToggle.tsx app/admin/families/page.tsx tests/family-approval-admin-ui.test.mjs
git commit -m "feat(admin): add FamilyApprovalToggle component to admin families page"
```

---

### Task 4: User Dashboard Modal & Redirect at `/dashboard`

**Files:**
- Modify: `components/dashboard/CreateFamilyRequestModal.tsx`
- Modify: `app/dashboard/page.tsx`
- Test: `tests/family-creation-modal-toggle.test.mjs`

**Interfaces:**
- Consumes: `isFamilyApprovalRequired()` in `app/dashboard/page.tsx`
- Produces: `CreateFamilyRequestModal` with `approvalRequired` prop, conditional button labels ("Xin Tạo Dòng Họ Mới" vs "Tạo Dòng Họ Mới"), and automatic `router.push(result.redirectUrl)` when approval is disabled.

- [ ] **Step 1: Write the failing Modal toggle test**

Create `tests/family-creation-modal-toggle.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("CreateFamilyRequestModal supports approvalRequired prop and handles redirectUrl", () => {
  const modal = read("components/dashboard/CreateFamilyRequestModal.tsx");

  assert.match(modal, /approvalRequired/);
  assert.match(modal, /result\.redirectUrl/);
  assert.match(modal, /router\.push/);
});

test("Dashboard page fetches approval setting and passes to CreateFamilyRequestModal", () => {
  const page = read("app/dashboard/page.tsx");

  assert.match(page, /isFamilyApprovalRequired/);
  assert.match(page, /approvalRequired=/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/family-creation-modal-toggle.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Update `components/dashboard/CreateFamilyRequestModal.tsx`**

1. Update props interface:
```typescript
interface Props {
  isLoggedIn?: boolean;
  approvalRequired?: boolean;
}
```
2. Set default `approvalRequired = true`.
3. In `handleSubmit`:
```typescript
      const result = await requestFamilyCreationAction({ success: false }, formData);
      if (!result.success) {
        setError(result.error || "Không thể gửi yêu cầu.");
      } else {
        setIsOpen(false);
        setLogoPreview(null);
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        }
      }
```
4. Update trigger button text:
```tsx
<span>{approvalRequired ? "Xin Tạo Dòng Họ Mới" : "Tạo Dòng Họ Mới"}</span>
```
5. Update modal header & submit button:
- Header: `{approvalRequired ? "Đăng Ký Tạo Dòng Họ Mới" : "Khởi Tạo Dòng Họ Mới"}`
- Description: `{approvalRequired ? "Vui lòng điền thông tin chi tiết. Ban Quản Trị sẽ xem xét và phê duyệt hồ sơ..." : "Điền thông tin dòng họ của bạn để bắt đầu khởi tạo không gian gia tộc và cây gia phả ngay lập tức."}`
- Submit Button: `{approvalRequired ? "Gửi Yêu Cầu Xét Duyệt" : "Khởi Tạo Dòng Họ Ngay"}`

- [ ] **Step 4: Update `app/dashboard/page.tsx`**

1. Import `isFamilyApprovalRequired` from `@/app/actions/system-settings`.
2. Fetch `approvalRequired` in `Promise.all`:
```typescript
  const [profile, families, directory, activeRequest, approvalRequired] = await Promise.all([
    getProfile(),
    getAccessibleFamilies(),
    getFamilyDirectory(q, visibility, currentPage),
    getUserActiveFamilyCreationRequest(),
    isFamilyApprovalRequired(),
  ]);
```
3. Pass `approvalRequired={approvalRequired}` to `<CreateFamilyRequestModal isLoggedIn={Boolean(profile?.is_active)} approvalRequired={approvalRequired} />`.

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/family-creation-modal-toggle.test.mjs`
Expected: PASS.

- [ ] **Step 6: Commit Task 4**

```bash
git add components/dashboard/CreateFamilyRequestModal.tsx app/dashboard/page.tsx tests/family-creation-modal-toggle.test.mjs
git commit -m "feat(dashboard): adapt CreateFamilyRequestModal and dashboard page to approval setting"
```

---

### Task 5: End-to-End Test Suite Integration & Verification

**Files:**
- Modify: `package.json`
- Verify: Full test command `npm test`

- [ ] **Step 1: Register new test files in `package.json`**

Add to `package.json` `"scripts"."test"`:
- `tests/system-settings-db-schema.test.mjs`
- `tests/family-approval-admin-ui.test.mjs`
- `tests/family-creation-modal-toggle.test.mjs`
- `tests/system-settings-actions.test.ts` (in the tsx section)

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: ALL test suites pass without any failures.

- [ ] **Step 3: Commit Task 5**

```bash
git add package.json
git commit -m "test: register family approval toggle tests and verify full suite"
```
