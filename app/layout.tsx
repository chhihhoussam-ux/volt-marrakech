import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { getSettings } from '@/lib/settings'
import { SettingsProvider } from '@/lib/settings-context'
import DynamicFavicon from '@/components/DynamicFavicon'

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
  themeColor: '#FF6700',
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()

  const siteName = settings.site_name || 'Almone'
  const description =
    'Louez un scooter électrique à Marrakech avec Almone. 20 ans d\'expérience dans la mobilité, flotte premium, réservation en ligne. Explorez la médina, Guéliz et les jardins à votre rythme. Dès 60 MAD.'

  return {
    metadataBase: new URL('https://www.almone-scooter.com'),
    title: {
      template: `%s | Almone — Location scooter électrique Marrakech`,
      default: `Almone — Location de scooters électriques à Marrakech | Yallah, Almone !`,
    },
    description,
    keywords: 'scooter électrique, Marrakech, location, mobilité douce, ville rouge, visite, médina, Guéliz',
    authors: [{ name: 'Almone' }],
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Almone',
    },
    openGraph: {
      type: 'website',
      locale: 'fr_MA',
      siteName: 'Almone',
      title: `Almone — Location de scooters électriques à Marrakech | Yallah, Almone !`,
      description,
      images: [
        {
          url: settings.hero_image_url || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Marrakech — Almone scooters électriques',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Almone — Location de scooters électriques à Marrakech | Yallah, Almone !`,
      description,
      images: [settings.hero_image_url || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=1200&q=80'],
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Almone" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <SettingsProvider>
          <DynamicFavicon />
          {children}
        </SettingsProvider>
      </body>
    </html>
  )
}
