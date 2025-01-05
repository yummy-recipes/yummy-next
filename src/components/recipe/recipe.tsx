import Image from "next/image";
import { markdownToHtml } from "@/lib/markdown";

interface Props {
  title: string;
  coverImage: string;
  coverImageBlurDataUrl: string | null;
  ingredients: { id: number; content: string }[];
  instructions: { id: number; content: string }[];
}

export async function Recipe({
  title,
  coverImage,
  coverImageBlurDataUrl,
  ingredients,
  instructions,
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
    </div>
  );
}
