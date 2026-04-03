/**
 * Computes a stable, versioned ID for a recipe from its slug.
 * This same ID is used in the search API and in localStorage tracking.
 */
export function getRecipeId(slug: string): string {
  return Buffer.from(`V1-recipe-${slug}`).toString("base64");
}
