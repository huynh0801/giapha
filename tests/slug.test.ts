import test from "node:test";
import assert from "node:assert/strict";
import { slugify, generateUniqueSlug } from "../utils/slug";

test("slugify converts Vietnamese diacritics and special characters correctly", () => {
  assert.equal(slugify("Dòng Họ Nguyễn Văn"), "dong-ho-nguyen-van");
  assert.equal(slugify("  Lê Quý Đôn - Chi 1  "), "le-quy-don-chi-1");
  assert.equal(slugify("Phả ký & Lịch sử (2026)"), "pha-ky-lich-su-2026");
  assert.equal(slugify("---Đồng Khởi---"), "dong-khoi");
  assert.equal(slugify(""), "");
});

test("generateUniqueSlug handles collision and increments suffix", async () => {
  const existingSlugs = new Set(["dong-ho-le", "dong-ho-le-1", "dong-ho-le-2"]);
  const isTaken = async (slug: string) => existingSlugs.has(slug);

  const unique = await generateUniqueSlug("dong-ho-le", isTaken);
  assert.equal(unique, "dong-ho-le-3");

  const available = await generateUniqueSlug("dong-ho-nguyen", isTaken);
  assert.equal(available, "dong-ho-nguyen");
});

test("slugify handles uppercase Vietnamese and special characters", () => {
  assert.equal(slugify("ĐỒNG KHỞI - ĐÀ NẴNG"), "dong-khoi-da-nang");
  assert.equal(slugify("!!! @#$% ^&*()"), "");
  assert.equal(slugify("Nguyễn--Văn___A"), "nguyen-van-a");
});

test("generateUniqueSlug handles empty base slug fallback and synchronous callback", async () => {
  const existing = new Set(["item"]);
  const isTaken = (s: string) => existing.has(s);
  const unique = await generateUniqueSlug("", isTaken);
  assert.equal(unique, "item-1");
});
