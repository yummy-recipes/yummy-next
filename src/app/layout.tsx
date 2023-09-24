import Header from './header'
import { PrismaClient } from '@prisma/client'
import { Inter } from 'next/font/google'
import './globals.css'
import { Search } from '@/components/search/search'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Kuchnia Yummy',
  description: 'Przepisy na pyszne dania',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-7xl mx-auto">
          <Header>
            <div className="w-full sm:w-96 max-w-sm">
              <Search />
            </div>
          </Header>

          <div className="w-full mt-3">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
