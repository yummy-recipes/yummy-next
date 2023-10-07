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
    <div className='flex flex-col w-full'>
      <div className='my-12'>
        <h1 className="text-gradient uppercase inline text-4xl">{title}</h1>
      </div>

      <Image src={coverImage} width={40} height={30} alt={`Photo of ${title}`} />

      <div className="p-2 m-2">
        {ingredients.map(ingredient => (
          <div key={ingredient.id} dangerouslySetInnerHTML={{ __html: markdownToHtml(ingredient.content) }}></div>
        ))}
      </div>

      <div className="p-2 m-2">
        {instructions.map(instruction => (
          <div key={instruction.id} dangerouslySetInnerHTML={{ __html: markdownToHtml(instruction.content) }}></div>
        ))}
      </div>
    </div>
  )
}
