import { marked } from "marked";

class TailwindRenderer extends marked.Renderer {
  protected paragraphIndex: number;
  constructor() {
    super();
    this.paragraphIndex = 0;
  }
  heading(text: string, level: number) {
    return `<h${level} class='text-2xl my-4'>${text}</h${level}>`;
  }
  paragraph(text: string): string {
    const index = this.paragraphIndex++;
    const counterSpan = `<span class='font-mono text-gray-400 mr-2'>${String(
      index + 1
    ).padStart(2, "0")}</span>`;

    return `<div class="flex my-4">${counterSpan}<p>${text}</p></div>`;
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

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, {
    mangle: false,
    headerIds: false,
    renderer: new TailwindRenderer(),
  });
}
