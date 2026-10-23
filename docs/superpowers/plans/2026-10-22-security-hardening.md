# Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate all critical security vulnerabilities on giaphadongho.com: remove dangerous admin-creation RPC backdoors, protect private admin contacts from anonymous scraping, disable `/setup` schema leakage in production, and remove hardcoded credentials.

**Architecture:** 
1. Database migration in Supabase to drop backdoor functions (`upsert_default_system_admin`, `upsert_default_admin`) and enforce privacy on `get_family_directory`.
2. Next.js route protection on `/setup` and middleware redirection to prevent schema leaks in production.
3. Automated security regression suite in `tests/` verifying schema integrity, route guard, and credential hygiene.

**Tech Stack:** Next.js 16 (App Router), Supabase SSR & PostgreSQL RLS, Node.js test runner (`node:test`).

## Global Constraints

- Do not break existing genealogy queries, multi-tenant isolation, or existing automated tests.
- Keep all existing comments and documentation intact unless directly related to the vulnerability fixes.
- Follow Next.js 16 and Supabase SSR patterns.

---

### Task 1: Supabase Security Hardening Migration and Schema Cleanup

**Files:**
- Create: `supabase/migrations/20260722120000_security_hardening.sql`
- Modify: `docs/schema.sql`
- Modify: `docs/seed.sql`

- [ ] **Step 1: Create migration file to drop backdoor RPCs and protect directory contacts**
- [ ] **Step 2: Update `docs/schema.sql` to remove backdoor RPCs and update `get_family_directory`**
- [ ] **Step 3: Sanitize `docs/seed.sql` to remove real emails and passwords**
- [ ] **Step 4: Commit changes to `fix/security-hardening`**

---

### Task 2: Production Guard for `/setup` and Database Error Redirection

**Files:**
- Modify: `app/setup/page.tsx`
- Modify: `utils/supabase/middleware.ts`
- Modify: `app/login/page.tsx`

- [ ] **Step 1: Update `app/setup/page.tsx` to return `notFound()` when `process.env.NODE_ENV === "production"`**
- [ ] **Step 2: Update `utils/supabase/middleware.ts` to disable redirection to `/setup` in production**
- [ ] **Step 3: Update `app/login/page.tsx` to prevent redirection to `/setup` in production**
- [ ] **Step 4: Commit changes to `fix/security-hardening`**

---

### Task 3: Security Regression Test Suite

**Files:**
- Create: `tests/security-hardening.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write comprehensive security regression tests**
- [ ] **Step 2: Add test script to `package.json`**
- [ ] **Step 3: Run security tests and verify they pass**
- [ ] **Step 4: Commit changes to `fix/security-hardening`**

---

### Task 4: Full Verification and Build Check

**Files:**
- Check: All files in workspace

- [ ] **Step 1: Run complete test suite (`npm test`)**
- [ ] **Step 2: Run Next.js production build (`npm run build`)**
- [ ] **Step 3: Review git status and git diff**
