"use client";

import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import { MenuSection } from "@/components/menu-section/menu-section";
import { MenuSectionItem } from "@/components/menu-section-item/menu-section-item";

export function RecentlyViewedRecipes() {
  const { recipes } = useRecentlyViewed();

  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <MenuSection title="Ostatnio przeglądane">
        {recipes.map((recipe) => (
          <MenuSectionItem
            key={recipe.id}
            href={`/${recipe.categorySlug}/${recipe.slug}`}
            title={recipe.title}
            description={recipe.headline}
            prepTime={recipe.preparationTime}
          />
        ))}
      </MenuSection>
    </div>
  );
}
