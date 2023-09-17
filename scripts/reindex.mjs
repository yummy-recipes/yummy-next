import algoliasearch from 'algoliasearch'

const contentEndpoint = 'https://api-eu-central-1.hygraph.com/v2/ckzhgf7f30mi901xs88ok02gc/master'
const client = algoliasearch('J8YFF4CZ4C', process.env.ALGOLIA_ADMIN_KEY)

const updatedAt = new Date().getTime()

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


function loadRecipes() {
  return graphql(`
    query LoadRecipes {
      recipes(where: { documentInStages_some: { stage: PUBLISHED } }) {
        id
        title
        slug
        headline
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
  const { data: recipesData } = await loadRecipes()

  const dataset = recipesData.recipes.map(recipe => ({
    objectID: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    description: recipe.headline,
    content: recipe.ingredients.map(ingredient => ingredient.content).join(' ') + ' ' + recipe.instructions.map(instruction => instruction.content).join(' '),
    updated_at: updatedAt
  }))

  const index = client.initIndex('prod_recipes')
  await index.saveObjects(dataset, { autoGenerateObjectIDIfNotExist: true })

  await index.deleteBy({
    filters: 'updated_at < ' + updatedAt
  })
}

main()
