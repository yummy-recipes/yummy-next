import Header from './header'
import { PrismaClient } from '@prisma/client'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { Search } from '@/components/search/search'

const prisma = new PrismaClient()
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await prisma.category.findMany()

  const links = categories.map((category) => ({ href: `/${category.slug}`, label: category.title }))

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header>
          <div className="w-96">
            <Search />
          </div>
        </Header>

        <div className="w-full">
          <div className="py-4 px-4 pb-12">
            {links.map(link => (
              <Link key={link.label} className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          {children}
        </div>
      </body>
    </html>
  )
}
