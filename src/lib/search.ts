import { PrismaClient } from "@prisma/client";
import algoliasearch from "algoliasearch";

const prisma = new PrismaClient();
const client = algoliasearch("J8YFF4CZ4C", process.env.ALGOLIA_SEARCH_KEY);

const index = client.initIndex(
  process.env.ALGOLIA_SEARCH_INDEX || "prod_recipes",
);

export async function search(query: string) {
  const { hits } = await index.search<{ slug: string }>(query);

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
