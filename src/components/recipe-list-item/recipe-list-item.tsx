import Link from 'next/link'
import Image from 'next/image'
interface Props {
  href: string
  title: string
  coverImage: string
}

export function RecipeListItem({ href, title, coverImage }: Props) {
  return (
    <Link className='flex flex-col w-full border h-full' href={href}>
      <Image src={coverImage} width={400} height={300} className='aspect-cover object-cover w-full' alt={`Photo of ${title}`} />
      <span className='px-4 flex-1 py-2 w-full bg-slate-50'>{title}</span>
    </Link>
  )
}
