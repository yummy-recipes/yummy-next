import { algoliasearch } from "algoliasearch";
import { getPrismaClient } from "../../prisma/client.ts";

const prisma = getPrismaClient();
const indexName = process.env.ALGOLIA_SEARCH_INDEX || "prod_recipes";

let client: ReturnType<typeof getNewClient> | null = null;

const getNewClient = () =>
  algoliasearch("J8YFF4CZ4C", process.env.ALGOLIA_SEARCH_KEY);

const getClient = () => {
  if (!client) {
    client = getNewClient();
  }
  return client;
};

export async function search(query: string) {
  const client = getClient();

  const { hits } = await client.searchSingleIndex<{ slug: string }>({
    indexName,
    searchParams: { query },
  });

  const slugs = hits.map((hit) => hit.slug);

  const recipes = await prisma.recipe.findMany({
    where: {
      slug: { in: slugs },
    },
    include: {
      category: true,
    },
  });

  return recipes
    .slice()
    .sort(
      (recipe1, recipe2) =>
        slugs.indexOf(recipe1.slug) - slugs.indexOf(recipe2.slug),
    );
}
