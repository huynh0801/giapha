# Dashboard Modern Heritage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the family selector directory (`/dashboard`) and family workspace dashboard (`/dashboard/[familySlug]`) with a Vietnamese imperial royal genealogy aesthetic ("Modern Heritage") using reusable heritage components without breaking existing multi-tenant security, queries, or tests.

**Architecture:** Create a reusable component suite `components/dashboard/HeritageUI.tsx` containing `HeritageFrame`, `HeritageBadge`, and `HeritageStatCard` with authentic Vietnamese royal accents (crimson `#8c1d1d`, antique gold `#caa455`/`#deb887`, jade `#183b28`, warm parchment `#f7f3ea`/`#fffdf7`). Refactor `app/dashboard/page.tsx` and `app/dashboard/[familySlug]/page.tsx` to adopt this layout and theme while preserving Server Component data fetching, RLS boundaries, and Server Actions.

**Tech Stack:** Next.js 16 (App Router, Turbopack, React 19 Server Components), Tailwind CSS v4, Lucide React, Node.js Test Runner.

## Global Constraints

- Preserve all existing Server Actions, Supabase queries (`getAccessibleFamilies`, `getFamilyDirectory`, `getFamilyContextBySlug`, `requestJoinFamilyAction`), and URL parameter handling (`q`, `visibility`, `page`, `request`, `treeId`).
- Maintain Vietnamese copy with full diacritics and no mojibake.
- Ensure all existing unit tests in `tests/multitenant-private.test.mjs`, `tests/security-hardening.test.mjs`, and `tests/landing-page.test.mjs` pass cleanly.
- Build must pass TypeScript verification (`npm run build`).

---

### Task 1: Create Reusable Heritage UI Component Suite

**Files:**
- Create: `components/dashboard/HeritageUI.tsx`
- Test: `tests/heritage-ui.test.mjs`

**Interfaces:**
- Produces:
  - `HeritageFrame`: Container component with gold double-border, warm parchment background, and 4 traditional crimson corner brackets.
    - Props: `{ children: React.ReactNode; className?: string; innerClassName?: string; cornerColor?: string; }`
  - `HeritageBadge`: Royal seal / stamp badge.
    - Props: `{ children: React.ReactNode; variant?: "crimson" | "jade" | "amber" | "neutral"; className?: string; }`
  - `HeritageStatCard`: Metric card for family stats.
    - Props: `{ title: string; value: number | string; icon?: React.ReactNode; subtext?: string; className?: string; }`

- [ ] **Step 1: Write test for HeritageUI components**

Create `tests/heritage-ui.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("HeritageUI components are properly exported and contain expected styles", () => {
  const filePath = path.resolve("components/dashboard/HeritageUI.tsx");
  assert.ok(fs.existsSync(filePath), "components/dashboard/HeritageUI.tsx must exist");
  const content = fs.readFileSync(filePath, "utf8");

  assert.match(content, /export function HeritageFrame/, "HeritageFrame must be exported");
  assert.match(content, /export function HeritageBadge/, "HeritageBadge must be exported");
  assert.match(content, /export function HeritageStatCard/, "HeritageStatCard must be exported");
  assert.match(content, /#caa455/, "Must contain antique gold border color");
  assert.match(content, /#8c1d1d/, "Must contain imperial crimson color");
  assert.match(content, /#183b28/, "Must contain heritage jade color");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/heritage-ui.test.mjs`
Expected: FAIL ("components/dashboard/HeritageUI.tsx must exist")

- [ ] **Step 3: Implement HeritageUI components**

Write `components/dashboard/HeritageUI.tsx`:
```tsx
import React from "react";

export interface HeritageFrameProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  cornerColor?: string;
}

export function HeritageFrame({
  children,
  className = "",
  innerClassName = "",
  cornerColor = "#8c1d1d",
}: HeritageFrameProps) {
  return (
    <div
      className={`relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-[0_4px_20px_rgba(44,26,17,0.06)] ${className}`}
    >
      <div
        className={`relative border border-[#deb887] bg-[#fffdf7] p-5 sm:p-6 ${innerClassName}`}
      >
        {/* 4 Traditional Corner Brackets */}
        <span
          className="pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2"
          style={{ borderColor: cornerColor }}
        />
        <span
          className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2"
          style={{ borderColor: cornerColor }}
        />
        <span
          className="pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2"
          style={{ borderColor: cornerColor }}
        />
        <span
          className="pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2"
          style={{ borderColor: cornerColor }}
        />
        {children}
      </div>
    </div>
  );
}

export interface HeritageBadgeProps {
  children: React.ReactNode;
  variant?: "crimson" | "jade" | "amber" | "neutral";
  className?: string;
}

export function HeritageBadge({
  children,
  variant = "neutral",
  className = "",
}: HeritageBadgeProps) {
  const variantStyles = {
    crimson: "bg-[#8c1d1d] text-white border border-[#6e1616] shadow-sm",
    jade: "bg-[#eaf3ed] text-[#183b28] border border-[#a3c9b2]",
    amber: "bg-[#fef8ea] text-[#92540b] border border-[#e8ce8a]",
    neutral: "bg-[#f4efe6] text-[#5c4a3e] border border-[#deb887]/60",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export interface HeritageStatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  subtext?: string;
  className?: string;
}

export function HeritageStatCard({
  title,
  value,
  icon,
  subtext,
  className = "",
}: HeritageStatCardProps) {
  return (
    <div
      className={`relative p-4 rounded-xl border border-[#deb887]/70 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] shadow-sm flex items-center justify-between ${className}`}
    >
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-[#7a6455]">
          {title}
        </p>
        <p className="mt-1 text-2xl sm:text-3xl font-black text-[#183b28]">
          {value}
        </p>
        {subtext && (
          <p className="mt-0.5 text-xs font-medium text-[#7a6455]">{subtext}</p>
        )}
      </div>
      {icon && (
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#f5e7c7] text-[#8c1d1d] border border-[#deb887]/60 shadow-xs shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/heritage-ui.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/heritage-ui.test.mjs components/dashboard/HeritageUI.tsx
git commit -m "feat(dashboard): add reusable HeritageUI component suite"
```

---

### Task 2: Redesign Family Selector & Directory (`app/dashboard/page.tsx`)

**Files:**
- Modify: `app/dashboard/page.tsx`
- Test: `tests/multitenant-private.test.mjs`

**Interfaces:**
- Consumes:
  - `HeritageFrame`, `HeritageBadge` from `components/dashboard/HeritageUI`
  - `getAccessibleFamilies`, `getProfile`, `getSupabase` from `@/utils/supabase/queries`
  - `requestJoinFamilyAction` from `@/app/actions/join-request`

- [ ] **Step 1: Check existing multitenant & directory tests**

Run: `node --test tests/multitenant-private.test.mjs`
Expected: PASS

- [ ] **Step 2: Update `app/dashboard/page.tsx` to Modern Heritage style**

Apply traditional Vietnamese royal styling:
- Page Header:
  - Small uppercase kicker: `text-[#8c1d1d] font-bold tracking-[0.2em]`: "KHÔNG GIAN LÀM VIỆC GIA TỘC"
  - Title in font-serif `"SVN-Studio Brush", "Playfair Display", Georgia, serif`: "Chọn Dòng Họ & Danh Bạ"
  - Subtitle explaining privacy and membership in warm brown `#5c4a3e`.
- Accessible Families Section:
  - Wrap each family card in `HeritageFrame` with hover animation.
  - Role badge with `HeritageBadge` (crimson for Primary Admin, amber for Member).
  - Clean action link to `/dashboard/${family.slug}` with styled arrow.
- Family Directory Section:
  - Wrap directory in an outer `HeritageFrame`.
  - Traditional search form: input with `#deb887` border, filter select with gold tone, submit button with `#8c1d1d` crimson background.
  - Directory family cards: gold border, warm background, admin contact info, member count, and join request form.
  - Elegant pagination buttons with mộc bản styling.

- [ ] **Step 3: Run multitenant and security tests**

Run: `node --test tests/multitenant-private.test.mjs tests/security-hardening.test.mjs`
Expected: PASS (all tests pass, keeping join request flow and role labeling intact).

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "style(dashboard): redesign family selector and directory with heritage frame"
```

---

### Task 3: Redesign Family Workspace Dashboard (`app/dashboard/[familySlug]/page.tsx`)

**Files:**
- Modify: `app/dashboard/[familySlug]/page.tsx`
- Test: `tests/multitenant-private.test.mjs`

**Interfaces:**
- Consumes:
  - `HeritageFrame`, `HeritageBadge`, `HeritageStatCard` from `components/dashboard/HeritageUI`
  - `getFamilyContextBySlug`, `getSupabase` from `@/utils/supabase/queries`
  - `computeEvents`, `getTodayLunar`, `FamilyQrCard`

- [ ] **Step 1: Review current implementation of `app/dashboard/[familySlug]/page.tsx`**

Verify that all links, stats (persons, relationships, upcomingEvents), admin contacts, and QR cards are preserved.

- [ ] **Step 2: Redesign `app/dashboard/[familySlug]/page.tsx`**

- Top Banner / Hero:
  - Large `HeritageFrame` enveloping family name in `"SVN-Studio Brush", "Playfair Display", Georgia, serif`, sized `text-3xl sm:text-4xl text-[#183b28]`.
  - Solar & Lunar calendar block styled as an imperial court date tablet (`border-[#deb887] bg-[#fdf9f0]`).
  - 3 `HeritageStatCard` items for Members, Relationships, and 30-day Events.
- Feature Grid:
  - Each `FeatureCard` wrapped in a refined card with gold border `#deb887`, hover border `#caa455`, warm ivory background `#fffdf7`.
  - Title in `font-serif text-[#183b28] font-bold group-hover:text-[#8c1d1d]`.
- Admin Section:
  - Admin features displayed in separate heritage cards with crimson accents for management tools.
  - Family Admin contacts shown with `HeritageBadge` ("Quản trị chính" vs "Quản trị phụ").
- Upcoming Events & QR:
  - Upcoming death anniversaries / birthdays formatted with kỵ nhật styling.
  - `FamilyQrCard` integrated cleanly.

- [ ] **Step 3: Run all test suites**

Run: `node --test tests/multitenant-private.test.mjs tests/landing-page.test.mjs tests/security-hardening.test.mjs`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/[familySlug]/page.tsx
git commit -m "style(dashboard): redesign family workspace dashboard with modern heritage aesthetic"
```

---

### Task 4: Full Suite Verification & Build Validation

**Files:**
- Test: all test files
- Verification: `npm run build`

- [ ] **Step 1: Run complete test suite**

Run: `npm.cmd run test`
Expected: PASS (48/48 tests pass)

- [ ] **Step 2: Run Next.js production build**

Run: `npm.cmd run build`
Expected: PASS (exit code 0, TypeScript checks pass)

- [ ] **Step 3: Verify local dev server response**

Run: `curl.exe -I http://localhost:3000/dashboard`
Expected: HTTP 200 or 307 (redirect to slug if logged in)

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```
