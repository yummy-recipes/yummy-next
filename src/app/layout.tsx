import Header from "./header";
import { Inter } from "next/font/google";
import "./globals.css";
import { Search } from "@/components/search/search";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kuchnia Yummy",
  description: "Przepisy na pyszne dania",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 2xl:px-0">
          <Header>
            <div className="w-full sm:w-96 max-w-sm">
              <Search />
            </div>
          </Header>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 2xl:px-0">
          <div className="w-full mt-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
