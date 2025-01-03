import { MarkedToken, Tokens, marked } from "marked";

class TailwindRenderer extends marked.Renderer {
  protected paragraphIndex: number;
  protected insideList: boolean = false;

  constructor({ paragraphNumbers }: { paragraphNumbers?: boolean }) {
    super();
    this.paragraphIndex = paragraphNumbers ? 0 : -1;
  }
  heading({ tokens, depth }: Tokens.Heading) {
    const text = this.parser.parseInline(tokens);
    return `<h${depth} class='text-2xl my-4'>${text}</h${depth}>`;
  }
  paragraph({ text }: Tokens.Paragraph): string {
    if (this.insideList) {
      return text;
    }

    if (this.paragraphIndex === -1) {
      return `<p class='my-4'>${text}</p>`;
    }

    const index = this.paragraphIndex++;
    const counterSpan = `<span class='font-mono text-gray-400 mr-2'>${String(
      index + 1
    ).padStart(2, "0")}</span>`;

    return `<div class="flex my-4">${counterSpan}<p>${text}</p></div>`;
  }

  list({ ordered, items }: Tokens.List): string {
    let body = "";
    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      this.insideList = true;
      body += this.listitem(item);
      this.insideList = false;
    }

    if (ordered) {
      return `<ol class='list-decimal list-inside'>${body}</ol>`;
    }

    return `<ul class='list-disc list-inside'>${body}</ul>`;
  }
}

interface Options {
  paragraphNumbers?: boolean;
}
export async function markdownToHtml(
  markdown: string,
  options: Options = {}
): Promise<string> {
  return marked.parse(markdown, {
    renderer: new TailwindRenderer(options),
  });
}
