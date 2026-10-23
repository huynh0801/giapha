# Security BFF Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate all client-side exposure of Supabase credentials and database endpoints by migrating authentication, storage uploads, and client-side data queries to Next.js Server Actions (BFF Pattern), sanitizing helper scripts, and verifying clean production builds.

**Architecture:** 
1. Server Actions in `app/actions/auth.ts`, `app/actions/storage.ts`, and `app/actions/genealogy.ts` handle all authentication, file uploads, and data fetching on the Next.js server.
2. Next.js server utils (`utils/supabase/server.ts`, `utils/supabase/middleware.ts`) prioritize server-only environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
3. Client components (`app/login/page.tsx`, `app/admin/login/page.tsx`, `components/LogoutButton.tsx`, `components/MemberForm.tsx`, `components/RelationshipCanvasEditor.tsx`, `components/RelationshipManager.tsx`, `components/DataImportExport.tsx`, `components/MemberDetailModal.tsx`) are completely decoupled from `@/utils/supabase/client`.
4. Automated regression tests verify zero client-side Supabase client imports, clean script credentials, and passing production builds.

**Tech Stack:** Next.js 16 (App Router), React 19, Supabase SSR (`@supabase/ssr`), Node.js test runner (`node:test`).

## Global Constraints

- Do not break existing genealogy queries, multi-tenant family isolation, tree rendering, or relationships.
- All 34 existing automated tests in `npm.cmd test` must continue to pass.
- Maintain existing user sessions, cookie handling, and redirect flows (`/dashboard`, `/admin`, `/login`).
- All edits must preserve existing comments and documentation unless directly addressing security hardening.

---

### Task 1: Environment Variables and Server/Client Supabase Hygiene

**Files:**
- Modify: `utils/supabase/server.ts`
- Modify: `utils/supabase/middleware.ts`
- Modify: `utils/supabase/client.ts`
- Modify: `scripts/backup-full-database.mjs`
- Modify: `scripts/restore-from-backup.mjs`
- Modify: `scripts/restore-diepdung-and-blogs.mjs`
- Modify: `scripts/wipe-accessible-data.mjs`
- Modify: `.env.local`
- Modify: `.env.example`
- Modify: `tests/security-hardening.test.mjs`

**Interfaces:**
- `utils/supabase/server.ts`: `createClient(cookieStore)` uses `process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
- `scripts/*.mjs`: requires `process.env.SUPABASE_URL` and `process.env.SUPABASE_KEY` without hardcoded fallback strings.

- [ ] **Step 1: Update `tests/security-hardening.test.mjs` to assert script credential hygiene**

Add test to verify that `scripts/backup-full-database.mjs`, `scripts/restore-from-backup.mjs`, `scripts/restore-diepdung-and-blogs.mjs`, and `scripts/wipe-accessible-data.mjs` do not contain hardcoded project credentials `sb_publishable_` or `srsckyplvrwuweqbcegk`.

- [ ] **Step 2: Run test to verify failure**

Run: `node --test tests/security-hardening.test.mjs`
Expected: FAIL on the new script hygiene assertions.

- [ ] **Step 3: Update `utils/supabase/server.ts` and `utils/supabase/middleware.ts`**

Update environment variable resolution to accept server-only variables first:
```typescript
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
```

- [ ] **Step 4: Sanitize `scripts/*.mjs`**

Remove hardcoded fallback strings:
```javascript
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Lỗi: Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_KEY.");
  process.exit(1);
}
```

- [ ] **Step 5: Sanitize `utils/supabase/client.ts`**

Make `utils/supabase/client.ts` return a safe dummy client if keys are not provided on the client, preventing any build leakage:
```typescript
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({
          data: null,
          error: new Error("Client-side auth is deprecated. Use Server Actions."),
        }),
        signUp: async () => ({
          data: null,
          error: new Error("Client-side auth is deprecated. Use Server Actions."),
        }),
        signOut: async () => ({ error: null }),
      },
    } as unknown as SupabaseClient;
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
};
```

- [ ] **Step 6: Update `.env.example` and `.env.local`**

Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are documented and present in `.env.local`.

- [ ] **Step 7: Run test to verify success**

Run: `node --test tests/security-hardening.test.mjs`
Expected: PASS

- [ ] **Step 8: Commit changes**

```bash
git add utils/supabase/server.ts utils/supabase/middleware.ts utils/supabase/client.ts scripts/ .env.example tests/security-hardening.test.mjs
git commit -m "fix(security): sanitize script credentials and support server-only environment variables"
```

---

### Task 2: Auth Server Actions (`app/actions/auth.ts`) & Auth UI Decoupling

**Files:**
- Create: `app/actions/auth.ts`
- Modify: `app/login/page.tsx`
- Modify: `app/admin/login/page.tsx`
- Modify: `components/LogoutButton.tsx`
- Modify: `components/UserProvider.tsx`
- Modify: `tests/security-hardening.test.mjs`

**Interfaces:**
- `app/actions/auth.ts`:
  - `loginAction({ email, password }) -> Promise<{ success: boolean; redirect?: string; error?: string }>`
  - `adminLoginAction({ email, password, nextPath?: string }) -> Promise<{ success: boolean; redirect?: string; error?: string }>`
  - `signUpAction({ email, password, confirmPassword }) -> Promise<{ success: boolean; redirect?: string; message?: string; error?: string }>`
  - `signOutAction() -> Promise<{ success: boolean; error?: string }>`

- [ ] **Step 1: Write tests in `tests/security-hardening.test.mjs`**

Add assertions that:
1. `app/login/page.tsx`, `app/admin/login/page.tsx`, `components/LogoutButton.tsx` do not import `@/utils/supabase/client`.
2. `app/actions/auth.ts` exports `loginAction`, `adminLoginAction`, `signUpAction`, `signOutAction`.

- [ ] **Step 2: Run test to verify failure**

Run: `node --test tests/security-hardening.test.mjs`
Expected: FAIL because `app/actions/auth.ts` does not exist yet.

- [ ] **Step 3: Implement `app/actions/auth.ts`**

Create `app/actions/auth.ts` with `"use server"` directive and implement `loginAction`, `adminLoginAction`, `signUpAction`, and `signOutAction` using `createClient(await cookies())` from `@/utils/supabase/server`.

- [ ] **Step 4: Refactor `app/login/page.tsx`**

Replace client-side `supabase.auth.signInWithPassword` and `supabase.auth.signUp` with calls to `loginAction` and `signUpAction`. Remove `createClient` import.

- [ ] **Step 5: Refactor `app/admin/login/page.tsx`**

Replace client-side auth and profile check with call to `adminLoginAction`. Remove `createClient` import.

- [ ] **Step 6: Refactor `components/LogoutButton.tsx`**

Replace `supabase.auth.signOut()` with `signOutAction()`. Remove `createClient` import.

- [ ] **Step 7: Refactor `components/UserProvider.tsx`**

Ensure `UserContext` does not construct a live browser client that exposes keys. Provide a safe stub for `supabase` property for backward compatibility with components that read `useUser()`.

- [ ] **Step 8: Run test to verify pass**

Run: `node --test tests/security-hardening.test.mjs`
Expected: PASS

- [ ] **Step 9: Commit changes**

```bash
git add app/actions/auth.ts app/login/page.tsx app/admin/login/page.tsx components/LogoutButton.tsx components/UserProvider.tsx tests/security-hardening.test.mjs
git commit -m "feat(auth): migrate authentication to server actions and decouple auth UI from client supabase"
```

---

### Task 3: Storage, Genealogy Server Actions & Decoupling Remaining Client Components

**Files:**
- Create: `app/actions/storage.ts`
- Modify: `app/actions/genealogy.ts`
- Modify: `components/MemberForm.tsx`
- Modify: `components/MemberDetailModal.tsx`
- Modify: `components/RelationshipCanvasEditor.tsx`
- Modify: `components/RelationshipManager.tsx`
- Modify: `components/DataImportExport.tsx`
- Modify: `tests/security-hardening.test.mjs`

**Interfaces:**
- `app/actions/storage.ts`:
  - `uploadAvatarAction(formData: FormData) -> Promise<{ success: boolean; publicUrl?: string; error?: string }>`
  - `deleteAvatarAction(filePath: string) -> Promise<{ success: boolean; error?: string }>`
- `app/actions/genealogy.ts`:
  - `getCanvasDataAction(familyId: string, treeId: string) -> Promise<{ success: boolean; persons: Person[]; relationships: Relationship[]; error?: string }>`
  - `getExportPersonsAction(familyId: string, treeId: string) -> Promise<{ success: boolean; persons: Person[]; error?: string }>`
  - `getRelationshipDetailsAction(familyId: string, treeId: string, personId: string) -> Promise<{ ... }>`
- `app/actions/member.ts`:
  - `getMemberDetailAction(familyId: string, treeId: string, memberId: string, canEditPrivate: boolean) -> Promise<{ ... }>`

- [ ] **Step 1: Write tests in `tests/security-hardening.test.mjs`**

Add assertion that NO components in `components/` import `@/utils/supabase/client` (excluding tests).

- [ ] **Step 2: Run test to verify failure**

Run: `node --test tests/security-hardening.test.mjs`
Expected: FAIL because `MemberForm.tsx`, `MemberDetailModal.tsx`, `RelationshipCanvasEditor.tsx`, `RelationshipManager.tsx`, and `DataImportExport.tsx` still import `createClient`.

- [ ] **Step 3: Implement `app/actions/storage.ts`**

Create `app/actions/storage.ts` with `"use server"`. Validate file size (max 5MB), mime type (`image/jpeg`, `image/png`, `image/webp`). Upload to `avatars` bucket using server client and return `publicUrl`.

- [ ] **Step 4: Implement Server Actions in `app/actions/genealogy.ts` and `app/actions/member.ts`**

Add `getCanvasDataAction`, `getExportPersonsAction`, and `getMemberDetailAction`.

- [ ] **Step 5: Refactor `components/MemberForm.tsx`**

Replace `supabase.storage.from("avatars").upload` and `remove` with `uploadAvatarAction` and `deleteAvatarAction`. Remove `createClient` import.

- [ ] **Step 6: Refactor `components/MemberDetailModal.tsx`**

Replace `supabase.from("persons").select` and `supabase.from("person_details_private").select` with `getMemberDetailAction`. Remove `supabase` usage.

- [ ] **Step 7: Refactor `components/RelationshipCanvasEditor.tsx` & `components/RelationshipManager.tsx`**

Replace client-side selects with `getCanvasDataAction` and server actions. Remove `createClient` import.

- [ ] **Step 8: Refactor `components/DataImportExport.tsx`**

Replace dynamic import `import("@/utils/supabase/client")` with `getExportPersonsAction`.

- [ ] **Step 9: Run tests to verify pass**

Run: `node --test tests/security-hardening.test.mjs`
Expected: PASS (0 client components import `@/utils/supabase/client`).

- [ ] **Step 10: Commit changes**

```bash
git add app/actions/storage.ts app/actions/genealogy.ts app/actions/member.ts components/MemberForm.tsx components/MemberDetailModal.tsx components/RelationshipCanvasEditor.tsx components/RelationshipManager.tsx components/DataImportExport.tsx tests/security-hardening.test.mjs
git commit -m "feat(bff): migrate client storage and data fetching to server actions"
```

---

### Task 4: Complete Verification, Build Check & Bundle Inspection

**Files:**
- Workspace files
- `.next/` build output

- [ ] **Step 1: Run complete test suite**

Run: `npm.cmd test`
Expected: All 34+ tests pass cleanly (multitenant, security-hardening, genealogy-engine, excel-import).

- [ ] **Step 2: Run production Next.js build**

Run: `npm.cmd run build`
Expected: Exit 0. All routes compile statically/dynamically without errors.

- [ ] **Step 3: Inspect client bundles for credential leakage**

Run a script to inspect `.next/static/` and verify that the remote Supabase project URL (`srsckyplvrwuweqbcegk`) and publishable key (`sb_publishable_`) DO NOT exist in any client-side JavaScript chunk.

- [ ] **Step 4: Review git status and git log**

Run: `git status` and `git log -n 5 --oneline`
Ensure working tree is clean.
