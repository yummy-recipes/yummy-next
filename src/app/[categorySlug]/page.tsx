import { notFound } from 'next/navigation';
import Link from 'next/link'
import { prisma } from '@/data'

interface Params {
  categorySlug: string
}

interface Props {
  params: Params
}

export default async function Page({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: {
      slug: params.categorySlug
    }
  })

  if (!category) {
    return notFound()
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      categoryId: category.id
    },
    include: {
      category: true,
    }
  })

  return (
    <main className="flex flex-col items-center">

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

export async function generateStaticParams() {
  const categories = await prisma.category.findMany()

  return categories.map(category => ({
    categorySlug: category.slug
  }))
}
