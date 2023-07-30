import { notFound } from 'next/navigation';
import { prisma } from '@/data'
import { Recipe } from '@/components/recipe/recipe'

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

  const recipe = await prisma.recipe.findUnique({
    where: {
      slug: params.recipeSlug,
    },
    include: {
      instructions: true,
      ingredients: true,
    }
  })

  if (!recipe) {
    return notFound()
  }

  return (
    <Recipe
      title={recipe.title}
      coverImage={recipe.coverImage}
      ingredients={recipe.ingredients}
      instructions={recipe.instructions}
    />
  )
}

export const dynamicParams = false

export async function generateStaticParams() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
    }
  })

  return recipes.map(recipe => ({
    categorySlug: recipe.category.slug,
    recipeSlug: recipe.slug,
    recipe
  }))
}
