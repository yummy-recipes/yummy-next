import Image from "next/image";
import { markdownToHtml } from "@/lib/markdown";
import Link from "next/link";

interface Props {
  slug: string;
  categorySlug: string;
  title: string;
  coverImage: string;
  coverImageBlurDataUrl: string | null;
  ingredients: { id: number; content: string }[];
  instructions: { id: number; content: string }[];
  galleryImages: { id: number; imageUrl: string; blurDataUrl: string | null }[];
}

export async function Recipe({
  slug,
  categorySlug,
  title,
  coverImage,
  coverImageBlurDataUrl,
  ingredients,
  instructions,
  galleryImages,
}: Props) {
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
          {ingredients.map(async (ingredient) => (
            <div
              key={ingredient.id}
              dangerouslySetInnerHTML={{
                __html: await markdownToHtml(ingredient.content),
              }}
            ></div>
          ))}
        </div>

        <div className="flex-1 p-2 m-2">
          {instructions.map(async (instruction, index) => (
            <div
              key={instruction.id}
              dangerouslySetInnerHTML={{
                __html: await markdownToHtml(instruction.content, {
                  paragraphNumbers: true,
                }),
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
