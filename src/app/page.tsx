import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
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

      <div>
        {recipes.map((recipe) => (
          <div key={recipe.id} className="flex place-items-center">
            <Link href={`/${recipe.category.slug}/${recipe.slug}`}>
              {recipe.title}
            </Link>
          </div>
        ))}
      </div>
    </main >
  )
}
