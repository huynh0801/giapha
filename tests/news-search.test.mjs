import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

test("news page integrates smart AJAX live search and endpoint", () => {
  const newsPage = read("app/news/page.tsx");
  const newsFeed = read("components/news/NewsFeed.tsx");
  const apiRoute = read("app/api/news/search/route.ts");

  // Page integration
  assert.match(newsPage, /NewsFeed/);
  assert.match(newsPage, /resolvedSearchParams\.q/);
  assert.match(newsPage, /resolvedSearchParams\.category/);

  // AJAX route handler
  assert.match(apiRoute, /export async function GET/);
  assert.match(apiRoute, /title\.ilike/);
  assert.match(apiRoute, /totalCount/);

  // Smart Search features in NewsFeed
  assert.match(newsFeed, /export default function NewsFeed/);
  assert.match(newsFeed, /\/api\/news\/search/);
  assert.match(newsFeed, /debounceTimerRef/);
  assert.match(newsFeed, /Gợi ý bài viết phù hợp/);
  assert.match(newsFeed, /handleCategorySelect/);
  assert.match(newsFeed, /handleResetAll/);
});

test("family introduction and directory cards do not display raw slug links", () => {
  const familyIntro = read("app/dashboard/families/[familySlug]/page.tsx");
  const directoryPage = read("app/dashboard/page.tsx");
  const profilePage = read("app/profile/page.tsx");

  // Must not render raw slug text under family names
  assert.doesNotMatch(familyIntro, /\/dashboard\/\{family\.slug\}/);
  assert.doesNotMatch(directoryPage, /\/dashboard\/\{family\.slug\}/);
  assert.doesNotMatch(directoryPage, /<p[^>]*>\s*\{family\.slug\}\s*<\/p>/);
  assert.doesNotMatch(profilePage, /\/dashboard\/\{family\.slug\}/);
});
