import { prisma } from "@/data";
import Image from "next/image";
import { notFound } from "next/navigation";
interface Params {
  categorySlug: string;
  recipeSlug: string;
  imageId: string;
}

interface Props {
  params: Promise<Params>;
}
export default async function Page({ params }: Props) {
  const { imageId } = await params;

  const galleryImage = await prisma.recipeGalleryImage.findUnique({
    where: {
      id: parseInt(imageId),
    },
  });

  if (!galleryImage) {
    return notFound();
  }

  return (
    <dialog id="gallery-modal" suppressHydrationWarning>
      <Image
        className="w-12 object-cover"
        src={galleryImage.imageUrl}
        width={300}
        height={200}
        alt={`Zdjęcie`}
      />

      <script>document.getElementById("gallery-modal").showModal();</script>
    </dialog>
  );
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
      galleryImages: true,
    },
  });

  return (
    recipes.flatMap((recipe) =>
      recipe.galleryImages?.map((galleryImage) => ({
        categorySlug: recipe.category.slug,
        recipeSlug: recipe.slug,
        imageId: galleryImage.id.toString(),
      })),
    ) ?? []
  );
}
