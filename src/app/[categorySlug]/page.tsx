import { notFound } from 'next/navigation';
import { prisma } from '@/data'

interface Params {
  categorySlug: string
}

interface Props {
  params: Params
}

export default async function Page({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: {
      slug: params.categorySlug
    }
  })

  if (!category) {
    return notFound()
  }

  return <div>Category {category.title}</div>
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany()

  return categories.map(category => ({
    categorySlug: category.slug
  }))
}
