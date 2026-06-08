import type { Metadata, Viewport } from "next";
import { Alfa_Slab_One, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { InstallPrompt } from "@/components/install-prompt";
import { Header } from "@/components/header";
import { LanguageProvider } from "@/components/language-provider";
import { FESTIVAL_NAME } from "@/lib/data";

const alfaSlabOne = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alfa",
  display: "swap",
});

const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin-ext"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin-ext"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: FESTIVAL_NAME,
  description: "Program a harmonogram festivalu Shreditup 4–6 september 2026",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: FESTIVAL_NAME,
  },
  icons: {
    icon: "/icon-512-red.png",
    apple: "/icon-512-red.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d95a28" },
    { media: "(prefers-color-scheme: dark)", color: "#241008" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sk"
      className={`${alfaSlabOne.variable} ${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body className="flex min-h-svh flex-col bg-background text-foreground antialiased">
        <LanguageProvider>
          <Header />
          <InstallPrompt />
          <main className="flex-1 pb-20">{children}</main>
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
