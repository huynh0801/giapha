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

test("LandingHeader and LandingFooter export valid React components and required copy", async () => {
  const headerPath = path.join(process.cwd(), "components", "landing", "LandingHeader.tsx");
  assert.ok(fs.existsSync(headerPath), "LandingHeader.tsx should exist");
  const headerContent = fs.readFileSync(headerPath, "utf8");
  assert.match(headerContent, /Gia Phả Dòng Họ/);
  assert.match(headerContent, /Tôn vinh cội nguồn/);
  assert.match(headerContent, /\/dashboard/);
  assert.match(headerContent, /\/news/);

  const footerPath = path.join(process.cwd(), "components", "landing", "LandingFooter.tsx");
  assert.ok(fs.existsSync(footerPath), "LandingFooter.tsx should exist");
  const footerContent = fs.readFileSync(footerPath, "utf8");
  assert.match(footerContent, /Dòng họ trường tồn - Con cháu hưng thịnh/);
});

