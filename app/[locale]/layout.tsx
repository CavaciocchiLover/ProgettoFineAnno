import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";

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

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{ locale: string }>
}) {
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
          className={clsx(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.className,
          )}
      >
      <Providers themeProps={{attribute: "class", defaultTheme: "light"}} locale={locale}>
          <NextIntlClientProvider>
              {children}
          </NextIntlClientProvider>
      </Providers>
      </body>

    </html>
  );
}
