import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import Link from 'next/link'


export default async function Home() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
    }
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">

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
