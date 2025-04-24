import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ // Add the VitePWA plugin configuration
      registerType: 'autoUpdate', // Automatically update the service worker
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'], // Assets to cache
      manifest: {
        name: 'React Todo PWA',
        short_name: 'TodoApp',
        description: 'A simple Todo application built with React, Vite, and Tailwind CSS.',
        theme_color: '#ffffff', // Set a theme color
        background_color: '#ffffff', // Set a background color
        display: 'standalone', // Make it feel like a native app
        scope: '/',
        start_url: '/',
        icons: [ // Define icons for different resolutions
          {
            src: 'pwa-192x192.png', // Path relative to public folder
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Path relative to public folder
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Maskable icon
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      // Optional: Service worker configuration (GenerateSW is default and often sufficient)
      // workbox: {
      //   globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      // }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
