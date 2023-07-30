import Image from 'next/image'
import { markdownToHtml } from '@/lib/markdown'

interface Props {
  title: string
  coverImage: string
  ingredients: { id: number, content: string }[]
  instructions: { id: number, content: string }[]
}

export function Recipe({ title, coverImage, ingredients, instructions }: Props) {
  return (
    <div>
      <Image src={coverImage} width={40} height={30} alt={`Photo of ${title}`} />
      
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
