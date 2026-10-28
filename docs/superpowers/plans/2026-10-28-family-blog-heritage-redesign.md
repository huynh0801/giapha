# Family Blog Heritage Redesign & Public Reading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nâng cấp bảng tin dòng tộc sang giao diện đọc báo di sản hoàng gia (giống trang tin tức), mở khóa đăng nhiều bài, cho phép tải ảnh bìa, và hỗ trợ chế độ xem công khai để bà con con cháu có link đều đọc được mà không bị chặn.

**Architecture:** 
1. Database RLS Policy Migration cho phép khách/người ngoài đọc bài viết dòng họ khi `is_published = true AND visibility = 'public'`.
2. Server Action `saveBlogPostAction` trong `app/actions/blog.ts` loại bỏ giới hạn 1 bài, hỗ trợ upload ảnh bìa và lưu trường `visibility` cho dòng họ.
3. Component `BlogAdminPanel` cho phép chọn ảnh bìa và chế độ hiển thị cho bài viết dòng họ.
4. Giao diện đọc bài `app/dashboard/[familySlug]/blog/[slug]/page.tsx` và `app/blog/[slug]/page.tsx` đồng bộ giao diện di sản hoàng triều (`HeritageFrame`, `BackgroundDecor`, typography tạp chí, nút chia sẻ link).
5. Middleware cập nhật để cho phép đọc bài viết dòng họ công khai mà không ép chuyển hướng về `/login`.

**Tech Stack:** Next.js 16 (App Router), React 19, Supabase (PostgreSQL + RLS), Tailwind CSS 4, Lucide Icons.

---

### Task 1: Database Migration for Family Blog Public Visibility

**Files:**
- Create: `supabase/migrations/20261028173000_family_blog_public_and_heritage.sql`
- Test: `tests/family-blog-heritage.test.mjs`

- [ ] **Step 1: Write test for database migration and blog policy**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Create migration file with RLS policy update**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 2: Server Actions & BlogAdminPanel Enhancements (Multi-post, Cover Image & Visibility)

**Files:**
- Modify: `app/actions/blog.ts`
- Modify: `components/BlogAdminPanel.tsx`
- Test: `tests/family-blog-heritage.test.mjs`

- [ ] **Step 1: Write test for server action updates and BlogAdminPanel props**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement changes in `app/actions/blog.ts` and `components/BlogAdminPanel.tsx`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 3: Redesign Family Blog Detail Page with Heritage Styling & Share Button

**Files:**
- Modify: `app/dashboard/[familySlug]/blog/[slug]/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `utils/supabase/middleware.ts`
- Test: `tests/family-blog-heritage.test.mjs`

- [ ] **Step 1: Write test verifying heritage UI components, public reading, and middleware access**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Heritage layout in `app/dashboard/[familySlug]/blog/[slug]/page.tsx`, public family post reading in `app/blog/[slug]/page.tsx`, and middleware exemptions**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Run full test suite (`npm test`) to guarantee zero regressions**
- [ ] **Step 6: Commit changes**
