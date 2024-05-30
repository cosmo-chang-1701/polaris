import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getTranslation } from '@/app/i18n'

import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Polaris'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const {
    i18n: { language }
  } = await getTranslation()

  return (
    <html lang={language}>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
