/**
 * Computes a stable, versioned ID for a recipe from its slug.
 * This same ID is used in the search API and in localStorage tracking.
 *
 * NOTE: This module uses the Node.js `Buffer` API and is intended for
 * server-side use only (Server Components and API routes).
 */
export function getRecipeId(slug: string): string {
  if (!slug || typeof slug !== "string") {
    throw new Error("Invalid recipe slug");
  }
  return Buffer.from(`V1-recipe-${slug}`).toString("base64");
}
