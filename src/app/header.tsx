import Link from 'next/link'

interface Props {
  children: React.ReactNode
}

export default function Header({ children }: Props) {
  return (
    <div className="w-full text-gray-700 bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800">
      <div className="flex flex-col mx-auto md:items-center md:justify-between md:flex-row">
        <div className="py-4 flex flex-row items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-75">Yummy</Link>
        </div>

        <div className='flex justify-center'>
          {children}
        </div>
      </div >
    </div >
  )
}
