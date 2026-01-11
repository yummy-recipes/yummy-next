import { unstable_cache as cache } from "next/cache";
import { search } from "@/lib/search";

const getSearchResults = cache(
  (query: string) => search(query),
  ["search-cache-key"],
);

const getId = (obj: { slug: string }) =>
  Buffer.from(`V1-recipe-${obj.slug}`).toString("base64");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");

  if (!query || query.length < 3) {
    return new Response(JSON.stringify({ data: [] }));
  }

  const recipes = await getSearchResults(query);

  const data = recipes.map((recipe) => {
    const id = getId(recipe);
    return {
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
    };
  });

  return new Response(JSON.stringify({ data }));
}
