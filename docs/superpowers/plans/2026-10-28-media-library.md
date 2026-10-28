# Kế Hoạch Triển Khai: Thư Viện Ảnh (Media Library) Cho Dòng Họ & Quản Trị Hệ Thống

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng tính năng Thư viện ảnh (Media Library) trực quan, cho phép quản lý toàn bộ kho ảnh Cloudflare R2 / Supabase Storage cả trong phạm vi từng dòng họ (`/dashboard/[familySlug]/media`) và phạm vi toàn hệ thống (`/admin/media`).

**Architecture:** Bổ sung `listStorageFiles` vào `utils/storage/index.ts` bằng `ListObjectsV2Command` của AWS S3 SDK; cung cấp Server Actions `listMediaAction` và `deleteMediaAction` trong `app/actions/storage.ts`; xây dựng component React `MediaLibrary.tsx` hỗ trợ lưới ảnh, Lightbox, sao chép URL và xóa an toàn; tích hợp vào các trang và điều hướng breadcrumb.

**Tech Stack:** Next.js 16 (App Router, Server Actions, Turbopack), AWS SDK S3 Client (`@aws-sdk/client-s3`), Supabase SSR, Lucide React, Tailwind CSS.

## Global Constraints
- Bảo toàn đầy đủ 83 bài test hiện có (`npm test`).
- Tuyệt đối tuân thủ bảo mật đa khách hàng (multi-tenant): dòng họ này không được xem hoặc xóa ảnh của dòng họ khác.
- Đảm bảo tương thích ngược: khi không cấu hình R2 thì tự động fallback về Supabase Storage.

---

### Task 1: Bổ sung `listStorageFiles` vào `utils/storage/index.ts`

**Files:**
- Modify: `utils/storage/index.ts`
- Test: `tests/media-library.test.ts`

- [ ] **Step 1: Viết bài test kiểm tra `listStorageFiles`**

Tạo file `tests/media-library.test.ts`:
```typescript
import test from "node:test";
import assert from "node:assert/strict";
import {
  listStorageFiles,
  setR2ClientInstance,
  resetR2ClientInstance,
} from "../utils/storage/index";

test("listStorageFiles falls back to empty or Supabase storage when R2 is not configured", async () => {
  const originalEnv = { ...process.env };
  delete process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  delete process.env.CLOUDFLARE_R2_BUCKET_NAME;

  const result = await listStorageFiles({ folder: "test-folder" });
  assert.equal(typeof result.success, "boolean");
  assert.ok(Array.isArray(result.files));

  process.env = originalEnv;
});

test("listStorageFiles uses R2 ListObjectsV2Command when R2 is configured", async () => {
  const originalEnv = { ...process.env };
  process.env.CLOUDFLARE_R2_ACCOUNT_ID = "acc-test";
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key-test";
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "sec-test";
  process.env.CLOUDFLARE_R2_BUCKET_NAME = "test-bucket";
  process.env.CLOUDFLARE_R2_PUBLIC_URL = "https://pub-test.r2.dev";

  const fakeSend = async (command: any) => {
    return {
      Contents: [
        {
          Key: "family-1/avatar-123.webp",
          Size: 102400,
          LastModified: new Date("2026-10-28T00:00:00Z"),
        },
      ],
      NextContinuationToken: "next-token-123",
      IsTruncated: true,
    };
  };

  setR2ClientInstance({ send: fakeSend } as any);

  const result = await listStorageFiles({ folder: "family-1" });
  assert.equal(result.success, true);
  assert.equal(result.files.length, 1);
  assert.equal(result.files[0].key, "family-1/avatar-123.webp");
  assert.equal(result.files[0].name, "avatar-123.webp");
  assert.equal(result.files[0].url, "https://pub-test.r2.dev/family-1/avatar-123.webp");
  assert.equal(result.files[0].size, 102400);
  assert.equal(result.nextContinuationToken, "next-token-123");
  assert.equal(result.isTruncated, true);

  resetR2ClientInstance();
  process.env = originalEnv;
});
```

- [ ] **Step 2: Chạy test xác nhận thất bại (Red)**

Run: `node --import tsx --test tests/media-library.test.ts`
Expected: FAIL do hàm `listStorageFiles` chưa được định nghĩa.

- [ ] **Step 3: Triển khai hàm `listStorageFiles` trong `utils/storage/index.ts`**

Import thêm `ListObjectsV2Command` từ `@aws-sdk/client-s3`.
Định nghĩa:
```typescript
export interface StorageFileItem {
  key: string;
  name: string;
  url: string;
  size: number;
  lastModified?: string;
  folder: string;
}

export interface ListStorageOptions {
  folder?: string;
  maxKeys?: number;
  continuationToken?: string;
  bucketFallback?: string;
}

export interface ListStorageResult {
  success: boolean;
  files: StorageFileItem[];
  nextContinuationToken?: string;
  isTruncated: boolean;
  error?: string;
}

export async function listStorageFiles(options: ListStorageOptions = {}): Promise<ListStorageResult> {
  try {
    const {
      folder = "",
      maxKeys = 100,
      continuationToken,
      bucketFallback = "avatars",
    } = options;

    const cleanFolder = (folder || "").replace(/^\/+|\/+$/g, "");

    if (isR2Configured()) {
      const s3 = getR2Client();
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
      const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL!.replace(/\/+$/, "");

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: cleanFolder ? `${cleanFolder}/` : undefined,
        MaxKeys: maxKeys,
        ContinuationToken: continuationToken,
      });

      const response = await s3.send(command);
      const contents = response.Contents || [];

      const files: StorageFileItem[] = contents
        .filter((item) => item.Key && !item.Key.endsWith("/"))
        .map((item) => {
          const key = item.Key!;
          const parts = key.split("/");
          const name = parts[parts.length - 1];
          const fileFolder = parts.length > 1 ? parts.slice(0, -1).join("/") : "";
          return {
            key,
            name,
            url: `${publicBaseUrl}/${key}`,
            size: item.Size || 0,
            lastModified: item.LastModified?.toISOString(),
            folder: fileFolder,
          };
        });

      return {
        success: true,
        files,
        nextContinuationToken: response.NextContinuationToken,
        isTruncated: Boolean(response.IsTruncated),
      };
    }

    // Fallback: Supabase Storage
    let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;
    try {
      cookieStore = await cookies();
    } catch {
      // outside request context
    }

    const supabase = cookieStore ? createClient(cookieStore) : createPublicClient();
    if (!supabase) {
      return { success: true, files: [], isTruncated: false };
    }

    const { data, error } = await supabase.storage
      .from(bucketFallback)
      .list(cleanFolder || undefined, {
        limit: maxKeys,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return { success: false, files: [], isTruncated: false, error: error.message };
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const cleanSupabaseUrl = supabaseUrl.replace(/\/+$/, "");
    const publicBase = `${cleanSupabaseUrl}/storage/v1/object/public/${bucketFallback}`;

    const files: StorageFileItem[] = (data || [])
      .filter((item) => item.name && item.id)
      .map((item) => {
        const key = cleanFolder ? `${cleanFolder}/${item.name}` : item.name;
        return {
          key,
          name: item.name,
          url: `${publicBase}/${key}`,
          size: (item.metadata as any)?.size || 0,
          lastModified: item.updated_at || item.created_at,
          folder: cleanFolder,
        };
      });

    return {
      success: true,
      files,
      isTruncated: false,
    };
  } catch (err) {
    console.error("List storage files error:", err);
    return {
      success: false,
      files: [],
      isTruncated: false,
      error: err instanceof Error ? err.message : "Không thể lấy danh sách tệp tin.",
    };
  }
}
```

- [ ] **Step 4: Chạy test xác nhận vượt qua (Green)**

Run: `node --import tsx --test tests/media-library.test.ts`
Expected: PASS cả 2 bài test.

- [ ] **Step 5: Commit**

```bash
git add utils/storage/index.ts tests/media-library.test.ts
git commit -m "feat(storage): implement listStorageFiles with R2 S3 and Supabase fallback"
```

---

### Task 2: Xây dựng Server Actions `listMediaAction` và `deleteMediaAction`

**Files:**
- Modify: `app/actions/storage.ts`
- Test: `tests/media-library.test.ts`

- [ ] **Step 1: Viết test cho `listMediaAction` và `deleteMediaAction`**

Bổ sung vào `tests/media-library.test.ts`:
```typescript
test("app/actions/storage exports listMediaAction and deleteMediaAction with auth guards", async () => {
  const fs = await import("node:fs");
  const content = fs.readFileSync("app/actions/storage.ts", "utf-8");
  assert.match(content, /export async function listMediaAction/);
  assert.match(content, /export async function deleteMediaAction/);
  assert.match(content, /getAccessibleFamilies/);
  assert.match(content, /getIsSystemAdmin/);
});
```

- [ ] **Step 2: Chạy test xác nhận thất bại (Red)**

Run: `node --import tsx --test tests/media-library.test.ts`
Expected: FAIL vì 2 hàm chưa có trong `app/actions/storage.ts`.

- [ ] **Step 3: Triển khai các Server Actions trong `app/actions/storage.ts`**

Import `listStorageFiles` từ `@/utils/storage/index`, `getAccessibleFamilies`, `getIsSystemAdmin`, `getUser` từ `@/utils/supabase/queries`.
Viết `listMediaAction(familySlug?: string, continuationToken?: string)`:
- Kiểm tra auth.
- Nếu có `familySlug`: Tìm family theo slug, kiểm tra người dùng có quyền trong family đó, lấy file với `folder: family.id`.
- Nếu không có `familySlug`: Kiểm tra `isSystemAdmin`, nếu đúng thì lấy toàn bộ file (`folder: ""`).
Viết `deleteMediaAction(filePath: string, familySlug?: string)`:
- Kiểm tra auth và quyền xóa đối với `filePath`.
- Gọi `deleteStorageImage(filePath)`.

- [ ] **Step 4: Chạy test xác nhận vượt qua (Green)**

Run: `node --import tsx --test tests/media-library.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/actions/storage.ts tests/media-library.test.ts
git commit -m "feat(actions): add listMediaAction and deleteMediaAction with multi-tenant auth"
```

---

### Task 3: Xây dựng Component Giao Diện `components/MediaLibrary.tsx`

**Files:**
- Create: `components/MediaLibrary.tsx`
- Test: `tests/media-library.test.ts`

- [ ] **Step 1: Viết test kiểm tra component `MediaLibrary`**

Bổ sung vào `tests/media-library.test.ts`:
```typescript
test("MediaLibrary component is exported and contains core UI elements", async () => {
  const fs = await import("node:fs");
  const content = fs.readFileSync("components/MediaLibrary.tsx", "utf-8");
  assert.match(content, /export default function MediaLibrary/);
  assert.match(content, /Sao chép liên kết/);
  assert.match(content, /Xóa ảnh/);
  assert.match(content, /Tải ảnh mới/);
});
```

- [ ] **Step 2: Chạy test xác nhận thất bại (Red)**

Run: `node --import tsx --test tests/media-library.test.ts`
Expected: FAIL do chưa tạo file `components/MediaLibrary.tsx`.

- [ ] **Step 3: Tạo component `components/MediaLibrary.tsx`**

Bao gồm:
- Client component (`"use client"`).
- Props: `familySlug?: string`, `canManage?: boolean`, `initialFiles?: StorageFileItem[]`.
- State quản lý: danh sách ảnh, trạng thái loading, lightbox file đang chọn, trạng thái copy URL, upload file mới.
- Thiết kế đậm chất gia phả truyền thống (tông màu hoàng gia `#f5e7c7`, viền `#deb887`, điểm xuyết đỏ thắm `#8c1d1d`).

- [ ] **Step 4: Chạy test xác nhận vượt qua (Green)**

Run: `node --import tsx --test tests/media-library.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/MediaLibrary.tsx tests/media-library.test.ts
git commit -m "feat(ui): implement responsive MediaLibrary component with lightbox and direct upload"
```

---

### Task 4: Tạo các trang Media Library và cập nhật Navigation

**Files:**
- Create: `app/dashboard/[familySlug]/media/page.tsx`
- Create: `app/admin/media/page.tsx`
- Modify: `components/WorkspaceBreadcrumb.tsx`
- Modify: `app/dashboard/[familySlug]/page.tsx`
- Modify: `app/admin/page.tsx`
- Test: `tests/media-library.test.ts`

- [ ] **Step 1: Viết test kiểm tra các trang và điều hướng**

Bổ sung vào `tests/media-library.test.ts`:
```typescript
test("pages and navigation links integrate media library", async () => {
  const fs = await import("node:fs");
  assert.ok(fs.existsSync("app/dashboard/[familySlug]/media/page.tsx"));
  assert.ok(fs.existsSync("app/admin/media/page.tsx"));

  const breadcrumb = fs.readFileSync("components/WorkspaceBreadcrumb.tsx", "utf-8");
  assert.match(breadcrumb, /media:\s*\{\s*label:\s*["']Thư viện ảnh["']/);

  const familyDash = fs.readFileSync("app/dashboard/[familySlug]/page.tsx", "utf-8");
  assert.match(familyDash, /Thư viện ảnh/);
});
```

- [ ] **Step 2: Chạy test xác nhận thất bại (Red)**

Run: `node --import tsx --test tests/media-library.test.ts`
Expected: FAIL.

- [ ] **Step 3: Tạo `app/dashboard/[familySlug]/media/page.tsx` và `app/admin/media/page.tsx`, cập nhật Breadcrumb & Dashboard**

- [ ] **Step 4: Chạy test xác nhận vượt qua (Green)**

Run: `node --import tsx --test tests/media-library.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/dashboard/[familySlug]/media/page.tsx app/admin/media/page.tsx components/WorkspaceBreadcrumb.tsx app/dashboard/[familySlug]/page.tsx app/admin/page.tsx tests/media-library.test.ts
git commit -m "feat: integrate media library into family workspace and admin portal"
```

---

### Task 5: Kiểm thử toàn bộ hệ thống (`npm test`)

**Files:**
- Modify: `package.json`
- Test: Full test suite

- [ ] **Step 1: Thêm `tests/media-library.test.ts` vào script `test` trong `package.json`**
- [ ] **Step 2: Chạy `npm test` toàn hệ thống**
- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "test: add media library suite to npm test"
```
