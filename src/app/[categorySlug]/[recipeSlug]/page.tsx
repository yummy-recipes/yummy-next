import { prisma } from "@/data";

export default function Page() {
  return null;
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
