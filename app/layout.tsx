import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useTranslation } from "./i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polaris",
  description: "May the stars guide you"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    i18n: { language }
  } = await useTranslation();

  return (
    <html lang={language}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
