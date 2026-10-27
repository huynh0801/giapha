export function slugify(input: string): string {
  if (!input) return "";
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function generateUniqueSlug(
  baseSlug: string,
  isTaken: (slug: string) => Promise<boolean> | boolean
): Promise<string> {
  const cleanBase = slugify(baseSlug) || "item";
  const taken = await isTaken(cleanBase);
  if (!taken) return cleanBase;

  let counter = 1;
  while (true) {
    const candidate = `${cleanBase}-${counter}`;
    const candidateTaken = await isTaken(candidate);
    if (!candidateTaken) {
      return candidate;
    }
    counter += 1;
  }
}
