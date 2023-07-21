import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const contentEndpoint = 'https://api-eu-central-1.hygraph.com/v2/ckzhgf7f30mi901xs88ok02gc/master'

async function graphql(query, variables = {}) {
  const res = await fetch(contentEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: process.env.HYGRAPH_AUTH_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  return res.json()
}

async function getOrCreateCategory({ title, slug }) {
  const category = await prisma.category.findUnique({
    where: {
      slug
    }
  })

  if (category) {
    return category
  }

  console.log(`Creating category ${title}...`)

  return await prisma.category.create({
    data: {
      title,
      slug,
      recipes: undefined
    }
  })
}


async function createRecipeBlocks({ recipeId, ingredients, instructions }) {
  for (const ingredient of ingredients) {
    await prisma.recipeIngredientBlock.create({
      data: {
        content: ingredient.content,
        recipe: {
          connect: {
            id: recipeId
          }
        }
      }
    })
  }

  for (const instruction of instructions) {
    await prisma.recipeInstructionBlock.create({
      data: {
        content: instruction.content,
        recipe: {
          connect: {
            id: recipeId
          }
        }
      }
    })
  }
}
async function createOrUpdateRecipes({ title, slug, category, headline, preparationTime, ingredients, instructions }) {
  const recipe = await prisma.recipe.findUnique({
    where: {
      slug
    }
  })

  if (recipe) {
    await prisma.recipeIngredientBlock.deleteMany({
      where: {
        recipeId: recipe.id
      }
    })

    await prisma.recipeInstructionBlock.deleteMany({
      where: {
        recipeId: recipe.id
      }
    })

    await prisma.recipe.update({
      where: {
        id: recipe.id
      },
      data: {
        title,
        slug,
        headline,
        preparationTime,
        category: {
          connect: {
            id: category.id
          }
        }
      }
    })

    await createRecipeBlocks({ recipeId: recipe.id, ingredients, instructions })
    return
  }

  const result = await prisma.recipe.create({
    data: {
      title,
      slug,
      headline,
      preparationTime,
      category: {
        connect: {
          id: category.id
        }
      }
    }
  })

  await createRecipeBlocks({ recipeId: result.id, ingredients, instructions })
}

function loadCategories() {
  return graphql(`
    query LoadCategories {
      categories {
        id
        name
        slug
      }
    }
  `)
}

function loadRecipes() {
  return graphql(`
    query LoadRecipes {
      recipes {
        id
        title
        slug
        headline
        preparationTime
        category {
          id
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
  `)
}

async function main() {
  const { data, errors } = await loadCategories()
  const categoryMap = {}

  if (errors) {
    console.log(errors)
    return
  }

  for (const category of data.categories) {
    const cat = await getOrCreateCategory({
      title: category.name,
      slug: category.slug,
    })

    categoryMap[category.slug] = cat
  }

  const { data: recipesData } = await loadRecipes()

  for (const recipe of recipesData.recipes) {
    await createOrUpdateRecipes({
      title: recipe.title,
      slug: recipe.slug,
      headline: recipe.headline,
      preparationTime: recipe.preparationTime,
      category: { id: categoryMap[recipe.category.slug].id },
      ingredients: recipe.ingredients,
      instructions: recipe.instructions
    })
  }
}

main()
