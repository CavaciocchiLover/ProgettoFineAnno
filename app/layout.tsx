import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import {Link} from "@heroui/link";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
          className={clsx(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.className,
          )}
      >
      <Providers themeProps={{attribute: "class", defaultTheme: "light"}}>
        {children}
      </Providers>
      <footer className="flex w-full flex-col"
              style={{ fontFamily: "IBM Plex Sans" }}>
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
          <div className="flex flex-wrap items-center justify-center">
            <span>Trainsoup</span>
          </div>
          <span className="w-px h-px block" aria-hidden style={{marginLeft: "0.25", marginTop: "1.5"}}></span>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/page.tsx" color="foreground" size="sm">Home</Link>
            <Link href="/page.tsx" color="foreground" size="sm">Login</Link>
            <Link href="/page.tsx" color="foreground" size="sm">Supporto</Link>
            <Link href="/page.tsx" color="foreground" size="sm">Area riservata</Link>
          </div>
          <span className="w-px h-px block" aria-hidden style={{marginLeft: "0.25", marginTop: "1.5"}}></span>
          <p className="mt-1 text-center text-small">
            © 2025 Trainsoup. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
      </body>

    </html>
  );
}
