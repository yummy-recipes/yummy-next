import { marked } from "marked";

class TailwindRenderer extends marked.Renderer {
  heading(text: string, level: number) {
    return `<h${level} class='text-2xl my-4'>${text}</h${level}>`;
  }
  paragraph(text: string): string {
    return `<p class='my-2'>${text}</p>`;
  }

  list(
    this: marked.Renderer<never> | marked.RendererThis,
    body: string,
    ordered: boolean,
    start: number
  ): string {
    if (ordered) {
      return `<ol class='list-decimal list-inside'>${body}</ol>`;
    }

    return `<ul class='list-disc list-inside'>${body}</ul>`;
  }
}

const renderer = new TailwindRenderer();

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, {
    mangle: false,
    headerIds: false,
    renderer,
  });
}
