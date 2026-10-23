ALTER TABLE public.persons
  ADD COLUMN IF NOT EXISTS external_ref text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_persons_tree_external_ref
  ON public.persons(tree_id, lower(external_ref))
  WHERE external_ref IS NOT NULL AND external_ref <> '';

WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY
        tree_id,
        LEAST(person_a, person_b),
        GREATEST(person_a, person_b),
        type
      ORDER BY created_at ASC, id ASC
    ) AS duplicate_rank
  FROM public.relationships
  WHERE type = 'marriage'
)
DELETE FROM public.relationships AS relationship
USING ranked
WHERE relationship.id = ranked.id
  AND ranked.duplicate_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_relationships_tree_marriage_pair
  ON public.relationships(
    tree_id,
    LEAST(person_a, person_b),
    GREATEST(person_a, person_b),
    type
  )
  WHERE type = 'marriage';
