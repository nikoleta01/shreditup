import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shreditup Festival',
    short_name: 'Shreditup',
    description: 'Program a harmonogram festivalu Shreditup 2026',
    start_url: '/',
    display: 'standalone',
    background_color: '#3D8DC5',
    theme_color: '#3D8DC5',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
