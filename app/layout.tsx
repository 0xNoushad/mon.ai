import { IBM_Plex_Mono } from 'next/font/google'
import "./globals.css"
import { WalletContextProvider } from "../components/solana/wallet-context"
import { PWARegister } from '../components/ui/Pwa-register'
import { Metadata } from 'next'

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Monai',
  description: 'Your personal Solana wallet chat interface',
  manifest: '/manifest.json',
  icons: {
    apple: [
      { url: '/app/192.png', sizes: '192x192', type: 'image/png' },
      { url: '/app/512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  themeColor: '#00FF00',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Monai" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Monai" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/app/192.png" />
      </head>
      <body className={mono.className}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
        <PWARegister />
      </body>
    </html>
  )
}

