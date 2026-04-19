import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'SOS Decision Tree',
        short_name: 'SOS App',
        description: 'Rapid emergency response single-page application.',
        theme_color: '#ef4444',
        background_color: '#0a0a0a'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], // Cache all assets
        navigateFallback: '/index.html', // Offline fallback
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
