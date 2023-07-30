interface Props {
  query?: string
}

export function SearchForm({ query }: Props) {
  return (
    <form action="/search" className="flex justify-center align-center">
      <div className="border">
        <input name="query" defaultValue={query} />
        <button type="submit">Search</button>
      </div>
    </form>
  )
}
