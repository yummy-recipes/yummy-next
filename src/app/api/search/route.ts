import { search } from '@/lib/search'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('query')

  if (!query || query.length < 3) {
    return new Response(JSON.stringify({ data: [] }))
  }

  const recipes = await search(query)

  const data = recipes.map(recipe => ({
    id: recipe.id,
    label: recipe.title,
    value: `/${recipe.category.slug}/${recipe.slug}`
  }))

  return new Response(JSON.stringify({ data }))
}
