import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('migration adds source_url column and index to blog_posts', () => {
  const sql = fs.readFileSync('supabase/migrations/20261028150000_add_source_url_to_blog_posts.sql', 'utf8');
  assert.match(sql, /ALTER TABLE public\.blog_posts\s+ADD COLUMN IF NOT EXISTS source_url text;/i);
  assert.match(sql, /CREATE INDEX IF NOT EXISTS idx_blog_posts_source_url\s+ON public\.blog_posts\s*\(source_url\);/i);
});
