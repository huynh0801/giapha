# Kế Hoạch Triển Khai: Người Dùng Gửi Yêu Cầu Tạo Gia Tộc & Admin Phê Duyệt

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng tính năng cho phép người dùng thông thường gửi đơn xin lập gia tộc trên Dashboard, có hệ thống theo dõi trạng thái, và Super Admin có thể xem xét, duyệt (tự động tạo gia tộc + gán quyền Quản trị viên chính) hoặc từ chối tại trang `/admin/families`.

**Architecture:** Sử dụng bảng dữ liệu `family_creation_requests` độc lập kèm phân quyền Row Level Security (RLS); Stored Procedure `approve_family_creation_request` nguyên tử (Atomic Transaction) đảm bảo việc sinh slug, tạo dòng họ và phân quyền Admin chính không bị lỗi giữa chừng; Server Actions bảo mật đa tầng; giao diện di sản đồng bộ cho cả phía Người dùng (`/dashboard`) và Super Admin (`/admin/families`).

**Tech Stack:** Next.js 16 (App Router, Server Actions, Turbopack), Supabase (PostgreSQL, RLS, PL/pgSQL RPCs), TypeScript, Tailwind CSS, Lucide Icons, Node.js Native Test Runner (`node:test`).

## Global Constraints
- Tuân thủ toàn vẹn bảo mật đa tầng (Multi-tenant): Không import client Supabase trong client component (chỉ dùng Server Actions).
- Tất cả các nút bấm, văn bản hiển thị bằng tiếng Việt chuẩn có dấu, không lỗi font/mojibake.
- Giữ nguyên toàn bộ 90 tests hiện có, tất cả các bài test mới phải pass 100%.
- Kiểm tra `npx tsc --noEmit` và `npm run build` hoàn tất với mã lỗi 0 trước khi hoàn thành.

---

### Task 1: Migration Cơ Sở Dữ Liệu & Stored Procedure Phê Duyệt Nguyên Tử

**Files:**
- Create: `supabase/migrations/20261028140000_family_creation_requests.sql`
- Test: `tests/family-creation-db-schema.test.mjs`

**Interfaces:**
- Produces:
  - Table `public.family_creation_requests`
  - Function `public.approve_family_creation_request(p_request_id UUID, p_family_slug TEXT DEFAULT NULL) RETURNS JSONB`
  - Function `public.reject_family_creation_request(p_request_id UUID, p_reason TEXT DEFAULT NULL) RETURNS JSONB`

- [ ] **Step 1: Viết test kiểm tra cú pháp và cấu trúc migration**

Tạo file `tests/family-creation-db-schema.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("migration creates family_creation_requests table with RLS and atomic approval RPC", () => {
  const migration = read("supabase/migrations/20261028140000_family_creation_requests.sql");

  // Table definition
  assert.match(migration, /CREATE TABLE IF NOT EXISTS public\.family_creation_requests/);
  assert.match(migration, /user_id UUID NOT NULL REFERENCES public\.profiles\(id\)/);
  assert.match(migration, /family_name TEXT NOT NULL/);
  assert.match(migration, /phone_contact TEXT NOT NULL/);
  assert.match(migration, /status TEXT NOT NULL DEFAULT 'pending'/);
  assert.match(migration, /approved_family_id UUID REFERENCES public\.families\(id\)/);

  // RLS enablement and policies
  assert.match(migration, /ALTER TABLE public\.family_creation_requests ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /CREATE POLICY.*ON public\.family_creation_requests/);

  // Atomic approval RPC
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.approve_family_creation_request/);
  assert.match(migration, /SECURITY DEFINER/);
  assert.match(migration, /INSERT INTO public\.families/);
  assert.match(migration, /INSERT INTO public\.family_members/);
  assert.match(migration, /is_primary_admin.*true/);

  // Rejection RPC
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.reject_family_creation_request/);
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại (do chưa có file migration)**

Run: `node --test tests/family-creation-db-schema.test.mjs`
Expected: FAIL với lỗi "ENOENT: no such file or directory"

- [ ] **Step 3: Viết file SQL Migration**

Tạo file `supabase/migrations/20261028140000_family_creation_requests.sql`:
```sql
-- Migration: Bảng yêu cầu tạo dòng họ & Stored Procedures phê duyệt nguyên tử
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

ALTER TABLE public.family_creation_requests ENABLE ROW LEVEL SECURITY;

-- 1. Requester RLS Policies
DROP POLICY IF EXISTS "Users can view their own creation requests" ON public.family_creation_requests;
CREATE POLICY "Users can view their own creation requests"
ON public.family_creation_requests
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own creation requests" ON public.family_creation_requests;
CREATE POLICY "Users can create their own creation requests"
ON public.family_creation_requests
FOR INSERT
WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
        SELECT 1 FROM public.family_creation_requests
        WHERE user_id = auth.uid() AND status = 'pending'
    )
);

DROP POLICY IF EXISTS "Users can cancel their pending creation requests" ON public.family_creation_requests;
CREATE POLICY "Users can cancel their pending creation requests"
ON public.family_creation_requests
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

-- 2. System Admin RLS Policies
DROP POLICY IF EXISTS "System admins can view all creation requests" ON public.family_creation_requests;
CREATE POLICY "System admins can view all creation requests"
ON public.family_creation_requests
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
);

DROP POLICY IF EXISTS "System admins can update creation requests" ON public.family_creation_requests;
CREATE POLICY "System admins can update creation requests"
ON public.family_creation_requests
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
);

-- 3. Stored Procedure: Phê duyệt yêu cầu nguyên tử (Atomic Transaction)
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
BEGIN
    -- Kiểm tra quyền Super Admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Chỉ Quản trị viên hệ thống mới có quyền phê duyệt.');
    END IF;

    -- Lấy và khóa bản ghi yêu cầu
    SELECT * INTO v_req FROM public.family_creation_requests
    WHERE id = p_request_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Yêu cầu không tồn tại hoặc đã được xử lý.');
    END IF;

    -- Chuẩn hóa slug
    v_slug := COALESCE(NULLIF(trim(p_family_slug), ''), slugify(v_req.family_name));
    IF v_slug IS NULL OR length(v_slug) = 0 THEN
        v_slug := 'dong-ho-' || substr(v_req.id::text, 1, 8);
    END IF;

    -- Tránh trùng slug
    WHILE EXISTS (SELECT 1 FROM public.families WHERE slug = v_slug) LOOP
        v_slug := v_slug || '-' || floor(random() * 900 + 100)::int::text;
    END LOOP;

    -- Tạo dòng họ mới
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

    -- Gán người gửi làm Quản trị viên chính của dòng họ
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

    -- Cập nhật trạng thái yêu cầu
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

-- 4. Stored Procedure: Từ chối yêu cầu
CREATE OR REPLACE FUNCTION public.reject_family_creation_request(
    p_request_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Chỉ Quản trị viên hệ thống mới có quyền từ chối.');
    END IF;

    UPDATE public.family_creation_requests
    SET status = 'rejected',
        rejection_reason = p_reason,
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        updated_at = now()
    WHERE id = p_request_id AND status = 'pending';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Yêu cầu không tồn tại hoặc đã được xử lý.');
    END IF;

    RETURN jsonb_build_object('success', true);
END;
$$;
```

- [ ] **Step 4: Chạy lại test để xác nhận test vượt qua**

Run: `node --test tests/family-creation-db-schema.test.mjs`
Expected: PASS 1/1

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20261028140000_family_creation_requests.sql tests/family-creation-db-schema.test.mjs
git commit -m "feat(db): add family creation requests schema, rls and atomic approval rpc"
```

---

### Task 2: Server Actions & Query Helpers Nghiệp Vụ

**Files:**
- Create: `app/actions/family-request.ts`
- Test: `tests/family-creation-actions.test.ts`

**Interfaces:**
- Produces:
  - `requestFamilyCreationAction(prevState, formData): Promise<{ success: boolean; error?: string; message?: string }>`
  - `cancelFamilyCreationAction(requestId: string): Promise<{ success: boolean; error?: string; message?: string }>`
  - `approveFamilyCreationAction(requestId: string, customSlug?: string): Promise<{ success: boolean; error?: string; slug?: string }>`
  - `rejectFamilyCreationAction(requestId: string, reason?: string): Promise<{ success: boolean; error?: string }>`
  - `getUserActiveFamilyCreationRequest(): Promise<FamilyCreationRequest | null>`
  - `getAdminFamilyCreationRequests(status?: string): Promise<FamilyCreationRequestAdminRow[]>`

- [ ] **Step 1: Viết test cho Server Actions**

Tạo file `tests/family-creation-actions.test.ts`:
```typescript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath: string) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("family-request server actions export required methods with validation and multi-tenant security", () => {
  const actions = read("app/actions/family-request.ts");

  // Exported server actions
  assert.match(actions, /export\s+async\s+function\s+requestFamilyCreationAction/);
  assert.match(actions, /export\s+async\s+function\s+cancelFamilyCreationAction/);
  assert.match(actions, /export\s+async\s+function\s+approveFamilyCreationAction/);
  assert.match(actions, /export\s+async\s+function\s+rejectFamilyCreationAction/);
  assert.match(actions, /export\s+async\s+function\s+getUserActiveFamilyCreationRequest/);
  assert.match(actions, /export\s+async\s+function\s+getAdminFamilyCreationRequests/);

  // Security and auth guards
  assert.match(actions, /getProfile/);
  assert.match(actions, /is_active/);
  assert.match(actions, /system_admin/);
  assert.doesNotMatch(actions, /@supabase\/supabase-js/);

  // Validation
  assert.match(actions, /Tên dòng họ/);
  assert.match(actions, /phone_contact|Số điện thoại/);
  assert.match(actions, /revalidatePath\("\/dashboard"\)/);
  assert.match(actions, /revalidatePath\("\/admin\/families"\)/);
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại (do chưa có file `family-request.ts`)**

Run: `node --import tsx --test tests/family-creation-actions.test.ts`
Expected: FAIL với lỗi "Cannot find module"

- [ ] **Step 3: Triển khai Server Actions `app/actions/family-request.ts`**

Tạo file `app/actions/family-request.ts`:
```typescript
"use server";

import { getProfile, getSupabase } from "@/utils/supabase/queries";
import { uploadStorageImage } from "@/utils/storage";
import { revalidatePath } from "next/cache";

export interface FamilyCreationRequest {
  id: string;
  user_id: string;
  family_name: string;
  origin_location: string | null;
  phone_contact: string;
  description: string | null;
  logo_url: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  rejection_reason: string | null;
  approved_family_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyCreationRequestAdminRow extends FamilyCreationRequest {
  requester_name: string | null;
  requester_email: string | null;
  requester_avatar: string | null;
}

function getText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function requestFamilyCreationAction(
  _prevState: { success: boolean; error?: string; message?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string; message?: string }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active) {
    return { success: false, error: "Vui lòng đăng nhập để gửi yêu cầu." };
  }

  const familyName = getText(formData, "family_name");
  const phoneContact = getText(formData, "phone_contact");
  const originLocation = getText(formData, "origin_location");
  const description = getText(formData, "description");

  if (!familyName || familyName.length < 3) {
    return { success: false, error: "Tên dòng họ phải có ít nhất 3 ký tự." };
  }

  if (!phoneContact) {
    return { success: false, error: "Số điện thoại liên hệ là bắt buộc." };
  }

  const supabase = await getSupabase();

  // Kiểm tra chống spam: Không gửi nhiều yêu cầu pending cùng lúc
  const { data: existingPending } = await supabase
    .from("family_creation_requests")
    .select("id")
    .eq("user_id", profile.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existingPending) {
    return {
      success: false,
      error: "Bạn đang có một yêu cầu tạo dòng họ đang chờ xét duyệt. Vui lòng chờ phản hồi.",
    };
  }

  // Xử lý logo nếu có upload
  let logoUrl: string | null = null;
  const logoFile = formData.get("logo_file");
  const isNewFile =
    logoFile !== null &&
    typeof logoFile === "object" &&
    "size" in logoFile &&
    Number((logoFile as { size?: unknown }).size) > 0;

  if (isNewFile) {
    const uploadResult = await uploadStorageImage({
      file: logoFile as File,
      folder: "families/logos",
      maxDimension: 600,
      bucketFallback: "avatars",
    });

    if (uploadResult.success && uploadResult.publicUrl) {
      logoUrl = uploadResult.publicUrl;
    }
  }

  const { error } = await supabase.from("family_creation_requests").insert({
    user_id: profile.id,
    family_name: familyName,
    origin_location: originLocation || null,
    phone_contact: phoneContact,
    description: description || null,
    logo_url: logoUrl,
    status: "pending",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/families");

  return {
    success: true,
    message: "Gửi yêu cầu tạo dòng họ thành công! Ban Quản Trị sẽ sớm xét duyệt hồ sơ của bạn.",
  };
}

export async function cancelFamilyCreationAction(
  requestId: string,
): Promise<{ success: boolean; error?: string; message?: string }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active) {
    return { success: false, error: "Vui lòng đăng nhập." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("family_creation_requests")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("user_id", profile.id)
    .eq("status", "pending");

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/families");

  return { success: true, message: "Đã hủy yêu cầu tạo dòng họ." };
}

export async function approveFamilyCreationAction(
  requestId: string,
  customSlug?: string,
): Promise<{ success: boolean; error?: string; slug?: string }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active || profile.role !== "system_admin") {
    return { success: false, error: "Chỉ Quản trị viên hệ thống mới có quyền phê duyệt." };
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("approve_family_creation_request", {
    p_request_id: requestId,
    p_family_slug: customSlug || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data && typeof data === "object" && "success" in data && !data.success) {
    return { success: false, error: String(data.error || "Không thể phê duyệt.") };
  }

  revalidatePath("/admin/families");
  revalidatePath("/dashboard");

  const slug = data && typeof data === "object" && "slug" in data ? String(data.slug) : undefined;
  return { success: true, slug };
}

export async function rejectFamilyCreationAction(
  requestId: string,
  reason?: string,
): Promise<{ success: boolean; error?: string }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active || profile.role !== "system_admin") {
    return { success: false, error: "Chỉ Quản trị viên hệ thống mới có quyền từ chối." };
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("reject_family_creation_request", {
    p_request_id: requestId,
    p_reason: reason || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data && typeof data === "object" && "success" in data && !data.success) {
    return { success: false, error: String(data.error || "Không thể từ chối.") };
  }

  revalidatePath("/admin/families");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function getUserActiveFamilyCreationRequest(): Promise<FamilyCreationRequest | null> {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await getSupabase();
  const { data } = await supabase
    .from("family_creation_requests")
    .select("*")
    .eq("user_id", profile.id)
    .in("status", ["pending", "rejected"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data as FamilyCreationRequest) || null;
}

export async function getAdminFamilyCreationRequests(
  statusFilter?: string,
): Promise<FamilyCreationRequestAdminRow[]> {
  const profile = await getProfile();
  if (!profile || profile.role !== "system_admin") return [];

  const supabase = await getSupabase();
  let query = supabase
    .from("family_creation_requests")
    .select(`
      *,
      requester:profiles!family_creation_requests_user_id_fkey(
        full_name,
        email,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data } = await query;
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    user_id: item.user_id,
    family_name: item.family_name,
    origin_location: item.origin_location,
    phone_contact: item.phone_contact,
    description: item.description,
    logo_url: item.logo_url,
    status: item.status,
    rejection_reason: item.rejection_reason,
    approved_family_id: item.approved_family_id,
    created_at: item.created_at,
    updated_at: item.updated_at,
    requester_name: item.requester?.full_name || null,
    requester_email: item.requester?.email || null,
    requester_avatar: item.requester?.avatar_url || null,
  }));
}
```

- [ ] **Step 4: Chạy test để xác nhận test vượt qua**

Run: `node --import tsx --test tests/family-creation-actions.test.ts`
Expected: PASS 1/1

- [ ] **Step 5: Commit**

```bash
git add app/actions/family-request.ts tests/family-creation-actions.test.ts
git commit -m "feat(actions): add family-request server actions and query helpers"
```

---

### Task 3: Giao Diện Thành Viên Trên Dashboard (`/dashboard`)

**Files:**
- Create: `components/dashboard/CreateFamilyRequestModal.tsx`
- Create: `components/dashboard/FamilyRequestStatusCard.tsx`
- Modify: `app/dashboard/page.tsx`
- Test: `tests/family-creation-dashboard-ui.test.mjs`

**Interfaces:**
- Produces:
  - `<CreateFamilyRequestModal />`: Modal form gửi yêu cầu xin lập dòng họ mới
  - `<FamilyRequestStatusCard />`: Card hiển thị trạng thái yêu cầu chờ duyệt / đã từ chối
  - Nút bấm `+ Xin Tạo Dòng Họ Mới` trên trang `/dashboard`

- [ ] **Step 1: Viết test cho Dashboard UI integration**

Tạo file `tests/family-creation-dashboard-ui.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("dashboard integrates create family request modal, status card, and button", () => {
  const dashboard = read("app/dashboard/page.tsx");
  const modal = read("components/dashboard/CreateFamilyRequestModal.tsx");
  const statusCard = read("components/dashboard/FamilyRequestStatusCard.tsx");

  // Dashboard page integration
  assert.match(dashboard, /CreateFamilyRequestModal/);
  assert.match(dashboard, /FamilyRequestStatusCard/);
  assert.match(dashboard, /getUserActiveFamilyCreationRequest/);
  assert.match(dashboard, /Xin Tạo Dòng Họ Mới|Đăng Ký Tạo Gia Tộc/);

  // Modal component
  assert.match(modal, /Tên dòng họ/);
  assert.match(modal, /Số điện thoại/);
  assert.match(modal, /Quê quán|Nguyên quán/);
  assert.match(modal, /requestFamilyCreationAction/);

  // Status card component
  assert.match(statusCard, /Đang chờ xét duyệt|Đang chờ duyệt/);
  assert.match(statusCard, /cancelFamilyCreationAction/);
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Run: `node --test tests/family-creation-dashboard-ui.test.mjs`
Expected: FAIL với lỗi "ENOENT: no such file or directory"

- [ ] **Step 3: Tạo `components/dashboard/CreateFamilyRequestModal.tsx`**

```tsx
"use client";

import { useState, useTransition } from "react";
import { requestFamilyCreationAction } from "@/app/actions/family-request";
import {
  Building2,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Phone,
  ScrollText,
  X,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";

export default function CreateFamilyRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 5MB.");
        return;
      }
      setLogoPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await requestFamilyCreationAction({ success: false }, formData);
      if (!result.success) {
        setError(result.error || "Không thể gửi yêu cầu.");
      } else {
        setIsOpen(false);
        setLogoPreview(null);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
      >
        <PlusCircle className="size-4" />
        <span>Xin Tạo Dòng Họ Mới</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-[#deb887] bg-[#fffdf7] p-6 sm:p-8 shadow-2xl my-auto">
            {/* Nút đóng */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#8c6b54] hover:bg-[#deb887]/20 transition-colors"
            >
              <X className="size-5" />
            </button>

            {/* Header modal */}
            <div className="text-center mb-6">
              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8c1d1d]">
                Khởi Tạo Cội Nguồn
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#183b28] mt-1">
                Đăng Ký Tạo Gia Tộc Mới
              </h2>
              <p className="text-xs text-[#5c4a3e] mt-1 leading-relaxed">
                Điền thông tin dòng họ của bạn để gửi Ban Quản Trị xét duyệt và cấp không gian gia phả.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl border border-red-300 bg-red-50 text-red-800 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Tên Dòng Họ <span className="text-[#8c1d1d]">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                  <input
                    name="family_name"
                    required
                    placeholder="Ví dụ: Họ Nguyễn Đại Tộc, Họ Trần Chi 3"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#deb887] bg-white text-sm outline-none focus:border-[#8c1d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Số Điện Thoại Liên Hệ <span className="text-[#8c1d1d]">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                  <input
                    name="phone_contact"
                    required
                    type="tel"
                    placeholder="Ví dụ: 0912345678 (Dùng để Admin xác minh)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#deb887] bg-white text-sm outline-none focus:border-[#8c1d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Quê Quán / Nguyên Quán
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                  <input
                    name="origin_location"
                    placeholder="Ví dụ: Nam Sách, Hải Dương"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#deb887] bg-white text-sm outline-none focus:border-[#8c1d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Mô Tả Sơ Lược / Lời Nhắn
                </label>
                <div className="relative">
                  <ScrollText className="absolute left-3.5 top-3 size-4 text-[#8c6b54]" />
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Giới thiệu sơ lược về thủy tổ, chi phái hoặc lý do xin lập gia tộc..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#deb887] bg-white text-sm outline-none focus:border-[#8c1d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Logo / Ảnh Đại Diện Dòng Họ (Tùy chọn)
                </label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative size-14 rounded-2xl border-2 border-[#deb887] overflow-hidden bg-white shrink-0">
                      <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="size-14 rounded-2xl border-2 border-dashed border-[#deb887] bg-white/60 flex items-center justify-center text-[#8c6b54] shrink-0">
                      <ImageIcon className="size-6 opacity-60" />
                    </div>
                  )}
                  <input
                    type="file"
                    name="logo_file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="text-xs text-[#5c4a3e] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#deb887]/30 file:text-[#8c1d1d] hover:file:bg-[#deb887]/50 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#deb887] bg-white text-xs font-bold text-[#5c4a3e] hover:bg-[#f5e7c7] transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  <span>Gửi Yêu Cầu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Tạo `components/dashboard/FamilyRequestStatusCard.tsx`**

```tsx
"use client";

import { useTransition } from "react";
import { cancelFamilyCreationAction, FamilyCreationRequest } from "@/app/actions/family-request";
import { AlertCircle, Clock3, Loader2, X } from "lucide-react";

interface Props {
  request: FamilyCreationRequest;
}

export default function FamilyRequestStatusCard({ request }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (confirm("Bạn có chắc chắn muốn hủy yêu cầu tạo dòng họ này?")) {
      startTransition(async () => {
        await cancelFamilyCreationAction(request.id);
      });
    }
  };

  if (request.status === "pending") {
    return (
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-4 sm:p-5 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <Clock3 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                Đang chờ xét duyệt
              </span>
              <span className="text-[11px] text-amber-700">
                • {new Date(request.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#183b28] mt-0.5">
              Hồ sơ tạo dòng họ: <span className="text-[#8c1d1d]">{request.family_name}</span>
            </h4>
            <p className="text-xs text-amber-800/90 mt-1">
              Yêu cầu của bạn đang được Ban Quản Trị xem xét. Sau khi duyệt, dòng họ sẽ tự động kích hoạt.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="self-end sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all disabled:opacity-50"
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
          <span>Hủy yêu cầu</span>
        </button>
      </div>
    );
  }

  if (request.status === "rejected") {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50/80 p-4 sm:p-5 shadow-xs mb-6 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-red-100 text-red-800 shrink-0">
          <AlertCircle className="size-5" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-red-900">
            Yêu cầu không được phê duyệt
          </span>
          <h4 className="text-sm font-bold text-[#183b28] mt-0.5">
            Dòng họ: <span className="text-red-700">{request.family_name}</span>
          </h4>
          {request.rejection_reason && (
            <p className="text-xs text-red-800 mt-1 font-medium">
              Lý do từ chối: &ldquo;{request.rejection_reason}&rdquo;
            </p>
          )}
          <p className="text-[11px] text-[#5c4a3e] mt-1">
            Bạn có thể chỉnh sửa thông tin và gửi lại đơn yêu cầu mới bất cứ lúc nào.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 5: Tích hợp vào `app/dashboard/page.tsx`**

Cập nhật `app/dashboard/page.tsx` gọi `getUserActiveFamilyCreationRequest()`, hiển thị `<FamilyRequestStatusCard />` và nút `<CreateFamilyRequestModal />`.

- [ ] **Step 6: Chạy test để xác nhận test vượt qua**

Run: `node --test tests/family-creation-dashboard-ui.test.mjs`
Expected: PASS 1/1

- [ ] **Step 7: Commit**

```bash
git add components/dashboard/CreateFamilyRequestModal.tsx components/dashboard/FamilyRequestStatusCard.tsx app/dashboard/page.tsx tests/family-creation-dashboard-ui.test.mjs
git commit -m "feat(dashboard): integrate family creation request modal and status card"
```

---

### Task 4: Giao Diện Quản Trị Hệ Thống (`/admin/families`)

**Files:**
- Create: `components/admin/AdminFamilyRequestsList.tsx`
- Modify: `app/admin/families/page.tsx`
- Test: `tests/family-creation-admin-ui.test.mjs`

**Interfaces:**
- Produces:
  - Tab chuyển đổi: "Danh sách dòng họ" và "Yêu cầu tạo gia tộc (N)"
  - `<AdminFamilyRequestsList />`: Bảng yêu cầu kèm nút Duyệt & Từ chối 1-click

- [ ] **Step 1: Viết test cho Admin UI integration**

Tạo file `tests/family-creation-admin-ui.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("admin families page integrates request list tab and approval actions", () => {
  const adminPage = read("app/admin/families/page.tsx");
  const requestsList = read("components/admin/AdminFamilyRequestsList.tsx");

  // Admin page integration
  assert.match(adminPage, /AdminFamilyRequestsList/);
  assert.match(adminPage, /getAdminFamilyCreationRequests/);
  assert.match(adminPage, /Yêu cầu tạo gia tộc/);

  // List component
  assert.match(requestsList, /approveFamilyCreationAction/);
  assert.match(requestsList, /rejectFamilyCreationAction/);
  assert.match(requestsList, /Phê duyệt/);
  assert.match(requestsList, /Từ chối/);
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Run: `node --test tests/family-creation-admin-ui.test.mjs`
Expected: FAIL với lỗi "ENOENT: no such file or directory"

- [ ] **Step 3: Tạo `components/admin/AdminFamilyRequestsList.tsx`**

Tạo component quản lý danh sách yêu cầu với modal xác nhận duyệt (cho phép xem trước / sửa slug) và modal từ chối (nhập lý do).

- [ ] **Step 4: Cập nhật `app/admin/families/page.tsx` với Tab di sản**

Bổ sung tab chuyển đổi giữa danh sách dòng họ hiện có và danh sách yêu cầu cần duyệt kèm badge đếm số lượng pending.

- [ ] **Step 5: Chạy test để xác nhận test vượt qua**

Run: `node --test tests/family-creation-admin-ui.test.mjs`
Expected: PASS 1/1

- [ ] **Step 6: Commit**

```bash
git add components/admin/AdminFamilyRequestsList.tsx app/admin/families/page.tsx tests/family-creation-admin-ui.test.mjs
git commit -m "feat(admin): add family creation requests management and approval tabs"
```

---

### Task 5: Kiểm Thử Toàn Diện & Xác Thực Build

**Files:**
- Modify: `package.json` (bổ sung test files vào script test)
- Run: `npm test`, `npx tsc --noEmit`, `npm run build`

- [ ] **Step 1: Cập nhật `package.json` với các bài test mới**

Thêm `tests/family-creation-db-schema.test.mjs`, `tests/family-creation-dashboard-ui.test.mjs`, `tests/family-creation-admin-ui.test.mjs` và `tests/family-creation-actions.test.ts` vào `scripts.test`.

- [ ] **Step 2: Chạy toàn bộ test suite**

Run: `npm test`
Expected: Tất cả bài test (49 mjs + 41 ts + 4 bài test mới = 94+ tests) vượt qua 100%, 0 fail.

- [ ] **Step 3: Kiểm tra kiểu dữ liệu TypeScript**

Run: `npx tsc --noEmit`
Expected: Exit code 0, 0 lỗi TypeScript.

- [ ] **Step 4: Kiểm tra build Turbopack sản phẩm**

Run: `npm run build`
Expected: Exit code 0, tất cả route biên dịch thành công.

- [ ] **Step 5: Commit và đẩy lên GitHub**

```bash
git add package.json
git commit -m "test: register family creation request tests in package.json test runner"
git push origin main
```
