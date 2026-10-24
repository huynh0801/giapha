import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

test("news page includes search bar and handles keyword/category filtering", () => {
  const newsPage = read("app/news/page.tsx");
  const searchBar = read("components/news/NewsSearchBar.tsx");

  // Page integration
  assert.match(newsPage, /NewsSearchBar/);
  assert.match(newsPage, /resolvedSearchParams\.q/);
  assert.match(newsPage, /resolvedSearchParams\.category/);
  assert.match(newsPage, /title\.ilike/);
  assert.match(newsPage, /getPageUrl/);
  assert.match(newsPage, /Không Tìm Thấy Bản Tin Phù Hợp/);

  // SearchBar component features
  assert.match(searchBar, /export default function NewsSearchBar/);
  assert.match(searchBar, /Tìm kiếm/);
  assert.match(searchBar, /handleCategoryClick/);
  assert.match(searchBar, /handleResetAll/);
  assert.match(searchBar, /Search className/);
});
