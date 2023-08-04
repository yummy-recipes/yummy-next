import Link from 'next/link'
import { SearchForm } from '@/components/search-form/search-form'
import { search } from '@/lib/search'

interface Props {
  searchParams: { query: string }
}

export default async function Home({ searchParams }: Props) {
  const { query } = searchParams

  const recipes = await search(query)

  return (
    <main className="flex flex-col items-center">
      <SearchForm query={query} />

      {recipes.map((recipe) => (
        <div key={recipe.id} className="flex place-items-center">
          <Link href={`/${recipe.category.slug}/${recipe.slug}`}>
            {recipe.title}
          </Link>
        </div>
      ))}
    </main >
  )
}
