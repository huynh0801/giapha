# Person Life Timeline (Nhật Ký Từng Năm) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai tính năng "Nhật Ký Cuộc Đời & Niên Biểu Từng Năm" (Life Timeline) cho từng thành viên trong gia phả, cho phép chính chủ, con/cháu (viết giùm), hoặc admin thêm, sửa, xóa các mốc năm kèm ảnh kỷ niệm.

**Architecture:** Bảng dữ liệu `person_life_events` quan hệ 1-N với `persons`, RLS bảo vệ; Server Actions xử lý CRUD và revalidation; UI dạng Vertical Timeline phong cách Heritage tích hợp trực tiếp vào hồ sơ thành viên.

**Tech Stack:** Next.js (App Router, Server Actions), Supabase, React 19, TypeScript, Lucide Icons, Node test runner.

---

### Task 1: Database Migration & TypeScript Interface

**Files:**
- Create: `supabase/migrations/20261029160000_person_life_events.sql`
- Modify: `types/index.ts`
- Test: `tests/life-events-db.test.mjs`

- [ ] **Step 1: Viết test kiểm tra migration SQL và types**
- [ ] **Step 2: Chạy test và xác nhận thất bại**
- [ ] **Step 3: Tạo migration SQL và cập nhật types/index.ts**
- [ ] **Step 4: Chạy test và xác nhận vượt qua**
- [ ] **Step 5: Commit**

---

### Task 2: Server Actions (`app/actions/life-events.ts`)

**Files:**
- Create: `app/actions/life-events.ts`
- Test: `tests/life-events-actions.test.mjs`

- [ ] **Step 1: Viết test kiểm tra Server Actions**
- [ ] **Step 2: Chạy test và xác nhận thất bại**
- [ ] **Step 3: Triển khai getPersonLifeEventsAction, savePersonLifeEventAction, deletePersonLifeEventAction**
- [ ] **Step 4: Chạy test và xác nhận vượt qua**
- [ ] **Step 5: Commit**

---

### Task 3: Giao Diện Timeline UI (`PersonLifeTimeline` & `PersonLifeEventModal`)

**Files:**
- Create: `components/dashboard/PersonLifeEventModal.tsx`
- Create: `components/dashboard/PersonLifeTimeline.tsx`
- Test: `tests/life-events-ui.test.mjs`

- [ ] **Step 1: Viết test kiểm tra UI components**
- [ ] **Step 2: Chạy test và xác nhận thất bại**
- [ ] **Step 3: Triển khai Modal và Timeline component**
- [ ] **Step 4: Chạy test và xác nhận vượt qua**
- [ ] **Step 5: Commit**

---

### Task 4: Tích Hợp Vào Hồ Sơ Thành Viên & Dọn Dẹp

**Files:**
- Modify: `components/MemberDetailContent.tsx`
- Modify: `app/dashboard/[familySlug]/members/[id]/page.tsx`
- Modify: `package.json`
- Test: `tests/life-events-integration.test.mjs`

- [ ] **Step 1: Viết test tích hợp**
- [ ] **Step 2: Chạy test và xác nhận thất bại**
- [ ] **Step 3: Thay thế card cũ bằng PersonLifeTimeline**
- [ ] **Step 4: Chạy toàn bộ test suite (`npm test`)**
- [ ] **Step 5: Chạy `npm run build`**
- [ ] **Step 6: Commit**
