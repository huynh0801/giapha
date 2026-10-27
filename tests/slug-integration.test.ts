import test from "node:test";
import assert from "node:assert/strict";
import { slugify, generateUniqueSlug } from "../utils/slug";

test("slugify handles edge cases and Vietnamese accents cleanly", () => {
  assert.equal(slugify("Họ Đỗ (Chi Phía Bắc)"), "ho-do-chi-phia-bac");
  assert.equal(slugify("Nguyễn Đình Chiểu @ 2026!"), "nguyen-dinh-chieu-2026");
  assert.equal(slugify("---   ---"), "");
});

test("generateUniqueSlug correctly avoids conflicts across multiple collisions", async () => {
  const existing = new Set(["tin-tuc-dong-ho", "tin-tuc-dong-ho-1", "tin-tuc-dong-ho-2"]);
  const isTaken = (candidate: string) => existing.has(candidate);

  const res = await generateUniqueSlug("tin-tuc-dong-ho", isTaken);
  assert.equal(res, "tin-tuc-dong-ho-3");
});

test("slugify guarantees valid slug format [a-z0-9-] with no leading/trailing or double hyphens", () => {
  const samples = [
    "  Trần Hưng Đạo --- Đại Vương  ",
    "&&& Lễ Giỗ Tổ Hùng Vương 2026 ???",
    "Đoàn Thị Điểm / Bà Huyện Thanh Quan",
    "---Tổ Tiên---Nguyên Quán---",
    "  @#%  "
  ];

  const expected = [
    "tran-hung-dao-dai-vuong",
    "le-gio-to-hung-vuong-2026",
    "doan-thi-diem-ba-huyen-thanh-quan",
    "to-tien-nguyen-quan",
    ""
  ];

  samples.forEach((sample, idx) => {
    const slug = slugify(sample);
    assert.equal(slug, expected[idx]);
    if (slug.length > 0) {
      assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

test("generateUniqueSlug works with async database-like checker and fallback", async () => {
  const dbSlugs = new Set(["item", "item-1"]);
  const asyncIsTaken = async (candidate: string) => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    return dbSlugs.has(candidate);
  };

  const resEmpty = await generateUniqueSlug("", asyncIsTaken);
  assert.equal(resEmpty, "item-2");

  const resNew = await generateUniqueSlug("Chi Nhánh Mới", asyncIsTaken);
  assert.equal(resNew, "chi-nhanh-moi");
});
