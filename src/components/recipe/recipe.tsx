import Image from "next/image";
import { markdownToHtml } from "@/lib/markdown";

interface Props {
  title: string;
  coverImage: string;
  ingredients: { id: number; content: string }[];
  instructions: { id: number; content: string }[];
}

export async function Recipe({
  title,
  coverImage,
  ingredients,
  instructions,
}: Props) {
  return (
    <div className="flex flex-col w-full">
      <div className="my-12">
        <h1 className="text-gradient uppercase inline text-4xl">{title}</h1>
      </div>

      <Image
        src={coverImage}
        width={40}
        height={30}
        alt={`Photo of ${title}`}
      />

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
