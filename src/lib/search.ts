import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function search(query: string) {
  if (!query || query.length < 3) {
    return []
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      OR: [
        { title: { contains: query } }
      ]
    },
    include: {
      category: true,
    }
  })

  return recipes
}
