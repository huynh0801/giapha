import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('vercel.json schedules crawl-hoatrach every 24 hours at 23:00 UTC (06:00 VN)', () => {
  const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  assert.ok(Array.isArray(vercel.crons), 'crons array must exist');
  const cron = vercel.crons.find(c => c.path === '/api/cron/crawl-hoatrach');
  assert.ok(cron, 'crawl-hoatrach cron must be configured');
  assert.equal(cron.schedule, '0 23 * * *');
});

test('api route exports maxDuration = 60 and handles authorization', () => {
  const code = fs.readFileSync('app/api/cron/crawl-hoatrach/route.ts', 'utf8');
  assert.match(code, /export\s+const\s+maxDuration\s*=\s*60/);
  assert.match(code, /CRON_SECRET/);
});
