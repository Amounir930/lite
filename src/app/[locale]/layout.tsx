import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { cn } from "@/utils/cn";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WhatSaaS Lite | Modern CRM",
  description: "High-performance WhatsApp CRM for modern teams",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // 🛡️ Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 📖 Fetch messages for the SPECIFIC locale
  const messages = await getMessages({ locale });

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} data-theme="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans selection:bg-primary/30 selection:text-primary transition-colors duration-300",
          outfit.variable,
          inter.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
