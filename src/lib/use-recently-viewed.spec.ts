import { describe, it, expect, beforeEach, vi } from "vitest";
import { type } from "arktype";
import {
  recentlyViewedRecipesArraySchema,
  computeUpdatedRecipes,
  RecentlyViewedRecipe,
} from "./use-recently-viewed";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

describe("arktype validation for recently viewed recipes", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should validate correct recipe data structure", () => {
    const validRecipes = [
      {
        id: "1",
        slug: "test-recipe",
        title: "Test Recipe",
        headline: "A test recipe",
        preparationTime: 30,
        categorySlug: "desserts",
        coverImage: "https://example.com/image.jpg",
      },
    ];

    const result = recentlyViewedRecipesArraySchema(validRecipes);
    expect(result instanceof type.errors).toBe(false);
    expect(result).toEqual(validRecipes);
  });

  it("should reject recipe data with missing required fields", () => {
    const invalidRecipes = [
      {
        id: "1",
        slug: "test-recipe",
        // Missing: title, headline, preparationTime, categorySlug, coverImage
      },
    ];

    const result = recentlyViewedRecipesArraySchema(invalidRecipes);
    expect(result instanceof type.errors).toBe(true);
  });

  it("should reject recipe data with wrong types", () => {
    const invalidRecipes = [
      {
        id: 1, // Should be string
        slug: "test-recipe",
        title: "Test Recipe",
        headline: "A test recipe",
        preparationTime: "30", // Should be number
        categorySlug: "desserts",
        coverImage: "https://example.com/image.jpg",
      },
    ];

    const result = recentlyViewedRecipesArraySchema(invalidRecipes);
    expect(result instanceof type.errors).toBe(true);
  });

  it("should reject non-array data", () => {
    const invalidData = {
      id: "1",
      slug: "test-recipe",
      title: "Test Recipe",
    };

    const result = recentlyViewedRecipesArraySchema(invalidData);
    expect(result instanceof type.errors).toBe(true);
  });

  it("should validate empty array", () => {
    const emptyArray: any[] = [];
    const result = recentlyViewedRecipesArraySchema(emptyArray);
    expect(result instanceof type.errors).toBe(false);
    expect(result).toEqual([]);
  });

  it("should validate multiple recipes", () => {
    const validRecipes = [
      {
        id: "1",
        slug: "test-recipe-1",
        title: "Test Recipe 1",
        headline: "A test recipe 1",
        preparationTime: 30,
        categorySlug: "desserts",
        coverImage: "https://example.com/image1.jpg",
      },
      {
        id: "2",
        slug: "test-recipe-2",
        title: "Test Recipe 2",
        headline: "A test recipe 2",
        preparationTime: 45,
        categorySlug: "main-dishes",
        coverImage: "https://example.com/image2.jpg",
      },
    ];

    const result = recentlyViewedRecipesArraySchema(validRecipes);
    expect(result instanceof type.errors).toBe(false);
    expect(result).toEqual(validRecipes);
  });

  it("should reject array with one valid and one invalid recipe", () => {
    const mixedRecipes = [
      {
        id: "1",
        slug: "test-recipe-1",
        title: "Test Recipe 1",
        headline: "A test recipe 1",
        preparationTime: 30,
        categorySlug: "desserts",
        coverImage: "https://example.com/image1.jpg",
      },
      {
        id: 2, // Invalid
        slug: "test-recipe-2",
        title: "Test Recipe 2",
        headline: "A test recipe 2",
        preparationTime: 45,
        categorySlug: "main-dishes",
        coverImage: "https://example.com/image2.jpg",
      },
    ];

    const result = recentlyViewedRecipesArraySchema(mixedRecipes);
    expect(result instanceof type.errors).toBe(true);
  });
});

const makeRecipe = (id: string): RecentlyViewedRecipe => ({
  id,
  slug: `recipe-${id}`,
  title: `Recipe ${id}`,
  headline: `Headline ${id}`,
  preparationTime: 30,
  categorySlug: "desserts",
  coverImage: `https://example.com/${id}.jpg`,
});

describe("computeUpdatedRecipes", () => {
  it("adds a new recipe to the front of an empty list", () => {
    const recipe = makeRecipe("a");
    const result = computeUpdatedRecipes([], recipe);
    expect(result).toEqual([recipe]);
  });

  it("adds a new recipe to the front of an existing list", () => {
    const existing = [makeRecipe("b"), makeRecipe("c")];
    const recipe = makeRecipe("a");
    const result = computeUpdatedRecipes(existing, recipe);
    expect(result[0]).toEqual(recipe);
    expect(result).toHaveLength(3);
  });

  it("pulls an already-existing recipe to the top", () => {
    const recipeA = makeRecipe("a");
    const recipeB = makeRecipe("b");
    const recipeC = makeRecipe("c");
    const existing = [recipeA, recipeB, recipeC];

    const result = computeUpdatedRecipes(existing, recipeB);

    expect(result[0]).toEqual(recipeB);
    expect(result).toHaveLength(3);
    // Recipe B should appear exactly once (no duplicate)
    expect(result.filter((r) => r.id === "b")).toHaveLength(1);
    expect(result[1]).toEqual(recipeA);
    expect(result[2]).toEqual(recipeC);
  });

  it("pulls the last recipe in the list to the top", () => {
    const recipeA = makeRecipe("a");
    const recipeB = makeRecipe("b");
    const recipeC = makeRecipe("c");
    const existing = [recipeA, recipeB, recipeC];

    const result = computeUpdatedRecipes(existing, recipeC);

    expect(result[0]).toEqual(recipeC);
    expect(result[1]).toEqual(recipeA);
    expect(result[2]).toEqual(recipeB);
  });

  it("does not exceed maxItems when adding a new recipe", () => {
    const existing = [
      makeRecipe("a"),
      makeRecipe("b"),
      makeRecipe("c"),
      makeRecipe("d"),
      makeRecipe("e"),
    ];
    const newRecipe = makeRecipe("f");

    const result = computeUpdatedRecipes(existing, newRecipe, 5);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual(newRecipe);
    // The last existing recipe should be dropped
    expect(result.find((r) => r.id === "e")).toBeUndefined();
  });

  it("does not lose items beyond maxItems when pulling existing recipe to top", () => {
    const existing = [
      makeRecipe("a"),
      makeRecipe("b"),
      makeRecipe("c"),
      makeRecipe("d"),
      makeRecipe("e"),
    ];
    // Pull recipe "c" (middle) to top — total stays at 5, nothing dropped
    const result = computeUpdatedRecipes(existing, makeRecipe("c"), 5);

    expect(result).toHaveLength(5);
    expect(result[0].id).toBe("c");
    expect(result.map((r) => r.id)).toEqual(["c", "a", "b", "d", "e"]);
  });
});
