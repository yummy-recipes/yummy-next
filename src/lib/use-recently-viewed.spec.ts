import { describe, it, expect, beforeEach, vi } from "vitest";
import { type } from "arktype";
import { recentlyViewedRecipesArraySchema } from "./use-recently-viewed";

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
