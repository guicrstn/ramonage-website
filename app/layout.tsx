import type { Metadata, Viewport } from 'next'
import { Nunito, Quicksand } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] })
const _quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: 'L.B Ramonage / Fumisterie - Ramonage professionnel',
  description: 'L.B Ramonage/Fumisterie : ramonage professionnel, entretien de cheminees et poeles. Un ramonage = verification de toiture offerte. Prenez rendez-vous en ligne.',
  keywords: 'ramonage, fumisterie, entretien cheminee, ramoneur, nettoyage conduit, poele, insert, cheminee',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#CC0000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
