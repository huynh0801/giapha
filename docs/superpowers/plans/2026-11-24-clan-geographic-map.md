# Clan Geographic Map ("Bản đồ dòng họ") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the Vietnam SVG Choropleth Map ("Bản đồ dòng họ") from `family-tree-v3` into `giaphadongho`, showing clan geographic member distribution and top provinces ranking on the family dashboard.

**Architecture:** Pure vector SVG map rendering with zero external map API dependencies, client-side interactive tooltips and selection, combined with server-side aggregated province count caching via Next.js `unstable_cache`.

**Tech Stack:** Next.js 15 (App Router, Server Components + Client Components), React 19, TypeScript, Tailwind CSS, Lucide React icons, Vitest/Node test runner.

## Global Constraints

- Pure SVG paths without any third-party tile server or external map API keys.
- Preserve proper Vietnamese diacritics and correct boundaries including Hoàng Sa and Trường Sa.
- Preserve multi-tenant security: only aggregated counts are exposed, never private phone numbers or individual sensitive details.
- 100% test pass rate with 0 TypeScript compilation errors.

---

### Task 1: Map Paths and Address Normalizer

**Files:**
- Create: `utils/map/vnMapPaths.ts`
- Create: `tests/clan-map.test.mjs`

**Interfaces:**
- Produces:
  ```typescript
  export interface VnMapProvince {
    code: string;
    name: string;
    d: string;
    cx: number;
    cy: number;
  }
  export const VN_MAP_VIEWBOX: string;
  export const VN_MAP_PROVINCES: VnMapProvince[];
  export function normalizeProvince(addressOrName: string | null | undefined): string | null;
  export function getProvinceCounts(residences: Array<string | null | undefined>): Record<string, number>;
  export function getTopProvinces(counts: Record<string, number>, limit?: number): Array<{ code: string; name: string; count: number }>;
  ```

- [ ] **Step 1: Write test for province normalization and path definitions**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `utils/map/vnMapPaths.ts`**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 2: Build ProvinceMap and ClanMapCard Components

**Files:**
- Create: `components/dashboard/ProvinceMap.tsx`
- Create: `components/dashboard/ClanMapCard.tsx`

**Interfaces:**
- Consumes: `VN_MAP_PROVINCES`, `VN_MAP_VIEWBOX`, `getTopProvinces` from `utils/map/vnMapPaths`
- Produces:
  ```typescript
  export function ProvinceMap(props: {
    counts: Record<string, number>;
    selected: string | null;
    onSelect: (code: string | null) => void;
    unit?: string;
    className?: string;
  }): React.ReactElement;

  export interface ClanMapCardProps {
    counts: Record<string, number>;
    totalMapped?: number;
    familySlug?: string;
  }
  export function ClanMapCard(props: ClanMapCardProps): React.ReactElement;
  ```

- [ ] **Step 1: Write component rendering tests in `tests/clan-map.test.mjs`**
- [ ] **Step 2: Implement `components/dashboard/ProvinceMap.tsx`**
- [ ] **Step 3: Implement `components/dashboard/ClanMapCard.tsx`**
- [ ] **Step 4: Run test and verify component exports and behavior**

---

### Task 3: Data Aggregation & Family Dashboard Integration

**Files:**
- Modify: `utils/supabase/queries.ts`
- Modify: `app/dashboard/[familySlug]/page.tsx`

**Interfaces:**
- Produces: `getCachedClanMapStats(familyId: string, treeId: string): Promise<{ counts: Record<string, number>; totalMapped: number }>` in `utils/supabase/queries.ts`
- Consumes: `<ClanMapCard counts={mapStats.counts} totalMapped={mapStats.totalMapped} familySlug={familySlug} />` in `app/dashboard/[familySlug]/page.tsx`

- [ ] **Step 1: Add `getCachedClanMapStats` in `utils/supabase/queries.ts`**
- [ ] **Step 2: Connect `ClanMapCard` to `app/dashboard/[familySlug]/page.tsx`**
- [ ] **Step 3: Run full test suite and TypeScript verification**
