import fs from "fs";
import "dotenv/config";

const contentEndpoint =
  "https://api-eu-central-1.hygraph.com/v2/ckzhgf7f30mi901xs88ok02gc/master";

const baseFolder = "./strapi-export";

const allFiles = fs.readdirSync(baseFolder);

const jsonFiles = allFiles.filter((file) => file.endsWith(".json"));

const sources = ["Tag", "Category", "Recipe"].map((sourceName) => {
  const sourceFile = jsonFiles.find((file) => file.startsWith(sourceName));

  if (!sourceFile) {
    throw new Error(`No source file found for ${sourceName}`);
  }

  return { name: sourceName, file: sourceFile };
});

function getSourceFile(sourceName) {
  const source = sources.find(({ name }) => name === sourceName);

  if (!source) {
    throw new Error(`No source file found for ${sourceName}`);
  }

  return source.file;
}

function readExportFile(fileName) {
  return JSON.parse(
    fs.readFileSync(`${baseFolder}/${fileName}`, "utf-8").toString(),
  );
}

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

function findTagBySlug(slug) {
  return graphql(
    `
      query FindTag($slug: String!) {
        tag(where: { slug: $slug }) {
          id
        }
      }
    `,
    { slug },
  );
}

function createTag(slug, title) {
  return graphql(
    `
      mutation CreateTag($title: String!, $slug: String!) {
        createTag(data: { title: $title, slug: $slug }) {
          id
        }
      }
    `,
    { title, slug },
  );
}

function createCategory(slug, title) {
  return graphql(
    `
      mutation CreateCategory($title: String!, $slug: String!) {
        createCategory(data: { title: $title, slug: $slug }) {
          id
        }
      }
    `,
    { title, slug },
  );
}

function findCategoryBySlug(slug) {
  return graphql(
    `
      query FindCategory($slug: String!) {
        category(where: { slug: $slug }) {
          id
        }
      }
    `,
    { slug },
  );
}

async function migrateTags(fileName) {
  const content = readExportFile(fileName);

  const tags = content.map(({ name, slug }) => ({ slug, name }));

  for (const tag of tags) {
    const { data, errors } = await findTagBySlug(tag.slug);

    if (errors) {
      console.log(errors);
      continue;
    }

    if (data.tag === null) {
      const res = await createTag(tag.slug, tag.name);
      if (res.errors) {
        console.log(res.errors);
        continue;
      }
    }
  }
}

async function migrateCategories(fileName) {
  const categories = readExportFile(fileName);

  for (const category of categories) {
    const { data, errors } = await findCategoryBySlug(category.slug);

    if (errors) {
      console.log(errors);
      continue;
    }

    if (data.category === null) {
      const res = await createCategory(category.slug, category.name);
      if (res.errors) {
        console.log(res.errors);
        continue;
      }
    }
  }

  return mapping;
}

function findRecipeBySlug(slug) {
  return graphql(
    `
      query FindRecipe($slug: String!) {
        recipe(where: { slug: $slug }) {
          id
        }
      }
    `,
    { slug },
  );
}

function createRecipe(values) {
  return graphql(
    `
      mutation CreateRecipe($values: RecipeCreateInput!) {
        createRecipe(data: $values) {
          id
        }
      }
    `,
    {
      values,
    },
  );
}

function updateRecipe(values) {
  return graphql(
    `
      mutation UpdateRecipe($id: ID!, $values: RecipeUpdateInput!) {
        updateRecipe(where: { id: $id }, data: $values) {
          id
        }
      }
    `,
    {
      values,
    },
  );
}

// split a markdown string into chunks based on the heading level
function splitMarkdownChunks(source) {
  const lines = source.split("\n");
  const chunks = [];
  let currentChunk = [];
  let currentHeadingLevel = 0;

  for (const line of lines) {
    const headingMatch = line.trim().match(/^(#+).+/);

    if (headingMatch) {
      const headingLevel = headingMatch[1].length - 1;
      const headingText = headingMatch[0];

      if (headingLevel <= currentHeadingLevel) {
        chunks.push(currentChunk.join("\n"));
        currentChunk = [];
      }

      currentHeadingLevel = headingLevel;

      currentChunk.push(headingText);
    } else {
      currentChunk.push(line);
    }
  }

  chunks.push(currentChunk.join("\n"));

  return chunks;
}

async function migrateRecipes(fileName) {
  const recipes = readExportFile(fileName);

  for (const recipe of recipes) {
    const ingredients = recipe.ingredients
      ? splitMarkdownChunks(recipe.ingredients)
      : [];

    const values = {
      title: recipe.title,
      slug: recipe.slug,
      headline: recipe.headline ?? recipe.title,
      preparationTime: recipe.preparationTime,
      ingredients: {
        create: ingredients.map((ingredient) => ({
          content: ingredient,
        })),
      },
      instructions: {
        create: [
          {
            content: recipe.directions ?? "",
          },
        ],
      },
      tags: {
        connect: recipe.tags.map((tag) => ({ slug: tag.slug })),
      },
      category: recipe.category
        ? { connect: { slug: recipe.category.slug } }
        : null,
      seo: {
        create: {
          htmlTitle: recipe.seo ? recipe.seo.htmlTitle : recipe.title,
          htmlDescription: recipe.seo
            ? recipe.seo.htmlDescription
            : (recipe.headline ?? recipe.title),
        },
      },
    };

    console.log(values.title);
    console.log("------------------");
    console.log(recipe.ingredients);
    console.log(
      recipe.ingredients ? splitMarkdownChunks(recipe.ingredients).length : "",
    );
    // console.log(recipe.ingredients)
    // console.log(recipe.directions)

    const { data, errors } = await findRecipeBySlug(recipe.slug);

    if (errors) {
      console.log(errors);
    }

    if (data.recipe === null) {
      console.log(`Create ${recipe.slug}`);
      const {
        data: createData,
        errors: createErrors,
        ...rest
      } = await createRecipe(values);
      if (createErrors) {
        console.log(createErrors);
        continue;
      }
    } else {
      console.log(`Update ${recipe.slug}`);
      const { data: updateData, errors: updateErrors } = await updateRecipe(
        data.recipe.id,
        values,
      );

      if (errors) {
        console.log(updateErrors);
        continue;
      }
    }

    if (errors) {
      console.log(errors);
      continue;
    }
  }
}

async function run() {
  // const tagSourceFile = getSourceFile('Tag')
  // await migrateTags(tagSourceFile)

  // const categorySourceFile = getSourceFile('Category')
  // await migrateCategories(categorySourceFile)

  const recipeSourceFile = getSourceFile("Recipe");
  await migrateRecipes(recipeSourceFile);
}

run();
