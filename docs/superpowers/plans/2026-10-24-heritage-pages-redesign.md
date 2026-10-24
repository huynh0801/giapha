# Heritage Pages Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all 7 lineage subpages (`members`, `kinship`, `stats`, `events`, `about`, `blog`, `admins`) with a cohesive Vietnamese Royal Heritage design system while preserving 100% of existing logic, server actions, and query parameters.

**Architecture:** Create a unified `HeritagePageHeader` component with brush calligraphy, breadcrumb links, and context badges. Upgrade each destination page and its core client component to use `HeritageFrame`, `HeritageBadge`, warm parchment palettes (`#f5e7c7`), crimson lacquer (`#8c1d1d`), antique gold (`#caa455`), and imperial jade (`#183b28`).

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Lucide React, Framer Motion, Supabase.

## Global Constraints
- Preserve all existing Supabase queries, server actions, route handlers, and URL parameters (`treeId`, `view`, `rootId`).
- Preserve accessibility, mobile responsiveness, and Vietnamese lunar date calculations.
- Maintain font harmony: `SVN-Studio Brush` for headings, system sans-serif for numbers/data/forms.
- All commands on Windows PowerShell must use `npm.cmd` instead of `npm`.

---

### Task 1: Shared HeritagePageHeader Component

**Files:**
- Create: `components/dashboard/HeritagePageHeader.tsx`
- Test: `tests/heritage-page-header.test.mjs`

**Interfaces:**
- Consumes: `lucide-react` (ArrowLeft, FolderTree, Sparkles, LucideIcon), `next/link`.
- Produces:
  ```typescript
  export interface HeritagePageHeaderProps {
    familySlug: string;
    familyName: string;
    treeName?: string | null;
    title: string;
    description?: string;
    badge?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
  }
  export default function HeritagePageHeader(props: HeritagePageHeaderProps): React.JSX.Element;
  ```

- [ ] **Step 1: Write test for HeritagePageHeader**
Create `tests/heritage-page-header.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("HeritagePageHeader component file exists and exports default function", () => {
  const fileContent = fs.readFileSync("components/dashboard/HeritagePageHeader.tsx", "utf-8");
  assert.ok(fileContent.includes("export default function HeritagePageHeader"));
  assert.ok(fileContent.includes("familySlug"));
  assert.ok(fileContent.includes("title"));
  assert.ok(fileContent.includes("SVN-Studio Brush"));
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/heritage-page-header.test.mjs`
Expected: FAIL (file does not exist yet)

- [ ] **Step 3: Implement HeritagePageHeader**
Create `components/dashboard/HeritagePageHeader.tsx` with:
- Back button to `/dashboard/${familySlug}`
- Family badge & tree badge with `HeritageBadge`
- Calligraphy title with `font-brush` and color `#183b28`
- Description text in `#5c4a3e`
- Slot for action buttons

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/heritage-page-header.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit Task 1**
```bash
git add components/dashboard/HeritagePageHeader.tsx tests/heritage-page-header.test.mjs
git commit -m "feat(ui): add unified HeritagePageHeader component"
```

---

### Task 2: Redesign Kinship Page (`/kinship`) & KinshipFinder

**Files:**
- Modify: `app/dashboard/[familySlug]/kinship/page.tsx`
- Modify: `components/KinshipFinder.tsx`

**Interfaces:**
- Consumes: `HeritagePageHeader`, `HeritageFrame`, `HeritageBadge`, `computeKinship`.
- Produces: Enhanced kinship lookup UI with symmetric person selectors, gold/crimson/jade accents, and formatted relation cards.

- [ ] **Step 1: Verify current kinship page behavior**
Run: `npm.cmd test`
Verify existing tests continue to pass.

- [ ] **Step 2: Update `kinship/page.tsx` to use `HeritagePageHeader`**
Wrap the page in a warm parchment background, use `HeritagePageHeader` with title "Tra cứu danh xưng", family name, and tree name.

- [ ] **Step 3: Update `components/KinshipFinder.tsx` styling**
Replace plain grey `bg-stone-50` / `border-stone-200` with:
- `HeritageFrame` around person picker and calculation results
- Person A (Jade / Nam/Nữ badge) and Person B (Crimson / Nam/Nữ badge)
- Calligraphic title for relationship description
- Cultural kinship explanation card with traditional parchment border

- [ ] **Step 4: Verify on dev server**
Request `http://localhost:3000/dashboard/test-family/kinship` or verify TypeScript compilation:
Run: `npx.cmd tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit Task 2**
```bash
git add app/dashboard/[familySlug]/kinship/page.tsx components/KinshipFinder.tsx
git commit -m "feat(kinship): redesign kinship page with heritage styling"
```

---

### Task 3: Redesign Stats Page (`/stats`) & FamilyStats

**Files:**
- Modify: `app/dashboard/[familySlug]/stats/page.tsx`
- Modify: `components/FamilyStats.tsx`

**Interfaces:**
- Consumes: `HeritagePageHeader`, `HeritageStatCard`, `HeritageFrame`, `HeritageBadge`.
- Produces: Royal golden overview cards, generation breakdown scrolls, gender balance and zodiac distribution in Heritage styling.

- [ ] **Step 1: Update `stats/page.tsx`**
Add `HeritagePageHeader` ("Bảng Vàng Thống Kê"), pass family and tree context.

- [ ] **Step 2: Update `components/FamilyStats.tsx`**
- Replace plain stat cards with `HeritageStatCard` using antique gold and deep emerald accents.
- Restyle GenerationRow bars with gradient amber/gold (`from-[#caa455] to-[#92540b]`).
- Wrap detailed distribution sections in `HeritageFrame`.

- [ ] **Step 3: Verify TypeScript compilation**
Run: `npx.cmd tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Task 3**
```bash
git add app/dashboard/[familySlug]/stats/page.tsx components/FamilyStats.tsx
git commit -m "feat(stats): redesign family stats page with heritage styling"
```

---

### Task 4: Redesign Events Page (`/events`) & EventsList

**Files:**
- Modify: `app/dashboard/[familySlug]/events/page.tsx`
- Modify: `components/EventsList.tsx`
- Modify: `components/CustomEventModal.tsx`

**Interfaces:**
- Consumes: `HeritagePageHeader`, `HeritageBadge`, `HeritageFrame`, `computeEvents`.
- Produces: Vietnamese traditional lunar anniversary and event cards with crimson kỵ nhật seals, amber birthday badges, and gold-trimmed event creation modal.

- [ ] **Step 1: Update `events/page.tsx`**
Incorporate `HeritagePageHeader` with title "Sự Kiện & Ngày Kỵ Nhật", action slot for "Thêm sự kiện mới" button.

- [ ] **Step 2: Update `components/EventsList.tsx`**
- Style EventCard with traditional badges:
  - Death anniversary (Kỵ nhật): Crimson border `#8c1d1d`, lunar calendar highlighted with lacquer badge.
  - Birthday: Amber / gold accent `#caa455`.
  - Custom clan events: Emerald jade accent `#183b28`.
- Filter pills styled as traditional silk tabs.

- [ ] **Step 3: Update `components/CustomEventModal.tsx`**
Restyle modal container with `HeritageFrame`, gold border, and crimson action buttons.

- [ ] **Step 4: Verify TypeScript compilation**
Run: `npx.cmd tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit Task 4**
```bash
git add app/dashboard/[familySlug]/events/page.tsx components/EventsList.tsx components/CustomEventModal.tsx
git commit -m "feat(events): redesign events list and modal with heritage styling"
```

---

### Task 5: Redesign About Page (`/about`)

**Files:**
- Modify: `app/dashboard/[familySlug]/about/page.tsx`

**Interfaces:**
- Consumes: `HeritagePageHeader`, `HeritageFrame`, `HeritageBadge`, `updateFamilyAction`.
- Produces: Ancestral decree / genealogy certificate layout ("Chứng Thư Dòng Họ"), gold framed input fields, refined privacy status badge.

- [ ] **Step 1: Replace plain background and headers**
Use `HeritagePageHeader` with "Hồ Sơ Dòng Họ", family name, and privacy badge (`HeritageBadge`).

- [ ] **Step 2: Wrap view and edit forms in `HeritageFrame`**
- Lineage details, ancestral origin, address, and description placed inside double-bordered parchment frames.
- Form inputs styled with warm background `#fffdf7`, subtle gold border `#deb887`, focus ring in `#caa455`.
- Primary save button in crimson lacquer (`bg-[#8c1d1d] hover:bg-[#6e1616] text-white`).

- [ ] **Step 3: Verify TypeScript compilation**
Run: `npx.cmd tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Task 5**
```bash
git add app/dashboard/[familySlug]/about/page.tsx
git commit -m "feat(about): redesign family profile page with heritage styling"
```

---

### Task 6: Redesign Blog Page (`/blog`) & BlogAdminPanel

**Files:**
- Modify: `app/dashboard/[familySlug]/blog/page.tsx`
- Modify: `components/BlogAdminPanel.tsx`

**Interfaces:**
- Consumes: `HeritagePageHeader`, `HeritageFrame`, `HeritageBadge`.
- Produces: Royal chronicle / clan internal notices board styling ("Bảng Tin & Chiếu Thư Dòng Tộc").

- [ ] **Step 1: Update `blog/page.tsx`**
Use `HeritagePageHeader` with "Bảng Tin Dòng Tộc", description, and action button for new announcement.

- [ ] **Step 2: Update `components/BlogAdminPanel.tsx`**
- Notice cards styled with warm parchment background, crimson pinned seal for important notices.
- Editor modal and inputs aligned with Heritage aesthetic.

- [ ] **Step 3: Verify TypeScript compilation**
Run: `npx.cmd tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Task 6**
```bash
git add app/dashboard/[familySlug]/blog/page.tsx components/BlogAdminPanel.tsx
git commit -m "feat(blog): redesign family blog and announcements with heritage styling"
```

---

### Task 7: Redesign Admins Page (`/admins`) & FamilyAdminRosterPanel

**Files:**
- Modify: `app/dashboard/[familySlug]/admins/page.tsx`
- Modify: `components/FamilyAdminRosterPanel.tsx`

**Interfaces:**
- Consumes: `HeritagePageHeader`, `HeritageFrame`, `HeritageBadge`.
- Produces: Clan management council roster ("Hội Đồng Quản Trị & Tộc Biểu") with Primary Admin (Tộc trưởng) seal and Assistant Admin badges.

- [ ] **Step 1: Update `admins/page.tsx`**
Incorporate `HeritagePageHeader` with "Người Phụ Trách Dòng Họ", family name badge, and member counter.

- [ ] **Step 2: Update `components/FamilyAdminRosterPanel.tsx`**
- Primary admin card highlighted with crimson seal and gold border.
- Assistant admin rows styled as dignified council list cards.
- Modal for role assignment styled with `HeritageFrame`.

- [ ] **Step 3: Verify TypeScript compilation**
Run: `npx.cmd tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Task 7**
```bash
git add app/dashboard/[familySlug]/admins/page.tsx components/FamilyAdminRosterPanel.tsx
git commit -m "feat(admins): redesign admin roster panel with heritage styling"
```

---

### Task 8: Redesign Members Page (`/members`) & ViewToggle

**Files:**
- Modify: `app/dashboard/[familySlug]/members/page.tsx`
- Modify: `components/ViewToggle.tsx`

**Interfaces:**
- Consumes: `HeritagePageHeader`, `HeritageBadge`, `ViewToggle`, `DashboardViews`.
- Produces: Heritage tree navigation bar, royal view switcher tabs (Danh sách, Phả đồ, Mindmap, Bubble map), and refined tree switcher pill.

- [ ] **Step 1: Update `members/page.tsx`**
Incorporate `HeritagePageHeader` with "Cây Gia Phả", current tree badge, and quick tree switcher button.

- [ ] **Step 2: Update `components/ViewToggle.tsx`**
- Redesign the 4 view mode tabs with Heritage tokens:
  - Active tab: deep crimson `#8c1d1d` or royal jade `#183b28` with gold border.
  - Inactive tabs: warm ivory `#fffdf7` with `#caa455` hover border.

- [ ] **Step 3: Verify TypeScript compilation**
Run: `npx.cmd tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Task 8**
```bash
git add app/dashboard/[familySlug]/members/page.tsx components/ViewToggle.tsx
git commit -m "feat(members): redesign members tree toolbar and view toggle with heritage styling"
```

---

### Task 9: End-to-End Build, Test Suite & Verification

**Files:**
- All modified and created files.

- [ ] **Step 1: Run full test suite**
Run: `npm.cmd test`
Expected: All tests pass cleanly.

- [ ] **Step 2: Run Next.js build verification**
Run: `npm.cmd run build`
Expected: Turbopack/Next.js builds all static and dynamic routes with 0 errors.

- [ ] **Step 3: HTTP Verification on dev server**
Verify that the running dev server serves the pages with 200 OK:
- `/dashboard/[familySlug]/members`
- `/dashboard/[familySlug]/kinship`
- `/dashboard/[familySlug]/stats`
- `/dashboard/[familySlug]/events`
- `/dashboard/[familySlug]/about`
- `/dashboard/[familySlug]/blog`
- `/dashboard/[familySlug]/admins`

- [ ] **Step 4: Final Git Status check and commit**
```bash
git status
```
