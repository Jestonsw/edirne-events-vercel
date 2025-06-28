import './globals.css'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Edirne Events - Etkinlik Rehberi | Edirne\'deki Tüm Etkinlikler',
  description: 'Edirne\'nin en kapsamlı etkinlik rehberi. Konserler, tiyatro, festival, sanat, kültür ve sosyal etkinlikleri keşfedin. Güncel etkinlik takvimi ve mekan bilgileri.',
  keywords: 'edirne etkinlik, edirne konser, edirne tiyatro, edirne festival, edirne sanat, edirne kültür, etkinlik takvimi, edirne gece hayatı, edirne sosyal aktivite',
  authors: [{ name: 'Edirne Events' }],
  metadataBase: new URL('https://edirne-events.replit.app'),
  alternates: {
    canonical: 'https://edirne-events.replit.app',
  },
  openGraph: {
    title: 'Edirne Events - Etkinlik Rehberi',
    description: 'Edirne\'nin en kapsamlı etkinlik rehberi. Güncel etkinlik takvimi ve mekan bilgileri.',
    url: 'https://edirne-events.replit.app',
    siteName: 'Edirne Events',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/edirne-skyline-logo.png',
        width: 1200,
        height: 630,
        alt: 'Edirne Events - Etkinlik Rehberi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edirne Events - Etkinlik Rehberi',
    description: 'Edirne\'nin en kapsamlı etkinlik rehberi. Güncel etkinlik takvimi ve mekan bilgileri.',
    images: ['/edirne-skyline-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 0.5,
  maximumScale: 3,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://edirne-events.replit.app" />
        <meta name="theme-color" content="#8B5A3C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Edirne Events" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="cache-bust" content="1751141511" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Edirne Events",
              "url": "https://edirne-events.com",
              "description": "Edirne'nin en kapsamlı etkinlik rehberi",
              "inLanguage": ["tr", "en", "bg"],
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://edirne-events.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
          suppressHydrationWarning
        />
      </head>
      <body className={inter.className}>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Clear Google auth related data
                if (typeof localStorage !== 'undefined') {
                  Object.keys(localStorage).forEach(key => {
                    if (key.includes('google') || key.includes('gapi') || key.includes('oauth')) {
                      localStorage.removeItem(key);
                    }
                  });
                }
                if (typeof sessionStorage !== 'undefined') {
                  Object.keys(sessionStorage).forEach(key => {
                    if (key.includes('google') || key.includes('gapi') || key.includes('oauth')) {
                      sessionStorage.removeItem(key);
                    }
                  });
                }
                // Disable Google auto-select if available
                if (window.google && window.google.accounts && window.google.accounts.id) {
                  window.google.accounts.id.disableAutoSelect();
                }
              } catch(e) {
              }
            `,
          }}
        />
        <LanguageProvider>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}