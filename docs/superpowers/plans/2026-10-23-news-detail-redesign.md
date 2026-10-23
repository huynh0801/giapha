# News Detail Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the article detail page (`/blog/[slug]`) to apply the traditional Vietnamese heritage master frame aesthetic with sharp double borders, crimson corner flourishes, calligraphy headings, and background decor.

**Architecture:** Transform `app/blog/[slug]/page.tsx` into a Master Frame layout wrapping all article content, with `BackgroundDecor` in the page background and a 3-column related articles grid below matching `/news` card styling.

**Tech Stack:** Next.js 16 (App Router, Server Component), Tailwind CSS, Lucide React, Supabase Server Client.

## Global Constraints
- Strictly adhere to user instruction: "hạn chế tự ý push" — keep commits local.
- Author identity: `--author="huynh0801 <huynh0801@users.noreply.github.com>"`.
- Style constraints: `rounded-none`, double gold borders (`border-2 border-[#caa455]` and `border border-[#deb887]`), 4 crimson corner brackets (`border-[#8c1d1d]`), `"SVN-Studio Brush"` typography for titles.

---

### Task 1: Add automated tests for news detail page styling

**Files:**
- Modify: `tests/landing-page.test.mjs`

- [ ] **Step 1: Add assertions for news detail page traditional styling in `tests/landing-page.test.mjs`**
- [ ] **Step 2: Run test suite to verify tests execute properly**
- [ ] **Step 3: Commit test file changes locally**

---

### Task 2: Redesign `app/blog/[slug]/page.tsx`

**Files:**
- Modify: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Import `BackgroundDecor` and update page wrapper with relative overflow-hidden background**
- [ ] **Step 2: Construct Master Scroll Frame with double borders, corner brackets, and traditional paper background**
- [ ] **Step 3: Implement traditional breadcrumb, calligraphy title, and metadata bar**
- [ ] **Step 4: Style article cover image with double gold borders and drop-cap/article body formatting**
- [ ] **Step 5: Style return button and related articles grid matching `/news` traditional card design**
- [ ] **Step 6: Run `npm test` to verify all tests pass**
- [ ] **Step 7: Verify HTTP 200 on `http://localhost:3000/blog/<slug>`**
- [ ] **Step 8: Commit changes locally**
