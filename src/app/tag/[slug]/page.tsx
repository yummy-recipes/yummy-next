import { notFound } from "next/navigation";
import { prisma } from "@/data";
import { RecipeListItem } from "@/components/recipe-list-item/recipe-list-item";
import { RecipeList } from "@/components/recipe-list/recipe-list";

interface Params {
  slug: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!tag) {
    return notFound();
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      tags: {
        some: {
          id: tag.id,
        },
      },
    },
    include: {
      category: true,
    },
  });

  return (
    <main className="w-full">
      <h2 className="text-2xl my-8">Przepisy w kategorii {tag.title}</h2>

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
