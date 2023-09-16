import { PrismaClient } from '@prisma/client'
import algoliasearch from 'algoliasearch'

const prisma = new PrismaClient()
const client = algoliasearch('J8YFF4CZ4C', process.env.ALGOLIA_SEARCH_KEY)

const index = client.initIndex(process.env.ALGOLIA_SEARCH_INDEX || 'prod_recipes')

export async function search(query: string) {

  const { hits } = await index.search<{ slug: string }>(query)

  const recipes = await prisma.recipe.findMany({
    where: {
      slug: { in: hits.map(hit => hit.slug) }
    },
    include: {
      category: true,
    }
  })

  return recipes
}
