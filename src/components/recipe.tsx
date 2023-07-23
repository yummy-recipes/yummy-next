import { markdownToHtml } from '@/lib/markdown'

interface Props {
  title: string
  ingredients: { id: number, content: string }[]
  instructions: { id: number, content: string }[]
}

export function Recipe({ title, ingredients, instructions }: Props) {
  return (
    <div>
      <h1 className="text-lg m-2">{title}</h1>

      <div className="border p-2 m-2">
        {ingredients.map(ingredient => (
          <div key={ingredient.id} dangerouslySetInnerHTML={{ __html: markdownToHtml(ingredient.content) }}></div>
        ))}
      </div>

      <div className="border p-2 m-2">
        {instructions.map(instruction => (
          <div key={instruction.id} dangerouslySetInnerHTML={{ __html: markdownToHtml(instruction.content) }}></div>
        ))}
      </div>
    </div>
  )
}
