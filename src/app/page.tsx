import Link from "next/link";
import { MenuSection } from "@/components/menu-section/menu-section";
import { MenuSectionItem } from "@/components/menu-section-item/menu-section-item";
import { TrackedMenuSectionItem } from "@/components/tracked-menu-section-item/tracked-menu-section-item";
import { RecentlyViewedRecipes } from "@/components/recently-viewed-recipes/recently-viewed-recipes";
import { getPrismaClient } from "../../prisma/client.ts";

const prisma = getPrismaClient();

const tagSlugs = ["makaron", "wegetarianskie", "drozdzowe", "ciasta"];

const bySlugPosition = (tag1: { slug: string }, tag2: { slug: string }) =>
  tagSlugs.indexOf(tag1.slug) - tagSlugs.indexOf(tag2.slug);

const upperCaseFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const dynamic = "force-static";

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

      <RecentlyViewedRecipes />

      {groups.map(({ tag, recipes }) => (
        <div className="w-full flex flex-col gap-4" key={tag.id}>
          <MenuSection title={upperCaseFirstLetter(tag.title)}>
            {recipes.map((recipe) => (
              <TrackedMenuSectionItem
                key={recipe.id}
                href={`/${recipe.category.slug}/${recipe.slug}`}
                title={recipe.title}
                description={recipe.headline}
                prepTime={recipe.preparationTime}
                recipe={{
                  id: recipe.id,
                  slug: recipe.slug,
                  title: recipe.title,
                  headline: recipe.headline,
                  preparationTime: recipe.preparationTime,
                  categorySlug: recipe.category.slug,
                  coverImage: recipe.coverImage,
                }}
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
