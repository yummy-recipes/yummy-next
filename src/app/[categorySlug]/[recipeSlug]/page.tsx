import { notFound } from 'next/navigation';
import { prisma } from '@/data'

interface Params {
  categorySlug: string
  recipeSlug: string
}

interface Props {
  params: Params
}

export default async function Page({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: {
      slug: params.categorySlug,
    }
  })

  if (!category) {
    return notFound()
  }

  return <div>Category {params.categorySlug}, recipe {params.recipeSlug}</div>
}

export async function generateStaticParams() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
    }
  })

  return recipes.map(recipe => ({
    categorySlug: recipe.category.slug,
    recipeSlug: recipe.slug,
  }))
}
