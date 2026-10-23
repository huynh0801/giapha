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
    "logo.png",
    "decorate1.png",
    "decorate2.png",
    "herosection-mobile.png",
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
  assert.match(headerContent, /logo\.png/);
  assert.match(headerContent, /decorate2\.png/);
  assert.match(headerContent, /decorate1\.png/);
  assert.match(headerContent, /Playfair Display/);
  assert.match(headerContent, /\/dashboard/);
  assert.match(headerContent, /\/news/);

  const footerPath = path.join(process.cwd(), "components", "landing", "LandingFooter.tsx");
  assert.ok(fs.existsSync(footerPath), "LandingFooter.tsx should exist");
  const footerContent = fs.readFileSync(footerPath, "utf8");
  assert.match(footerContent, /footer-clouds\.png/);
  assert.match(footerContent, /Dòng họ trường tồn - Con cháu hưng thịnh/);
});

test("LandingHero and LandingQuickNav contain mockup copy and navigation items", () => {
  const heroPath = path.join(process.cwd(), "components", "landing", "LandingHero.tsx");
  assert.ok(fs.existsSync(heroPath), "LandingHero.tsx should exist");
  const heroContent = fs.readFileSync(heroPath, "utf8");
  assert.match(heroContent, /hero-banner\.png/);
  assert.match(heroContent, /herosection-mobile\.png/);
  assert.match(heroContent, /\/dashboard/);

  const navPath = path.join(process.cwd(), "components", "landing", "LandingQuickNav.tsx");
  assert.ok(fs.existsSync(navPath), "LandingQuickNav.tsx should exist");
  const navContent = fs.readFileSync(navPath, "utf8");
  assert.match(navContent, /Gia phả dòng họ/);
  assert.match(navContent, /Thành viên/);
  assert.match(navContent, /Tư liệu/);
  assert.match(navContent, /Tin tức [–-] Sự kiện/);
  assert.match(navContent, /Liên hệ/);
});

test("LandingAbout and LandingLatestNews contain expected copy and fallback support", () => {
  const aboutPath = path.join(process.cwd(), "components", "landing", "LandingAbout.tsx");
  assert.ok(fs.existsSync(aboutPath), "LandingAbout.tsx should exist");
  const aboutContent = fs.readFileSync(aboutPath, "utf8");
  assert.match(aboutContent, /Về dòng họ chúng tôi/);
  assert.match(aboutContent, /Xem chi tiết/);

  const newsPath = path.join(process.cwd(), "components", "landing", "LandingLatestNews.tsx");
  assert.ok(fs.existsSync(newsPath), "LandingLatestNews.tsx should exist");
  const newsContent = fs.readFileSync(newsPath, "utf8");
  assert.match(newsContent, /Tin tức mới nhất/);
  assert.match(newsContent, /Xem tất cả/);
  assert.match(newsContent, /Lễ giỗ Tổ dòng họ/);
});

test("app/page.tsx imports and integrates all landing components", () => {
  const pagePath = path.join(process.cwd(), "app", "page.tsx");
  assert.ok(fs.existsSync(pagePath), "app/page.tsx should exist");
  const pageContent = fs.readFileSync(pagePath, "utf8");
  assert.match(pageContent, /LandingHeader/);
  assert.match(pageContent, /LandingHero/);
  assert.match(pageContent, /LandingQuickNav/);
  assert.match(pageContent, /LandingAbout/);
  assert.match(pageContent, /LandingLatestNews/);
  assert.match(pageContent, /LandingFooter/);
});

test("app/blog/[slug]/page.tsx integrates traditional master frame and background decor", () => {
  const blogPath = path.join(process.cwd(), "app", "blog", "[slug]", "page.tsx");
  assert.ok(fs.existsSync(blogPath), "app/blog/[slug]/page.tsx should exist");
  const content = fs.readFileSync(blogPath, "utf8");
  assert.match(content, /BackgroundDecor/);
  assert.match(content, /#caa455/);
  assert.match(content, /#8c1d1d/);
  assert.match(content, /SVN-Studio Brush/);
  assert.match(content, /\/news/);
});





