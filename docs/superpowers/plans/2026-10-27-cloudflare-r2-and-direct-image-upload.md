# Chuyển Đổi Upload Ảnh Sang Cloudflare R2 & Bỏ Nhập URL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển đổi toàn bộ cơ chế lưu trữ media từ Supabase Storage sang Cloudflare R2 (kèm fallback tự động sang Supabase nếu chưa cấu hình R2) và loại bỏ hoàn toàn các ô nhập link URL ảnh, thay bằng component Upload file trực tiếp (Huy hiệu/Logo dòng họ, Avatar, Tin tức).

**Architecture:** Cài đặt `@aws-sdk/client-s3` và xây dựng `utils/storage/index.ts` làm adapter trung tâm. Adapter tự động nén WebP bằng `sharp` và ưu tiên gửi lên Cloudflare R2 qua S3 API. Xây dựng component `components/ImageUploadField.tsx` tái sử dụng cho các biểu mẫu. Cập nhật các Server Actions liên quan trong `app/actions/`.

**Tech Stack:** Next.js 15, React 19, Cloudflare R2, `@aws-sdk/client-s3`, `sharp`, TypeScript, Supabase DB/Storage fallback.

## Global Constraints

- Không làm gián đoạn các ảnh cũ đang lưu trữ trên hệ thống (tương thích ngược hoàn toàn).
- Ảnh upload luôn được tối ưu hóa sang WebP và giới hạn kích thước hợp lý.
- Khi chưa cấu hình biến môi trường Cloudflare R2, hệ thống tự động fallback về Supabase Storage mà không báo lỗi.
- Đảm bảo toàn bộ test suites hiện có (`npm test`) tiếp tục pass 100%.

---

### Task 1: Cài đặt `@aws-sdk/client-s3` & Xây dựng Unified Storage Adapter

**Files:**
- Modify: `package.json`
- Create: `utils/storage/index.ts`
- Create: `tests/storage-adapter.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export function isR2Configured(): boolean;
  export async function uploadStorageImage(options: {
    file: File | { name: string; type: string; arrayBuffer: () => Promise<ArrayBuffer> } | Buffer;
    folder: string;
    fileNamePrefix?: string;
    maxDimension?: number;
    quality?: number;
    bucketFallback?: string;
  }): Promise<{ success: boolean; publicUrl?: string; filePath?: string; error?: string }>;
  export async function deleteStorageImage(options: {
    filePath: string;
    bucketFallback?: string;
  }): Promise<{ success: boolean; error?: string }>;
  ```

- [ ] **Step 1: Install `@aws-sdk/client-s3`**

Run: `npm install @aws-sdk/client-s3`

- [ ] **Step 2: Write unit test for Storage Adapter**

Create `tests/storage-adapter.test.ts`:
```typescript
import test from "node:test";
import assert from "node:assert/strict";
import { isR2Configured } from "../utils/storage/index";

test("isR2Configured returns false when environment variables are not set", () => {
  const oldEnv = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  delete process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  assert.equal(isR2Configured(), false);
  if (oldEnv) process.env.CLOUDFLARE_R2_ACCOUNT_ID = oldEnv;
});

test("isR2Configured returns true when all R2 environment variables are present", () => {
  const originalEnv = { ...process.env };
  process.env.CLOUDFLARE_R2_ACCOUNT_ID = "acc-123";
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key-123";
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "sec-123";
  process.env.CLOUDFLARE_R2_BUCKET_NAME = "giaphadongho";
  process.env.CLOUDFLARE_R2_PUBLIC_URL = "https://pub-test.r2.dev";

  assert.equal(isR2Configured(), true);

  // Restore env
  process.env = originalEnv;
});
```

- [ ] **Step 3: Implement `utils/storage/index.ts`**

Create `utils/storage/index.ts`:
```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { optimizeAvatarImage } from "@/utils/imageOptimization";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import sharp from "sharp";

export function isR2Configured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET_NAME &&
    process.env.CLOUDFLARE_R2_PUBLIC_URL
  );
}

let s3ClientInstance: S3Client | null = null;
function getR2Client(): S3Client {
  if (!s3ClientInstance) {
    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
      },
    });
  }
  return s3ClientInstance;
}

export interface UploadStorageOptions {
  file: File | { name: string; type: string; arrayBuffer: () => Promise<ArrayBuffer> } | Buffer;
  folder: string;
  fileNamePrefix?: string;
  maxDimension?: number;
  quality?: number;
  bucketFallback?: string;
}

export interface StorageResult {
  success: boolean;
  publicUrl?: string;
  filePath?: string;
  error?: string;
}

export async function uploadStorageImage(options: UploadStorageOptions): Promise<StorageResult> {
  try {
    const {
      file,
      folder,
      fileNamePrefix = "img",
      maxDimension = 1200,
      quality = 82,
      bucketFallback = "avatars",
    } = options;

    let buffer: Buffer;
    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    if (!buffer || buffer.length === 0) {
      return { success: false, error: "Tệp tin ảnh rỗng hoặc không hợp lệ." };
    }

    // Nén và chuyển đổi sang WebP bằng sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: maxDimension,
        height: maxDimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();

    const fileName = `${fileNamePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
    const filePath = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;

    if (isR2Configured()) {
      const s3 = getR2Client();
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
      const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL!.replace(/\/+$/, "");

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: filePath,
          Body: optimizedBuffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );

      return {
        success: true,
        publicUrl: `${publicBaseUrl}/${filePath}`,
        filePath,
      };
    }

    // Fallback: Supabase Storage
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error: uploadError } = await supabase.storage
      .from(bucketFallback)
      .upload(filePath, optimizedBuffer, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage fallback error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketFallback).getPublicUrl(filePath);

    return {
      success: true,
      publicUrl,
      filePath,
    };
  } catch (error) {
    console.error("Storage upload exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải ảnh lên kho lưu trữ.",
    };
  }
}

export async function deleteStorageImage(options: {
  filePath: string;
  bucketFallback?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { filePath, bucketFallback = "avatars" } = options;
    if (!filePath) return { success: true };

    if (isR2Configured()) {
      const s3 = getR2Client();
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
          Key: filePath,
        })
      );
      return { success: true };
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.storage.from(bucketFallback).remove([filePath]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khi xóa ảnh.",
    };
  }
}
```

- [ ] **Step 4: Run unit test to verify**

Run: `node --import tsx --test tests/storage-adapter.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json utils/storage/index.ts tests/storage-adapter.test.ts
git commit -m "feat: add unified storage adapter supporting cloudflare r2 and supabase fallback"
```

---

### Task 2: Cập Nhật Mẫu Biến Môi Trường `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add R2 environment variables to `.env.example`**

Update `.env.example` to include:
```env
# Cloudflare R2 Storage (Tùy chọn - Tối ưu chi phí & Miễn phí băng thông tải ảnh)
CLOUDFLARE_R2_ACCOUNT_ID="your-cloudflare-account-id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-r2-access-key-id"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
CLOUDFLARE_R2_BUCKET_NAME="giaphadongho"
CLOUDFLARE_R2_PUBLIC_URL="https://pub-xxxxxx.r2.dev"
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add cloudflare r2 environment variables to .env.example"
```

---

### Task 3: Xây Dựng Component `ImageUploadField.tsx`

**Files:**
- Create: `components/ImageUploadField.tsx`

**Interfaces:**
- Produces:
  ```tsx
  export default function ImageUploadField(props: {
    name: string;
    removeName?: string;
    label?: string;
    currentImageUrl?: string | null;
    shape?: "shield" | "circle" | "banner";
    maxSizeMb?: number;
    helperText?: string;
  }): JSX.Element
  ```

- [ ] **Step 1: Create `components/ImageUploadField.tsx`**

Implement component with image preview, file picker button, remove button, hidden remove input, and error handling for oversized files.

- [ ] **Step 2: Verify component with TypeScript build**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add components/ImageUploadField.tsx
git commit -m "feat: create reusable ImageUploadField component"
```

---

### Task 4: Chuyển Đổi Logo Dòng Họ Sang Upload File Ở Trang About

**Files:**
- Modify: `app/dashboard/[familySlug]/about/page.tsx`
- Modify: `app/actions/family.ts`

- [ ] **Step 1: Update `app/actions/family.ts` (`updateFamilyAction`)**

In `updateFamilyAction`:
1. Check for `formData.get("logo_file") as File | null`.
2. Check for `formData.get("remove_logo") === "1"`.
3. If new `logo_file` provided and size > 0:
   - Call `uploadStorageImage({ file: logoFile, folder: `families/logos/${familyId}`, bucketFallback: "avatars", maxDimension: 800 })`.
   - Update `logo_url` in `families` table.
4. If `remove_logo === "1"` and no new file:
   - Set `logo_url = null`.
5. Keep existing `logo_url` if no new file and not removed.

- [ ] **Step 2: Update `app/dashboard/[familySlug]/about/page.tsx`**

1. Replace text `<input name="logo_url" />` with `<ImageUploadField name="logo_file" removeName="remove_logo" label="Huy hiệu / Logo dòng họ" currentImageUrl={family.logo_url} shape="shield" />`.
2. Ensure `<form encType="multipart/form-data">` is supported.

- [ ] **Step 3: Run test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/[familySlug]/about/page.tsx app/actions/family.ts
git commit -m "feat: switch family logo in about page from url text to file upload"
```

---

### Task 5: Bổ Sung Upload Logo Vào Form Tạo Dòng Họ Mới

**Files:**
- Modify: `components/AdminFamilyCreateForm.tsx`
- Modify: `app/actions/family.ts`

- [ ] **Step 1: Update `AdminFamilyCreateForm.tsx`**

1. Add `ImageUploadField` for optional logo upload (`name="logo_file"`).
2. Reset preview when form successfully submits.

- [ ] **Step 2: Update `createFamilyAction` in `app/actions/family.ts`**

1. Read `logo_file` from `formData`.
2. If provided, upload logo via `uploadStorageImage({ file: logoFile, folder: "families/logos", maxDimension: 800, bucketFallback: "avatars" })`.
3. Pass `logo_url` into family creation or update family record after RPC creation.

- [ ] **Step 3: Run test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/AdminFamilyCreateForm.tsx app/actions/family.ts
git commit -m "feat: add optional family logo upload to AdminFamilyCreateForm"
```

---

### Task 6: Tích Hợp Storage Adapter Vào Avatar & Blog Actions

**Files:**
- Modify: `app/actions/storage.ts`
- Modify: `app/actions/blog.ts`

- [ ] **Step 1: Update `app/actions/storage.ts`**

Use `uploadStorageImage` and `deleteStorageImage` inside `uploadAvatarAction` and `deleteAvatarAction`.

- [ ] **Step 2: Update `app/actions/blog.ts`**

Use `uploadStorageImage` and `deleteStorageImage` in `saveScopedBlogPost`, `uploadBlogInlineImage`, and `uploadFamilyBlogInlineImage`.

- [ ] **Step 3: Run test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/actions/storage.ts app/actions/blog.ts
git commit -m "feat: migrate avatar and blog storage actions to unified storage adapter"
```

---

### Task 7: Toàn Bộ Verification & E2E Testing

**Files:**
- Modify: `package.json`
- Test: Run full suite with `npm test`

- [ ] **Step 1: Add `tests/storage-adapter.test.ts` to `package.json` test script**
- [ ] **Step 2: Run all tests**

Run: `npm test`
Expected: All suites pass without errors.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "test: verify all tests pass with unified storage adapter"
```
