import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

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
