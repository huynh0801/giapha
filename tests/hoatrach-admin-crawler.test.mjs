import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('app/actions/crawler.ts exports triggerHoatrachCrawlAction with admin guard', () => {
  const code = fs.readFileSync('app/actions/crawler.ts', 'utf8');
  assert.match(code, /export\s+async\s+function\s+triggerHoatrachCrawlAction/);
  assert.match(code, /system_admin/);
});

test('app/admin/blog/page.tsx contains crawler button', () => {
  const code = fs.readFileSync('app/admin/blog/page.tsx', 'utf8');
  assert.match(code, /Hòa Trạch|crawl|Cập nhật tin/i);
});
