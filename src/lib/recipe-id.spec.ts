import { describe, it, expect } from "vitest";
import { getRecipeId } from "./recipe-id";

describe("getRecipeId", () => {
  it("computes a stable base64 id from a slug", () => {
    const expected = Buffer.from("V1-recipe-chocolate-cake").toString("base64");
    expect(getRecipeId("chocolate-cake")).toBe(expected);
  });

  it("produces different ids for different slugs", () => {
    expect(getRecipeId("chocolate-cake")).not.toBe(getRecipeId("vanilla-cake"));
  });

  it("is deterministic for the same slug", () => {
    expect(getRecipeId("chocolate-cake")).toBe(getRecipeId("chocolate-cake"));
  });

  it("throws for an empty string slug", () => {
    expect(() => getRecipeId("")).toThrow("Invalid recipe slug");
  });

  it("throws for a non-string slug", () => {
    // Runtime data (e.g. from an untyped source) can defeat the type system,
    // so exercise the guard the way it would actually be hit.
    expect(() => getRecipeId(undefined as unknown as string)).toThrow("Invalid recipe slug");
    expect(() => getRecipeId(null as unknown as string)).toThrow("Invalid recipe slug");
    expect(() => getRecipeId(123 as unknown as string)).toThrow("Invalid recipe slug");
  });
});
