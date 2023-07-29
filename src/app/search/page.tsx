import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { SearchForm } from '@/components/search-form'

const prisma = new PrismaClient()

interface Props {
  searchParams: { query: string }
}

export default async function Home({ searchParams }: Props) {
  const { query } = searchParams

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

  return (
    <main className="flex flex-col items-center">
      <SearchForm query={query} />

      {recipes.map((recipe) => (
        <div key={recipe.id} className="flex place-items-center">
          <Link href={`/${recipe.category.slug}/${recipe.slug}`}>
            {recipe.title}
          </Link>
        </div>
      ))}
    </main >
  )
}