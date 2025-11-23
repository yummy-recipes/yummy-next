import { getPrismaClient } from "../prisma/client.ts";

const prisma = getPrismaClient();

async function getOrCreateCategory({ title, slug }) {
  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (category) {
    return category;
  }

  console.log(`Creating category ${title}...`);

  return await prisma.category.create({
    data: {
      title,
      slug,
      recipes: undefined,
    },
  });
}

async function getOrCreateTag({ title, slug }) {
  const tag = await prisma.tag.findUnique({
    where: {
      slug,
    },
  });

  if (tag) {
    return tag;
  }

  console.log(`Creating tag ${title}...`);

  return await prisma.tag.create({
    data: {
      title,
      slug,
      recipes: undefined,
    },
  });
}

async function createRecipeBlocks({ recipeId, ingredients, instructions }) {
  for (const ingredient of ingredients) {
    await prisma.recipeIngredientBlock.create({
      data: {
        content: ingredient.content,
        recipe: {
          connect: {
            id: recipeId,
          },
        },
      },
    });
  }

  for (const instruction of instructions) {
    await prisma.recipeInstructionBlock.create({
      data: {
        content: instruction.content,
        recipe: {
          connect: {
            id: recipeId,
          },
        },
      },
    });
  }
}
async function createOrUpdateRecipes({
  title,
  slug,
  category,
  coverImage,
  headline,
  preparationTime,
  publishedAt,
  ingredients,
  instructions,
  tags,
}) {
  const recipe = await prisma.recipe.findUnique({
    where: {
      slug,
    },
  });

  if (recipe) {
    await prisma.recipeIngredientBlock.deleteMany({
      where: {
        recipeId: recipe.id,
      },
    });

    await prisma.recipeInstructionBlock.deleteMany({
      where: {
        recipeId: recipe.id,
      },
    });

    await prisma.recipe.update({
      where: {
        id: recipe.id,
      },
      data: {
        title,
        slug,
        headline,
        preparationTime,
        coverImage,
        publishedAt,
        category: {
          connect: {
            id: category.id,
          },
        },
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
    });

    await createRecipeBlocks({
      recipeId: recipe.id,
      ingredients,
      instructions,
    });
    return;
  }

  const result = await prisma.recipe.create({
    data: {
      title,
      slug,
      headline,
      coverImage,
      preparationTime,
      publishedAt,
      category: {
        connect: {
          id: category.id,
        },
      },
      tags: {
        connect: tags.map((tag) => ({ id: tag.id })),
      },
    },
  });

  await createRecipeBlocks({ recipeId: result.id, ingredients, instructions });
}

function loadCategories() {
  return Promise.resolve({
    data: {
      categories: [
        { id: "1", name: "Main Course", slug: "main-course" },
        { id: "2", name: "Dessert", slug: "dessert" },
      ],
    },
  });
}

function loadRecipes(after = null, limit) {
  return Promise.resolve({
    data: {
      recipes: [
        {
          id: "1",
          title: "Spaghetti Carbonara",
          slug: "spaghetti-carbonara",
          headline: "A classic Italian pasta dish",
          preparationTime: 30,
          publishedAt: new Date().toISOString(),
          tags: [
            { id: "1", title: "Pasta", slug: "pasta" },
            { id: "2", title: "Italian", slug: "italian" },
          ],
          cover: {
            url: "https://media.graphassets.com/eiXZ15TaNlZO4H8DQQQB",
          },
          category: {
            id: "1",
            slug: "main-course",
          },
          ingredients: [
            { id: "1", content: "200g spaghetti" },
            { id: "2", content: "100g pancetta" },
          ],
          instructions: [
            { id: "1", content: "Cook the spaghetti" },
            { id: "2", content: "Fry the pancetta" },
          ],
        },
      ],
    },
  });
}

async function main() {
  console.log("Seeding database...");
  const { data, errors } = await loadCategories();
  const categoryMap = {};

  if (errors) {
    console.log(errors);
    return;
  }

  for (const category of data.categories) {
    const cat = await getOrCreateCategory({
      title: category.name,
      slug: category.slug,
    });

    categoryMap[category.slug] = cat;
  }

  let after = null;
  const limit = 100;

  do {
    const { data: recipesData } = await loadRecipes(after, limit);

    for (const recipe of recipesData.recipes) {
      if (!recipe.category) {
        console.log(`Recipe ${recipe.title} has no category`);
        continue;
      }

      const dbTags = [];

      for (const tag of recipe.tags) {
        const dbTag = await getOrCreateTag({
          title: tag.title,
          slug: tag.slug,
        });

        dbTags.push(dbTag);
      }

      await createOrUpdateRecipes({
        title: recipe.title,
        slug: recipe.slug,
        coverImage:
          recipe.cover?.url ??
          "https://media.graphassets.com/eiXZ15TaNlZO4H8DQQQB",
        headline: recipe.headline,
        preparationTime: recipe.preparationTime,
        category: { id: categoryMap[recipe.category.slug].id },
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        publishedAt: recipe.publishedAt,
        tags: dbTags,
      });
    }

    after =
      recipesData.recipes.length === limit
        ? recipesData.recipes[recipesData.recipes.length - 1].id
        : null;
  } while (after);

  console.log("Done");
}

main();
