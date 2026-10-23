# User Profile Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete user profile feature at `/profile` for all logged-in users to view/edit their personal info, upload avatar, change password, and see their joined families.

**Architecture:** Next.js Server Components with server actions for secure profile mutations and password changes. Route protected by Supabase SSR middleware. Client component `ProfileForm` for interactive editing with visual feedback.

**Tech Stack:** Next.js 16 (App Router), Supabase (Auth, DB, Storage bucket `avatars`), Tailwind CSS, Lucide icons.

## Global Constraints
- Commit author must be `huynh0801 <huynh0801@users.noreply.github.com>`.
- Preserve existing tests (all 42 must pass).
- No hardcoded secrets.
- Traditional aesthetic matching the landing page (`#f5e7c7` background, deckle edge paper styling).

---

### Task 1: Update Middleware & Server Actions for Profile

**Files:**
- Modify: `utils/supabase/middleware.ts`
- Modify: `app/actions/user.ts`

- [ ] **Step 1: Update `utils/supabase/middleware.ts` to include `/profile` in `isProtectedPath`**
- [ ] **Step 2: Add `updateUserProfileFull` and `changeAnyUserPassword` server actions in `app/actions/user.ts`**
- [ ] **Step 3: Test actions and middleware with tests**

---

### Task 2: Create `components/ProfileForm.tsx`

**Files:**
- Create: `components/ProfileForm.tsx`

- [ ] **Step 1: Implement `ProfileForm` client component with avatar upload, personal details editing, and password change tabs/sections**
- [ ] **Step 2: Wire up `uploadAvatarAction`, `updateUserProfileFull`, and `changeAnyUserPassword`**
- [ ] **Step 3: Add validation and toast/inline feedback**

---

### Task 3: Create Profile Page `app/profile/page.tsx`

**Files:**
- Create: `app/profile/page.tsx`

- [ ] **Step 1: Fetch authenticated `user`, `profile`, and `accessibleFamilies` in server component**
- [ ] **Step 2: Render `LandingHeader`, `ProfileForm`, family membership cards, and `LandingFooter`**
- [ ] **Step 3: Redirect to `/login` if unauthenticated**

---

### Task 4: Add "Hồ sơ cá nhân" Link to Header

**Files:**
- Modify: `components/landing/LandingHeader.tsx`

- [ ] **Step 1: Add `/profile` item to desktop profile dropdown menu for both `system_admin` and `member`**
- [ ] **Step 2: Add `/profile` item to mobile menu drawer**

---

### Task 5: Verification & Tests

**Files:**
- Create: `tests/user-profile.test.mjs`

- [ ] **Step 1: Add unit test verifying `/profile` route, form fields, and middleware protection**
- [ ] **Step 2: Run `npm.cmd test` and verify all 43+ tests pass**
- [ ] **Step 3: Run `npm.cmd run build` and ensure clean production build**
- [ ] **Step 4: Commit and push changes**
