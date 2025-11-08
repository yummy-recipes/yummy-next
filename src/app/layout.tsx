import Header from "./header";
import { Exo } from "next/font/google";
import "./globals.css";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { Search } from "@/components/search/search";
import { cookies } from "next/headers";
import { CookieBanner } from "@/components/cookie-banner/cookie-banner";
import { StatsigBootstrapProvider } from "@statsig/next";

const exo = Exo({ subsets: ["latin"] });

export const metadata = {
  title: "Kuchnia Yummy",
  description: "Przepisy na pyszne dania",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const stableID = cookieStore.get("s_stableID")?.value || "anonymous";

  return (
    <html lang="en">
      <body className={exo.className}>
        <StatsigBootstrapProvider
          clientKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!}
          serverKey={process.env.STATSIG_SERVER_KEY!}
          user={{ customIDs: { stableID } }}
          useCookie={false}
        >
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

          <CookieBanner />
        </StatsigBootstrapProvider>
      </body>
    </html>
  );
}
