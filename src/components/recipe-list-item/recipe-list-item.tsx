import Link from 'next/link'
import Image from 'next/image'
interface Props {
  href: string
  title: string
  coverImage: string
}

export function RecipeListItem({ href, title, coverImage }: Props) {
  return (
    <Link className='block w-full border relative' href={href}>
      <Image src={coverImage} width={400} height={300} className='aspect-cover object-cover' alt={`Photo of ${title}`} />
      <span className='px-4 py-2 absolute bottom-0 w-full bg-slate-50'>{title}</span>
    </Link>
  )
}
