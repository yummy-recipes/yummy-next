import Link from 'next/link'
interface Props {
  href: string
  title: string
}

export function RecipeListItem({ href, title }: Props) {
  return (
    <Link className='block w-full border px-2 py-1' href={href}>
      {title}
    </Link>
  )
}
