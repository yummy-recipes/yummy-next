import Image from "next/image";
import Link from "next/link";
import preview from "../../../.storybook/preview";

interface RecipeWrapperProps {
  slug: string;
  categorySlug: string;
  title: string;
  coverImage: string;
  coverImageBlurDataUrl: string | null;
  ingredients: { id: number; content: string }[];
  instructions: { id: number; content: string }[];
  galleryImages: { id: number; imageUrl: string; blurDataUrl: string | null }[];
}

// Non-async wrapper component for Storybook
function RecipeWrapper({
  slug,
  categorySlug,
  title,
  coverImage,
  coverImageBlurDataUrl,
  ingredients,
  instructions,
  galleryImages,
}: RecipeWrapperProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="mt-8 mb-8">
        <h1 className="text-gradient uppercase inline text-4xl">{title}</h1>
      </div>

      <div className="mb-4 md:w-1/2">
        <Image
          className="w-full max-h-32 object-cover"
          placeholder={coverImageBlurDataUrl ? "blur" : "empty"}
          blurDataURL={coverImageBlurDataUrl ?? undefined}
          src={coverImage}
          width={600}
          height={400}
          alt={`Zdjęcie ${title}`}
        />
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-2 m-2">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              dangerouslySetInnerHTML={{
                __html: ingredient.content,
              }}
            ></div>
          ))}
        </div>

        <div className="flex-1 p-2 m-2">
          {instructions.map((instruction) => (
            <div
              key={instruction.id}
              dangerouslySetInnerHTML={{
                __html: instruction.content,
              }}
            ></div>
          ))}
        </div>
      </div>

      {galleryImages && (
        <div>
          {galleryImages.map((galleryImage) => (
            <Link
              href={`/${categorySlug}/${slug}/${galleryImage.id}`}
              key={galleryImage.id}
              className="mb-4"
            >
              <Image
                className="w-12 object-cover"
                src={galleryImage.imageUrl}
                width={300}
                height={200}
                alt={`Zdjęcie ${title}`}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const meta = preview.meta({
  title: "UI/Recipe",
  component: RecipeWrapper,
  tags: ["autodocs"],
});

const imageUrl =
  "https://res.cloudinary.com/dddjfvneq/image/fetch/f_auto,c_limit,w_800,q_auto/https://media.graphassets.com/bVmSWqhQOuOiBenDcvQO";

export default meta;

export const Primary = meta.story({
  args: {
    slug: "example-recipe",
    categorySlug: "desserts",
    title: "Delicious Chocolate Cake",
    coverImage: imageUrl,
    coverImageBlurDataUrl: null,
    ingredients: [
      {
        id: 1,
        content:
          '<h2 class=\'text-2xl my-4\'>Ingredients</h2><ul><li class="flex items-center gap-3 mb-2"><div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>2 cups flour</li><li class="flex items-center gap-3 mb-2"><div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>1 cup sugar</li><li class="flex items-center gap-3 mb-2"><div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>3/4 cup cocoa powder</li><li class="flex items-center gap-3 mb-2"><div class="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>2 eggs</li></ul>',
      },
    ],
    instructions: [
      {
        id: 1,
        content:
          "<h2 class='text-2xl my-4'>Instructions</h2><div class=\"flex my-4\"><span class='font-mono text-gray-400 mr-2'>01</span><p>Preheat oven to 350°F.</p></div><div class=\"flex my-4\"><span class='font-mono text-gray-400 mr-2'>02</span><p>Mix all dry ingredients.</p></div><div class=\"flex my-4\"><span class='font-mono text-gray-400 mr-2'>03</span><p>Add eggs and mix well.</p></div>",
      },
    ],
    galleryImages: [
      {
        id: 1,
        imageUrl: imageUrl,
        blurDataUrl: null,
      },
      {
        id: 2,
        imageUrl: imageUrl,
        blurDataUrl: null,
      },
    ],
  },
});
