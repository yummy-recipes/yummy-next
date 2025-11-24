import { describe, it, expect } from "vitest";
import { markdownToHtml } from "./markdown";

describe("markdownToHtml", () => {
  it("renders header to styled header", async () => {
    const result = await markdownToHtml(`# Hello, world!`);

    expect(result).toBe(`<h1 class='text-2xl my-4'>Hello, world!</h1>`);
  });

  it("renders list as a list", async () => {
    const result = await markdownToHtml(`
 - a
 - b
    `);

    expect(result).toMatchInlineSnapshot(
      `"<ul><li class="flex items-center gap-3 mb-2"><div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>a</li><li class="flex items-center gap-3 mb-2"><div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>b</li></ul>"`,
    );
  });

  it("renders paragraph inside list without numbers", async () => {
    const result = await markdownToHtml(`
 - This is item 1.

 - This is item 2.
    `);

    expect(result).toMatchInlineSnapshot(
      `"<ul><li class="flex items-center gap-3 mb-2"><div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>This is item 1.</li><li class="flex items-center gap-3 mb-2"><div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>This is item 2.</li></ul>"`,
    );
  });

  it("renders paragraphs", async () => {
    const result = await markdownToHtml(`
This is paragraph 1.

This is paragraph 2.

This is paragraph 3.
    `);

    expect(result).toMatchInlineSnapshot(`
      "<p class='my-4'>This is paragraph 1.</p><p class='my-4'>This is paragraph 2.</p><p class='my-4'>This is paragraph 3.
          </p>"
    `);
  });

  describe("when paragraphNumbers is true", () => {
    it("renders paragraphs with numbers", async () => {
      const result = await markdownToHtml(
        `
This is paragraph 1.

This is paragraph 2.

This is paragraph 3.
`,
        { paragraphNumbers: true },
      );

      expect(result).toMatchInlineSnapshot(
        `"<div class="flex my-4"><span class='font-mono text-gray-400 mr-2'>01</span><p>This is paragraph 1.</p></div><div class="flex my-4"><span class='font-mono text-gray-400 mr-2'>02</span><p>This is paragraph 2.</p></div><div class="flex my-4"><span class='font-mono text-gray-400 mr-2'>03</span><p>This is paragraph 3.</p></div>"`,
      );
    });
  });
});
