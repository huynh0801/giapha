import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("app/robots.ts defines crawler policies and points to sitemap.xml", () => {
  const content = read("app/robots.ts");
  assert.match(content, /export default function robots/);
  assert.match(content, /sitemap\.xml/);
  assert.match(content, /\/admin/);
  assert.match(content, /\/dashboard/);
  assert.match(content, /\/about/);
  assert.match(content, /\/news/);
  assert.match(content, /Googlebot/);
});

test("app/sitemap.ts dynamically builds sitemap entries", () => {
  const content = read("app/sitemap.ts");
  assert.match(content, /export default async function sitemap/);
  assert.match(content, /changeFrequency/);
  assert.match(content, /priority/);
  assert.match(content, /blog_posts/);
  assert.match(content, /\/blog\/\${post\.slug}/);
});

test("app/layout.tsx contains rich metadata, keywords, robots and openGraph assets", () => {
  const content = read("app/layout.tsx");
  assert.match(content, /metadataBase/);
  assert.match(content, /keywords:/);
  assert.match(content, /gia phả dòng họ/);
  assert.match(content, /authors:/);
  assert.match(content, /alternates:\s*\{\s*canonical:/);
  assert.match(content, /max-image-preview/);
  assert.match(content, /hero-banner\.webp/);
  assert.match(content, /summary_large_image/);
  assert.match(content, /logo\.png/);
});

test("app/page.tsx contains WebSite and Organization JSON-LD schemas and canonical link", () => {
  const content = read("app/page.tsx");
  assert.match(content, /canonical:\s*"\/"/);
  assert.match(content, /@type":\s*"WebSite"/);
  assert.match(content, /@type":\s*"Organization"/);
  assert.match(content, /SearchAction/);
});

test("app/about/page.tsx exports metadata and AboutPage JSON-LD schema", () => {
  const content = read("app/about/page.tsx");
  assert.match(content, /export const metadata/);
  assert.match(content, /canonical:\s*"\/about"/);
  assert.match(content, /@type":\s*"AboutPage"/);
  assert.match(content, /AboutView/);
});

test("app/news/page.tsx exports metadata, canonical and BreadcrumbList JSON-LD schema", () => {
  const content = read("app/news/page.tsx");
  assert.match(content, /export const metadata/);
  assert.match(content, /canonical:\s*"\/news"/);
  assert.match(content, /@type":\s*"BreadcrumbList"/);
  assert.match(content, /hero-banner\.webp/);
});

test("app/blog/[slug]/page.tsx generates dynamic article metadata and schema", () => {
  const content = read("app/blog/[slug]/page.tsx");
  assert.match(content, /export async function generateMetadata/);
  assert.match(content, /canonical:\s*`\/blog\/\${slug}`/);
  assert.match(content, /type:\s*"article"/);
  assert.match(content, /summary_large_image/);
  assert.match(content, /@type":\s*"BlogPosting"/);
  assert.match(content, /@type":\s*"BreadcrumbList"/);
});
