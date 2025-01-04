import { algoliasearch } from "algoliasearch";
import "dotenv/config";

const contentEndpoint =
  "https://api-eu-central-1.hygraph.com/v2/ckzhgf7f30mi901xs88ok02gc/master";
const client = algoliasearch("J8YFF4CZ4C", process.env.ALGOLIA_ADMIN_KEY);
const indexName = process.env.ALGOLIA_SEARCH_INDEX || "prod_recipes";

const updatedAt = new Date().getTime();

async function graphql(query, variables = {}) {
  const res = await fetch(contentEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: process.env.HYGRAPH_AUTH_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return res.json();
}

function loadRecipes(after = null, limit = 100) {
  return graphql(
    `
      query LoadRecipes($after: String, $limit: Int) {
        recipes(
          first: $limit
          after: $after
          where: { documentInStages_some: { stage: PUBLISHED } }
        ) {
          id
          title
          slug
          headline
          category {
            slug
          }
          tags {
            slug
          }
          ingredients {
            id
            content
          }
          instructions {
            id
            content
          }
        }
      }
    `,
    { after, limit }
  );
}

async function main() {
  let after = null;
  const limit = 100;

  do {
    const { data: recipesData, errors } = await loadRecipes(after, limit);

    const dataset = recipesData.recipes.map((recipe) => ({
      objectID: recipe.id,
      slug: recipe.slug,
      title: recipe.title,
      category: recipe.category.slug,
      tags: recipe.tags.map((tag) => tag.slug),
      description: recipe.headline,
      content:
        recipe.ingredients.map((ingredient) => ingredient.content).join(" ") +
        " " +
        recipe.instructions.map((instruction) => instruction.content).join(" "),
      updated_at: updatedAt,
    }));

    await client.saveObjects({ indexName, objects: dataset });

    after =
      recipesData.recipes.length === limit
        ? recipesData.recipes[recipesData.recipes.length - 1].id
        : null;
  } while (after);

  await client.deleteBy({
    indexName,
    deleteByParams: { filters: "updated_at < " + updatedAt },
  });
}

main();
