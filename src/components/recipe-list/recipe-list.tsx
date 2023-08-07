export function RecipeList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 place-items-center">
      {children}
    </div>
  )
}
