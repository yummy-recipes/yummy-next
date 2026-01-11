"use client";

import { useRecentlyViewed, RecentlyViewedRecipe } from "@/lib/use-recently-viewed";
import { MenuSectionItem } from "@/components/menu-section-item/menu-section-item";

interface Props {
  title: string;
  href: string;
  prepTime: number;
  description: string;
  recipe: RecentlyViewedRecipe;
}

export function TrackedMenuSectionItem({ title, href, prepTime, description, recipe }: Props) {
  const { addRecipe } = useRecentlyViewed();

  const handleClick = () => {
    addRecipe(recipe);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Track view of ${title}`}
    >
      <MenuSectionItem 
        title={title}
        href={href}
        prepTime={prepTime}
        description={description}
      />
    </div>
  );
}
