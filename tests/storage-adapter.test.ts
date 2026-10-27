import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  isR2Configured,
  uploadStorageImage,
  deleteStorageImage,
  extractStoragePath,
  setR2ClientInstance,
  resetR2ClientInstance,
} from "../utils/storage/index";

test("isR2Configured returns false when environment variables are not set", () => {
  const originalEnv = { ...process.env };
  delete process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  delete process.env.CLOUDFLARE_R2_BUCKET_NAME;
  delete process.env.CLOUDFLARE_R2_PUBLIC_URL;

  assert.equal(isR2Configured(), false);
  process.env = originalEnv;
});

test("isR2Configured returns true when all R2 environment variables are present", () => {
  const originalEnv = { ...process.env };
  process.env.CLOUDFLARE_R2_ACCOUNT_ID = "acc-123";
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key-123";
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "sec-123";
  process.env.CLOUDFLARE_R2_BUCKET_NAME = "giaphadongho";
  process.env.CLOUDFLARE_R2_PUBLIC_URL = "https://pub-test.r2.dev";

  assert.equal(isR2Configured(), true);
  process.env = originalEnv;
});

test("isR2Configured returns false when any single R2 environment variable is missing", () => {
  const originalEnv = { ...process.env };
  const keys = [
    "CLOUDFLARE_R2_ACCOUNT_ID",
    "CLOUDFLARE_R2_ACCESS_KEY_ID",
    "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
    "CLOUDFLARE_R2_BUCKET_NAME",
    "CLOUDFLARE_R2_PUBLIC_URL",
  ];

  keys.forEach((key) => {
    process.env = { ...originalEnv };
    keys.forEach((k) => {
      process.env[k] = "test-value";
    });
    delete process.env[key];
    assert.equal(isR2Configured(), false, `Should be false when ${key} is missing`);
  });

  process.env = originalEnv;
});

test("extractStoragePath extracts key correctly from URLs and paths", () => {
  const originalEnv = { ...process.env };
  process.env.CLOUDFLARE_R2_PUBLIC_URL = "https://pub-test.r2.dev";

  assert.equal(extractStoragePath(""), "");
  assert.equal(extractStoragePath("avatars/user-123.webp"), "avatars/user-123.webp");
  assert.equal(extractStoragePath("/avatars/user-123.webp"), "avatars/user-123.webp");
  assert.equal(
    extractStoragePath("https://pub-test.r2.dev/avatars/user-123.webp"),
    "avatars/user-123.webp"
  );
  assert.equal(
    extractStoragePath("https://test.supabase.co/storage/v1/object/public/avatars/user-123.webp", "avatars"),
    "user-123.webp"
  );

  process.env = originalEnv;
});

test("uploadStorageImage returns error on empty or invalid file", async () => {
  const result1 = await uploadStorageImage({
    file: Buffer.from([]),
    folder: "test",
  });
  assert.equal(result1.success, false);
  assert.match(result1.error || "", /rỗng/i);

  const result2 = await uploadStorageImage({
    file: null as any,
    folder: "test",
  });
  assert.equal(result2.success, false);
});

test("uploadStorageImage uploads to R2 when configured and compresses to webp", async () => {
  const originalEnv = { ...process.env };
  process.env.CLOUDFLARE_R2_ACCOUNT_ID = "acc-123";
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key-123";
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "sec-123";
  process.env.CLOUDFLARE_R2_BUCKET_NAME = "giaphadongho";
  process.env.CLOUDFLARE_R2_PUBLIC_URL = "https://pub-test.r2.dev";

  // Create real test image buffer using sharp
  const testImageBuffer = await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 3,
      background: { r: 255, g: 0, b: 0 },
    },
  })
    .png()
    .toBuffer();

  let sentCommand: any = null;
  const mockS3Client = {
    send: async (command: any) => {
      sentCommand = command;
      return {};
    },
  };

  setR2ClientInstance(mockS3Client as any);

  try {
    const result = await uploadStorageImage({
      file: testImageBuffer,
      folder: "avatars",
      fileNamePrefix: "avatar",
      maxDimension: 50,
      quality: 80,
    });

    assert.equal(result.success, true);
    assert.ok(result.filePath?.startsWith("avatars/avatar-"));
    assert.ok(result.filePath?.endsWith(".webp"));
    assert.ok(result.publicUrl?.startsWith("https://pub-test.r2.dev/avatars/avatar-"));
    assert.ok(result.publicUrl?.endsWith(".webp"));

    assert.ok(sentCommand);
    assert.equal(sentCommand.input.Bucket, "giaphadongho");
    assert.equal(sentCommand.input.Key, result.filePath);
    assert.equal(sentCommand.input.ContentType, "image/webp");
    assert.ok(Buffer.isBuffer(sentCommand.input.Body));

    // Verify optimized image is valid webp and resized <= 50
    const metadata = await sharp(sentCommand.input.Body).metadata();
    assert.equal(metadata.format, "webp");
    assert.ok((metadata.width || 0) <= 50);
  } finally {
    resetR2ClientInstance();
    process.env = originalEnv;
  }
});

test("uploadStorageImage falls back to Supabase storage when R2 is not configured", async () => {
  const originalEnv = { ...process.env };
  delete process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  delete process.env.CLOUDFLARE_R2_BUCKET_NAME;
  delete process.env.CLOUDFLARE_R2_PUBLIC_URL;

  const testImageBuffer = await sharp({
    create: {
      width: 50,
      height: 50,
      channels: 3,
      background: { r: 0, g: 128, b: 255 },
    },
  })
    .png()
    .toBuffer();

  const result = await uploadStorageImage({
    file: {
      name: "test.png",
      type: "image/png",
      arrayBuffer: async () => {
        const ab = new ArrayBuffer(testImageBuffer.byteLength);
        new Uint8Array(ab).set(testImageBuffer);
        return ab;
      },
    },
    folder: "news",
    fileNamePrefix: "post",
  });

  // Since supabase client falls back to dummy client without real credentials in test, it succeeds with dummy url
  assert.equal(result.success, true);
  assert.ok(result.filePath?.startsWith("news/post-"));
  assert.ok(result.filePath?.endsWith(".webp"));

  process.env = originalEnv;
});

test("deleteStorageImage handles empty filePath, R2 deletion, and Supabase deletion", async () => {
  const originalEnv = { ...process.env };

  // Empty path
  const emptyRes = await deleteStorageImage({ filePath: "" });
  assert.equal(emptyRes.success, true);

  // R2 configured
  process.env.CLOUDFLARE_R2_ACCOUNT_ID = "acc-123";
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key-123";
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "sec-123";
  process.env.CLOUDFLARE_R2_BUCKET_NAME = "giaphadongho";
  process.env.CLOUDFLARE_R2_PUBLIC_URL = "https://pub-test.r2.dev";

  let deleteCommand: any = null;
  const mockS3Client = {
    send: async (command: any) => {
      deleteCommand = command;
      return {};
    },
  };
  setR2ClientInstance(mockS3Client as any);

  try {
    const resR2 = await deleteStorageImage({
      filePath: "https://pub-test.r2.dev/avatars/test-delete.webp",
    });
    assert.equal(resR2.success, true);
    assert.ok(deleteCommand);
    assert.equal(deleteCommand.input.Bucket, "giaphadongho");
    assert.equal(deleteCommand.input.Key, "avatars/test-delete.webp");
  } finally {
    resetR2ClientInstance();
  }

  // R2 unconfigured (Supabase fallback)
  delete process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  delete process.env.CLOUDFLARE_R2_BUCKET_NAME;
  delete process.env.CLOUDFLARE_R2_PUBLIC_URL;

  const resSupabase = await deleteStorageImage({
    filePath: "avatars/test-delete.webp",
    bucketFallback: "avatars",
  });
  assert.equal(resSupabase.success, true);

  process.env = originalEnv;
});
