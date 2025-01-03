interface Props {
  title: string;
  href: string;
  prepTime: number;
  description: string;
}
export function MenuSectionItem({ title, href, prepTime, description }: Props) {
  return (
    <a href={href} className="group block">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-xl font-serif text-blue-800 group-hover:text-blue-600 inline-block mr-4">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-6 text-gray-600 text-sm min-w-fit ml-4">
          <div className="flex items-center">
            {/* <Clock size={14} className="mr-1" /> */}
            <span>{prepTime}min</span>
          </div>
          <div className="flex items-center">
            {/* <Users size={14} className="mr-1" /> */}
            {/* <span>{recipe.servings}</span> */}
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm italic">{description}</p>
    </a>
  );
}
