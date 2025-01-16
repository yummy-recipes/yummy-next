import { notFound } from "next/navigation";
import { prisma } from "@/data";
import { Recipe } from "@/components/recipe/recipe";

interface Params {
  categorySlug: string;
  recipeSlug: string;
}

interface Props {
  params: Promise<Params>;
  children: React.ReactNode;
}

export default async function Layout({ params, children }: Props) {
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
      category: true,
      instructions: true,
      ingredients: true,
      galleryImages: true,
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
        galleryImages={recipe.galleryImages}
        slug={recipe.slug}
        categorySlug={recipe.category.slug}
        ingredients={recipe.ingredients}
        instructions={recipe.instructions}
      />
      {children}
    </div>
  );
}
