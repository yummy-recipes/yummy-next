import Link from "next/link";
import Image from "next/image";
interface Props {
  href: string;
  title: string;
  coverImage: string;
}

export function RecipeListItem({ href, title, coverImage }: Props) {
  return (
    <Link
      className="group flex flex-col w-full border h-full animation"
      href={href}
    >
      <div className="overflow-hidden">
        <Image
          src={coverImage}
          width={400}
          height={300}
          className="scale-100 group-hover:scale-105 group-focus:scale-105 group-active:scale-125 group-active:duration-75 transition-transform ease-in aspect-cover object-cover w-full"
          alt={`Photo of ${title}`}
        />
      </div>
      <div className="px-4 flex-1 py-2 w-full bg-slate-50 group-hover:bg-blue-400 group-hover:text-slate-50 transition-colors">
        {title}
      </div>
    </Link>
  );
}
