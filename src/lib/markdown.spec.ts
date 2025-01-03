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

    expect(result).toMatchInlineSnapshot(`
      "<ul class='list-disc list-inside'><li>a</li>
      <li>b</li>
      </ul>"
    `);
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
        { paragraphNumbers: true }
      );

      expect(result).toMatchInlineSnapshot(`"<div class="flex my-4"><span class='font-mono text-gray-400 mr-2'>01</span><p>This is paragraph 1.</p></div><div class="flex my-4"><span class='font-mono text-gray-400 mr-2'>02</span><p>This is paragraph 2.</p></div><div class="flex my-4"><span class='font-mono text-gray-400 mr-2'>03</span><p>This is paragraph 3.</p></div>"`);
    });
  });
});
