"use client";

import { useEffect, useState, useRef } from "react";

export interface RecentlyViewedRecipe {
  id: number;
  slug: string;
  title: string;
  headline: string;
  preparationTime: number;
  categorySlug: string;
  coverImage: string;
}

const STORAGE_KEY = "recentlyViewedRecipes";
const MAX_ITEMS = 5;

function getStoredRecipes(): RecentlyViewedRecipe[] {
  if (typeof window === "undefined") {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading recently viewed recipes:", error);
  }
  return [];
}

export function useRecentlyViewed() {
  const [recipes, setRecipes] = useState<RecentlyViewedRecipe[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only load once on mount to avoid hydration mismatch
    // This setState is intentional - we're syncing external state (localStorage) with React state
    if (!isInitialized.current) {
      isInitialized.current = true;
      const stored = getStoredRecipes();
      if (stored.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecipes(stored);
      }
    }
  }, []);

  const addRecipe = (recipe: RecentlyViewedRecipe) => {
    try {
      setRecipes((prevRecipes) => {
        // Remove the recipe if it already exists
        const filtered = prevRecipes.filter((r) => r.id !== recipe.id);
        // Add the new recipe at the beginning
        const updated = [recipe, ...filtered].slice(0, MAX_ITEMS);
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
        return updated;
      });
    } catch (error) {
      console.error("Error saving recently viewed recipe:", error);
    }
  };

  return { recipes, addRecipe };
}
