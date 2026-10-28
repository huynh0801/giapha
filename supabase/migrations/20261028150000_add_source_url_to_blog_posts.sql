-- Migration: Add source_url column and index for news crawler deduplication
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS source_url text;

CREATE INDEX IF NOT EXISTS idx_blog_posts_source_url 
  ON public.blog_posts (source_url);
