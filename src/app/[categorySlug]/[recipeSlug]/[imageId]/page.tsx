import { prisma } from "@/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GalleryDialog } from "./dialog";

interface Params {
  categorySlug: string;
  recipeSlug: string;
  imageId: string;
}

interface Props {
  params: Promise<Params>;
}
export default async function Page({ params }: Props) {
  const { categorySlug, recipeSlug, imageId } = await params;

  const galleryImage = await prisma.recipeGalleryImage.findUnique({
    where: {
      id: parseInt(imageId),
    },
  });

  if (!galleryImage) {
    return notFound();
  }

  return (
    <GalleryDialog categorySlug={categorySlug} recipeSlug={recipeSlug}>
      <Image
        className="w-full object-cover"
        src={galleryImage.imageUrl}
        width={600}
        height={400}
        alt={`Zdjęcie`}
      />
    </GalleryDialog>
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
