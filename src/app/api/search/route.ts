import { unstable_cache as cache } from "next/cache";
import { search } from "@/lib/search";
import { getRecipeId } from "@/lib/recipe-id";

const getSearchResults = cache(
  (query: string) => search(query),
  ["search-cache-key"],
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");

  if (!query || query.length < 3) {
    return new Response(JSON.stringify({ data: [] }));
  }

  const recipes = await getSearchResults(query);

  const data = recipes.flatMap((recipe) => {
    let id: string;
    try {
      id = getRecipeId(recipe.slug);
    } catch (error) {
      // A single recipe with a bad slug shouldn't take down the whole
      // search response — skip it and keep the rest of the results.
      console.error(`Skipping recipe with invalid slug in search results:`, error);
      return [];
    }
    return [
      {
        id,
        label: recipe.title,
        value: `/${recipe.category.slug}/${recipe.slug}`,
        recipe: {
          id,
          slug: recipe.slug,
          title: recipe.title,
          headline: recipe.headline,
          preparationTime: recipe.preparationTime,
          categorySlug: recipe.category.slug,
          coverImage: recipe.coverImage,
        },
      },
    ];
  });

  return new Response(JSON.stringify({ data }));
}
