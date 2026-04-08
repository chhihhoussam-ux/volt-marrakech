import type { Metadata, Viewport } from 'next'
import './globals.css'
import { getSettings } from '@/lib/settings'
import { SettingsProvider } from '@/lib/settings-context'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#C8FF00',
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()

  const siteName = `${settings.site_name} Marrakech`
  const description =
    'Location de scooters électriques au cœur de Marrakech. Explorez la ville rouge à votre rythme, en toute liberté. À partir de 170 MAD/jour.'

  return {
    metadataBase: new URL('https://volt-marrakech.ma'),
    title: {
      template: `%s | ${siteName} — Location scooter électrique`,
      default: `${siteName} — Location de scooters électriques`,
    },
    description,
    keywords: 'scooter électrique, Marrakech, location, mobilité douce, ville rouge, visite',
    authors: [{ name: siteName }],
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Volt',
    },
    openGraph: {
      type: 'website',
      locale: 'fr_MA',
      siteName,
      title: `${siteName} — Location de scooters électriques`,
      description,
      images: [
        {
          url: settings.hero_image_url || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Marrakech — Volt scooters électriques',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} — Location de scooters électriques`,
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
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icon-512.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Volt" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  )
}
