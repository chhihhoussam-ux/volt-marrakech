import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { getSettings } from '@/lib/settings'
import { SettingsProvider } from '@/lib/settings-context'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#00B050',
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()

  const siteName = settings.site_name || 'Keewee'
  const description =
    'Louez un scooter électrique à Marrakech avec Keewee. 20 ans d\'expérience dans la mobilité, flotte premium, réservation en ligne. Explorez la médina, Guéliz et les jardins à votre rythme. Dès 60 MAD.'

  return {
    metadataBase: new URL('https://keewee.ma'),
    title: {
      template: `%s | Keewee — Location scooter électrique Marrakech`,
      default: `Keewee — Location de scooters électriques à Marrakech | Yallah, Keewee !`,
    },
    description,
    keywords: 'scooter électrique, Marrakech, location, mobilité douce, ville rouge, visite, médina, Guéliz',
    authors: [{ name: 'Keewee' }],
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Keewee',
    },
    openGraph: {
      type: 'website',
      locale: 'fr_MA',
      siteName: 'Keewee',
      title: `Keewee — Location de scooters électriques à Marrakech | Yallah, Keewee !`,
      description,
      images: [
        {
          url: settings.hero_image_url || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Marrakech — Keewee scooters électriques',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Keewee — Location de scooters électriques à Marrakech | Yallah, Keewee !`,
      description,
      images: [settings.hero_image_url || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=1200&q=80'],
    },
    icons: {
      icon: settings.favicon_url || '/icon-192.png',
      apple: '/icon-192.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={dmSans.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icon-512.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Keewee" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  )
}
