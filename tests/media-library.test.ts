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

  const fakeSend = async (_command: any) => {
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
