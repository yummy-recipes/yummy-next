import { PrismaClient } from '@prisma/client'
import { RecipeListItem } from '@/components/recipe-list-item/recipe-list-item'
import { RecipeList } from '@/components/recipe-list/recipe-list'
import { Search } from '@/components/search/search'

const prisma = new PrismaClient()

export default async function Home() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
    }
  })

  return (
    <main className="flex flex-col items-center">
      <div>
        <Search />
      </div>

      <RecipeList>
        {recipes.map((recipe) => (
          <RecipeListItem
            key={recipe.id}
            href={`/${recipe.category.slug}/${recipe.slug}`}
            title={recipe.title}
          />
        ))}
      </RecipeList>
    </main >
  )
}
