export function RecipeList({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 place-items-center">
      {children}
    </div>
  )
}
