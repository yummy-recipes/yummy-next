import { SearchForm } from '@/components/search-form/search-form'
import { search } from '@/lib/search'
import { RecipeListItem } from '@/components/recipe-list-item/recipe-list-item'
import { RecipeList } from '@/components/recipe-list/recipe-list'

interface Props {
  searchParams: { query: string }
}

export default async function Home({ searchParams }: Props) {
  const { query } = searchParams

  const recipes = await search(query)

  return (
    <main className="flex flex-col items-center">
      <SearchForm query={query} />

      <RecipeList>
        {recipes.map((recipe) => (
          <RecipeListItem
            key={recipe.id}
            href={`/${recipe.category.slug}/${recipe.slug}`}
            title={recipe.title}
          />
        ))}
      </RecipeList>
    </main >
  )
}
