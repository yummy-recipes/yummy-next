import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { RecipeListItem } from '@/components/recipe-list-item/recipe-list-item'
import { RecipeList } from '@/components/recipe-list/recipe-list'

const prisma = new PrismaClient()

const tagSlugs = ['makaron', 'wegetarianskie', 'drozdzowe', 'ciasta']

const bySlugPosition = (tag1: { slug: string }, tag2: { slug: string }) => tagSlugs.indexOf(tag1.slug) - tagSlugs.indexOf(tag2.slug)

const upperCaseFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

export default async function Home() {
  const tags = await prisma.tag.findMany({ where: { slug: { in: tagSlugs } } })

  const groupLoaders = tags.sort(bySlugPosition).map(async (tag) => {
    const recipes = await prisma.recipe.findMany({
      where: {
        tags: {
          some: {
            id: tag.id
          }
        }
      },
      take: 4,
      orderBy: {
        publishedAt: 'desc'
      },
      include: {
        category: true,
      }
    })

    return {
      tag,
      recipes
    }
  })

  const groups = await Promise.all(groupLoaders)

  return (
    <main className="flex flex-col items-center gap-8">
      <div className='w-full my-12'>
        <h1 className='text-gradient uppercase text-4xl inline'>
          Przepisy kulinarne
        </h1>
        <h2 className='text-lg'>
          Kolekcja 118 domowych przepisów na pyszne dania
        </h2>
      </div>

      {groups.map(({ tag, recipes }) => (
        <div className="w-full flex flex-col gap-4" key={tag.id}>
          <h2 className="text-2xl">{upperCaseFirstLetter(tag.title)}</h2>

          <RecipeList>
            {recipes.map((recipe) => (
              <RecipeListItem
                key={recipe.id}
                href={`/${recipe.category.slug}/${recipe.slug}`}
                coverImage={recipe.coverImage}
                title={recipe.title}
              />
            ))}
          </RecipeList>

          <div className="flex justify-end">
            <Link href={`/tag/${tag.slug}`} className="text-md text-blue-600">Zobacz wszystkie w kategorii {tag.title}</Link>
          </div>
        </div>
      ))}

    </main >
  )
}
