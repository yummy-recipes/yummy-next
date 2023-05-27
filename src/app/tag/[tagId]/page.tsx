interface Params {
  tagId: string
}

interface Props {
  params: Params
}

export default function Page({ params }: Props) {
  return <div>Tag {params.tagId}</div>
}
