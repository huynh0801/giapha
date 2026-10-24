import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { optimizeAvatarImage, optimizeBlogImage } from "../utils/imageOptimization.ts";
import sharp from "sharp";

test("optimizeAvatarImage converts a PNG/JPEG buffer to WebP with proper options", async () => {
  // Create a 1000x800 sample PNG buffer
  const samplePng = await sharp({
    create: {
      width: 1000,
      height: 800,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const file = new File([samplePng], "test-avatar.png", { type: "image/png" });
  const result = await optimizeAvatarImage(file, { maxDimension: 400 });

  assert.equal(result.contentType, "image/webp");
  assert.equal(result.extension, "webp");
  assert.ok(result.buffer.byteLength > 0);

  // Inspect the optimized buffer using sharp
  const metadata = await sharp(result.buffer).metadata();
  assert.equal(metadata.format, "webp");
  assert.ok(metadata.width <= 400);
  assert.ok(metadata.height <= 400);
});

test("uploadAvatarAction incorporates optimizeAvatarImage and WebP storage", () => {
  const fileContent = fs.readFileSync("app/actions/storage.ts", "utf-8");
  assert.ok(fileContent.includes("optimizeAvatarImage"));
  assert.ok(fileContent.includes("optimized.contentType"));
  assert.ok(fileContent.includes("optimized.buffer"));
  assert.ok(fileContent.includes("optimized.extension"));
});
