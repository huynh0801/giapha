-- Add lunar death date fields to persons table.
-- Idempotent so it is safe when a database already has these columns.
ALTER TABLE IF EXISTS public.persons
  ADD COLUMN IF NOT EXISTS death_lunar_day integer,
  ADD COLUMN IF NOT EXISTS death_lunar_month integer,
  ADD COLUMN IF NOT EXISTS death_lunar_year integer;
