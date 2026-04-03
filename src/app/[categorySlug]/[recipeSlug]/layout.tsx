import { notFound } from "next/navigation";
import { prisma } from "@/data";
import { markdownToHtml } from "@/lib/markdown";
import { Recipe } from "@/components/recipe/recipe";

interface Params {
  categorySlug: string;
  recipeSlug: string;
}

interface Props {
  params: Promise<Params>;
  children: React.ReactNode;
}

interface RecipeBlock {
  title: string | null;
  content: string;
}

const markdownHasHeading = (content: string) =>
  /(^|\n)\s{0,3}#{1,3}\s+|<h[1-3][\s>]/im.test(content);

const mergeMarkdownBlocks = (blocks: RecipeBlock[]) =>
  blocks
    .map((block) => {
      if (block.title && !markdownHasHeading(block.content)) {
        return `## ${block.title}\n\n${block.content}`;
      }

      return block.content;
    })
    .join("\n\n");

export default async function Layout({ params, children }: Props) {
  const { categorySlug, recipeSlug } = await params;
  const category = await prisma.category.findUnique({
    where: {
      slug: categorySlug,
    },
  });

  if (!category) {
    return notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: {
      slug: recipeSlug,
    },
    include: {
      category: true,
      instructions: true,
      ingredients: true,
      galleryImages: true,
    },
  });

  if (!recipe) {
    return notFound();
  }

  const ingredients = await markdownToHtml(
    mergeMarkdownBlocks(recipe.ingredients),
  );

  const instructions = await markdownToHtml(
    mergeMarkdownBlocks(recipe.instructions),
    {
      paragraphNumbers: true,
    },
  );

  console.log("instructions", mergeMarkdownBlocks(recipe.instructions));

  return (
    <div className="max-w-7xl mx-auto">
      <Recipe
        title={recipe.title}
        coverImage={recipe.coverImage}
        coverImageBlurDataUrl={recipe.coverImageBlurDataUrl}
        galleryImages={recipe.galleryImages}
        slug={recipe.slug}
        categorySlug={recipe.category.slug}
        ingredients={ingredients}
        instructions={instructions}
      />
      {children}
    </div>
  );
}
