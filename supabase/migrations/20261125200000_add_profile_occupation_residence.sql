-- Migration: Add occupation and current_residence to profiles table
-- Date: 2026-11-25

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS current_residence TEXT;

COMMENT ON COLUMN public.profiles.occupation IS 'Nghề nghiệp hoặc chuyên môn của người dùng';
COMMENT ON COLUMN public.profiles.current_residence IS 'Địa chỉ hoặc nơi ở hiện tại của người dùng';
