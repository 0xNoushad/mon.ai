import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Monai',
    short_name: 'Monai',
    description: 'Your personal Solana wallet chat interface',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00FF00',
    icons: [
      {
        src: 'https://ibb.co/YP93FQX',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://ibb.co/r6qmYgm',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

