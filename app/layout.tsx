import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/bottom-nav'
import { NotificationButton } from '@/components/notification-button'
import { InstallPrompt } from '@/components/install-prompt'
import { FESTIVAL_NAME } from '@/lib/data'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: FESTIVAL_NAME,
  description: 'Program a harmonogram festivalu Shreditup 4–6 september 2026',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: FESTIVAL_NAME,
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
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <span className="text-lg font-bold tracking-tight">{FESTIVAL_NAME}</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">4–6 Sep 2026</span>
            <NotificationButton />
          </div>
        </header>

        <InstallPrompt />
        <main className="flex-1 pb-20">{children}</main>

        <BottomNav />
      </body>
    </html>
  )
}
