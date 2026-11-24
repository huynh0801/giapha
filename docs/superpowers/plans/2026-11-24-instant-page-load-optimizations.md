# Implementation Plan - Instant Page Load Optimizations

Optimize page load speeds across `giaphadongho` to achieve near-instantaneous load times (< 50ms - 100ms perceived latency) by combining Edge CDN caching (ISR), React 19 streaming skeletons, and client-side persistent IndexedDB caching.

## Objectives
1. **Homepage & Public Pages:** Edge cached (ISR `revalidate = 120`), eliminating cold starts and database hits for visitors (TTFB drops from ~1.5s to ~25ms).
2. **Dashboard & Family Space:** Instant App Shell with streaming `<Suspense>` / `loading.tsx` so users never see a white screen or frozen click.
3. **Genealogy Tree & Members Data:** Persistent client cache via native IndexedDB (`genealogy-idb.ts`) so revisit and tab switching load in 0ms directly from device memory.
4. **Link Prefetching:** Critical navigation preloaded on hover/viewport.

## Proposed Changes

### 1. Landing Page ISR Optimization
- **File:** `app/page.tsx`
  - Remove `export const dynamic = "force-dynamic"`.
  - Add `export const revalidate = 120;`.
  - Let `LandingHeader` handle client-side auth hydration (it already has `getCurrentUserAction()` built-in).

### 2. Heritage Streaming Loading Skeleton
- **File:** `app/dashboard/[familySlug]/loading.tsx`
  - Create a dedicated Heritage loading skeleton matching the dashboard/members layout with golden/crimson decorative borders, breadcrumbs, and card skeletons.
  - Next.js will stream this in < 30ms on route change.

### 3. Persistent Client Cache via IndexedDB
- **File:** `utils/cache/genealogy-idb.ts`
  - Implement a zero-dependency, ultra-fast browser IndexedDB cache helper for family data (`persons`, `relationships`, `trees`).
  - Cache entries keyed by `family_id` and `tree_id` with timestamps.
  - Implement `getCachedTreeData()`, `setCachedTreeData()`, and `clearCachedTreeData()`.
- **File:** `components/DashboardContext.tsx`
  - Integrate IndexedDB persistence so when switching between views (Tree, Members, Mindmap, Bubble), the UI updates in 0ms without re-fetching.

### 4. Link Prefetching & Route Acceleration
- **File:** `components/dashboard/HeritagePageHeader.tsx` & `components/landing/LandingHeader.tsx`
  - Ensure all primary navigation links have explicit `prefetch={true}`.

### 5. Automated Verification
- **File:** `tests/instant-load-optimizations.test.mjs`
  - Verify `app/page.tsx` uses ISR (`revalidate`).
  - Verify `app/dashboard/[familySlug]/loading.tsx` exists and renders heritage skeleton.
  - Verify `genealogy-idb.ts` correctly handles cache get/set/clear.
  - Run full test suite (`npm test`).
