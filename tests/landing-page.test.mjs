import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("landing assets are present in public/images/landing", () => {
  const requiredImages = [
    "hero-banner.png",
    "nav-genealogy.png",
    "nav-members.png",
    "nav-documents.png",
    "nav-news.png",
    "nav-contact.png",
    "about-temple.png",
    "cloud-ornament.png",
    "footer-clouds.png",
  ];

  for (const img of requiredImages) {
    const fullPath = path.join(process.cwd(), "public", "images", "landing", img);
    assert.ok(fs.existsSync(fullPath), `Missing required landing asset: ${img}`);
  }
});
