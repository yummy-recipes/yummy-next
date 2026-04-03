"use client";

import { useEffect } from "react";
import {
  useRecentlyViewed,
  RecentlyViewedRecipe,
} from "@/lib/use-recently-viewed";

interface Props {
  recipe: RecentlyViewedRecipe;
}

export function RecentlyViewedTracker({ recipe }: Props) {
  const { addRecipe } = useRecentlyViewed();

  useEffect(() => {
    addRecipe(recipe);
  }, [addRecipe, recipe]);

  return null;
}
