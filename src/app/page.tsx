import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import Click from './click'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
    }
  })

  const categories = await prisma.category.findMany()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      {categories.map((category) => (
        <div key={category.id} className="flex place-items-center">
          <Link href={`/${category.slug}`}>{category.title}</Link>
        </div>
      ))}

      <hr />

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
