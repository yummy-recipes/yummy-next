export function RecipeList({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-4 place-items-center">
      {children}
    </div>
  )
}
