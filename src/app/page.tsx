import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { MenuSection } from "@/components/menu-section/menu-section";
import { MenuSectionItem } from "@/components/menu-section-item/menu-section-item";

const prisma = new PrismaClient();

const tagSlugs = ["makaron", "wegetarianskie", "drozdzowe", "ciasta"];

const bySlugPosition = (tag1: { slug: string }, tag2: { slug: string }) =>
  tagSlugs.indexOf(tag1.slug) - tagSlugs.indexOf(tag2.slug);

const upperCaseFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export default async function Home() {
  const tags = await prisma.tag.findMany({ where: { slug: { in: tagSlugs } } });
  const recipeCount = await prisma.recipe.count();
  const categories = await prisma.category.findMany();

  const groupLoaders = tags.sort(bySlugPosition).map(async (tag) => {
    const recipes = await prisma.recipe.findMany({
      where: {
        tags: {
          some: {
            id: tag.id,
          },
        },
      },
      take: 4,
      orderBy: {
        publishedAt: "desc",
      },
      include: {
        category: true,
      },
    });

    return {
      tag,
      recipes,
    };
  });

  const groups = await Promise.all(groupLoaders);

  return (
    <main className="flex flex-col items-center gap-8">
      <div className="w-full my-12">
        <h1 className="text-gradient uppercase text-4xl inline">
          Przepisy kulinarne
        </h1>
        <h2 className="text-lg">
          Kolekcja {recipeCount} domowych przepisów na pyszne dania
        </h2>
      </div>

      {groups.map(({ tag, recipes }) => (
        <div className="w-full flex flex-col gap-4" key={tag.id}>
          <MenuSection title={upperCaseFirstLetter(tag.title)}>
            {recipes.map((recipe) => (
              <MenuSectionItem
                key={recipe.id}
                href={`/${recipe.category.slug}/${recipe.slug}`}
                title={recipe.title}
                description={recipe.headline}
                prepTime={recipe.preparationTime}
              />
            ))}
          </MenuSection>

          <div className="flex justify-end">
            <Link href={`/tag/${tag.slug}`} className="text-md text-blue-600">
              Zobacz wszystkie w kategorii {tag.title}
            </Link>
          </div>
        </div>
      ))}

      <div className="w-full py-6 flex flex-row flex-wrap gap-4">
        {categories.map((category) => (
          <div className="flex justify-center" key={category.id}>
            <Link href={`/${category.slug}`} className="text-md text-blue-600">
              {category.title}
            </Link>
          </div>
        ))}
      </div>

      <div className="w-full py-6">
        <div className="flex justify-center">
          <Link href={`/wszystko`} className="text-md text-blue-600">
            Zobacz wszystkie przepisy
          </Link>
        </div>
      </div>
    </main>
  );
}
