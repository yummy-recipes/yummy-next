interface Props {
  title: string;
  children: React.ReactNode;
}

export function MenuSection({ title, children }: Props) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-serif italic mb-6 text-gray-800 border-b border-gray-200 pb-2">
        {title}
      </h2>
      <div className="space-y-8">{children}</div>
    </div>
  );
}
