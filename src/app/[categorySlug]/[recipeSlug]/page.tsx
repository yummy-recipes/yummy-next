import { notFound } from "next/navigation";
import { prisma } from "@/data";
import { Recipe } from "@/components/recipe/recipe";

interface Params {
  categorySlug: string;
  recipeSlug: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function Page({ params }: Props) {
  const { categorySlug, recipeSlug } = await params;
  const category = await prisma.category.findUnique({
    where: {
      slug: categorySlug,
    },
  });

  if (!category) {
    return notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: {
      slug: recipeSlug,
    },
    include: {
      instructions: true,
      ingredients: true,
    },
  });

  if (!recipe) {
    return notFound();
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <Recipe
        title={recipe.title}
        coverImage={recipe.coverImage}
        coverImageBlurDataUrl={recipe.coverImageBlurDataUrl}
        ingredients={recipe.ingredients}
        instructions={recipe.instructions}
      />
    </div>
  );
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
    },
  });

  return recipes.map((recipe) => ({
    categorySlug: recipe.category.slug,
    recipeSlug: recipe.slug,
    recipe,
  }));
}
