import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { RecipeListItem } from '@/components/recipe-list-item/recipe-list-item'
import { RecipeList } from '@/components/recipe-list/recipe-list'

const prisma = new PrismaClient()

export default async function Home() {
  const categories = await prisma.category.findMany()

  const groupLoaders = categories.map(async (category) => {
    const recipes = await prisma.recipe.findMany({
      where: {
        categoryId: category.id
      },
      take: 4,
      orderBy: {
        id: 'desc'
      },
      include: {
        category: true,
      }
    })

    return {
      category,
      recipes
    }
  })

  const groups = await Promise.all(groupLoaders)

  return (
    <main className="flex flex-col items-center gap-8">
      {groups.map(({ category, recipes }) => (
        <div className="w-full px-2 flex flex-col gap-4" key={category.id}>
          <h2 className="text-2xl font-bold">{category.title}</h2>

          <RecipeList>
            {recipes.map((recipe) => (
              <RecipeListItem
                key={recipe.id}
                href={`/${recipe.category.slug}/${recipe.slug}`}
                title={recipe.title}
              />
            ))}
          </RecipeList>

          <div className="flex justify-end">
            <Link href={`/${category.slug}`} className="text-md text-blue-600">Zobacz wszystkie w kategorii {category.title}</Link>
          </div>
        </div>
      ))}

    </main >
  )
}
