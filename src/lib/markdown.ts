import { Tokens, marked } from "marked";

class TailwindRenderer extends marked.Renderer {
  protected paragraphIndex: number;
  protected insideList: { ordered: boolean } | null = null;

  constructor({
    paragraphNumbers,
    ...options
  }: {
    paragraphNumbers?: boolean;
  }) {
    super(options);
    this.paragraphIndex = paragraphNumbers ? 0 : -1;
  }
  protected resetParagraphIndex() {
    if (this.paragraphIndex === -1) {
      return;
    }

    this.paragraphIndex = 0;
  }
  heading({ tokens, depth }: Tokens.Heading) {
    this.resetParagraphIndex();

    const text = this.parser.parseInline(tokens);
    return `<h${depth} class='text-2xl my-4'>${text}</h${depth}>`;
  }
  paragraph({ tokens }: Tokens.Paragraph): string {
    const text = this.parser.parseInline(tokens);

    if (this.insideList) {
      return text;
    }

    if (this.paragraphIndex === -1) {
      return `<p class='my-4'>${text}</p>`;
    }

    const index = this.paragraphIndex++;
    const counterSpan = `<span class='font-mono text-gray-400 mr-2'>${String(
      index + 1,
    ).padStart(2, "0")}</span>`;

    return `<div class="flex my-4">${counterSpan}<p>${text}</p></div>`;
  }

  list({ ordered, items }: Tokens.List): string {
    let body = "";
    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      this.insideList = { ordered };
      body += this.listitem(item);
      this.insideList = null;
    }

    if (ordered) {
      return `<ol class='list-decimal list-inside'>${body}</ol>`;
    }

    return `<ul>${body}</ul>`;
  }

  listitem(item: Tokens.ListItem): string {
    const text = this.parser.parse(item.tokens);
    if (this.insideList && !this.insideList.ordered) {
      return `<li class="flex items-center gap-3 mb-2"><div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>${text}</li>`;
    }

    return `<li>${text}</li>`;
  }

  // Reset the counter for each block element except space
  blockquote(tokens: Tokens.Blockquote): string {
    this.resetParagraphIndex();
    return super.blockquote(tokens);
  }
  code(tokens: Tokens.Code): string {
    this.resetParagraphIndex();
    return super.code(tokens);
  }
  html(tokens: Tokens.HTML | Tokens.Tag): string {
    this.resetParagraphIndex();
    return super.html(tokens);
  }

  hr(token: Tokens.Hr): string {
    this.resetParagraphIndex();
    return super.hr(token);
  }

  checkbox(tokens: Tokens.Checkbox): string {
    this.resetParagraphIndex();
    return super.checkbox(tokens);
  }
  table(tokens: Tokens.Table): string {
    this.resetParagraphIndex();
    return super.table(tokens);
  }

  tablerow(tokens: Tokens.TableRow): string {
    this.resetParagraphIndex();
    return super.tablerow(tokens);
  }
  tablecell(tokens: Tokens.TableCell): string {
    this.resetParagraphIndex();
    return super.tablecell(tokens);
  }
}

interface Options {
  paragraphNumbers?: boolean;
}
export async function markdownToHtml(
  markdown: string,
  options: Options = {},
): Promise<string> {
  return marked.parse(markdown, {
    renderer: new TailwindRenderer(options),
  });
}
