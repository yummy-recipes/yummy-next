import { notFound } from "next/navigation";
import { RecipeListItem } from "@/components/recipe-list-item/recipe-list-item";
import { RecipeList } from "@/components/recipe-list/recipe-list";
import { prisma } from "@/data";

interface Params {
  categorySlug: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function Page({ params }: Props) {
  const { categorySlug } = await params;
  const category = await prisma.category.findUnique({
    where: {
      slug: categorySlug,
    },
  });

  if (!category) {
    return notFound();
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      categoryId: category.id,
    },
    include: {
      category: true,
    },
  });

  return (
    <main className="w-full">
      <h2 className="text-2xl my-8">Przepisy w kategorii {category.title}</h2>
      <RecipeList>
        {recipes.map((recipe) => (
          <RecipeListItem
            key={recipe.id}
            href={`/${recipe.category.slug}/${recipe.slug}`}
            coverImage={recipe.coverImage}
            title={recipe.title}
          />
        ))}
      </RecipeList>
    </main>
  );
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany();

  return categories.map((category) => ({
    categorySlug: category.slug,
  }));
}
