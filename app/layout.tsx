import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/bottom-nav'
import { InstallPrompt } from '@/components/install-prompt'
import { Header } from '@/components/header'
import { LanguageProvider } from '@/components/language-provider'
import { FESTIVAL_NAME } from '@/lib/data'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: FESTIVAL_NAME,
  description: 'Program a harmonogram festivalu Shreditup 4–6 september 2026',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: FESTIVAL_NAME,
    startupImage: '/icon-512.png',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#09090b',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={geistSans.variable}>
      <body className="flex min-h-svh flex-col bg-background text-foreground antialiased">
        <LanguageProvider>
          <Header />
          <InstallPrompt />
          <main className="flex-1 pb-20">{children}</main>
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  )
}
