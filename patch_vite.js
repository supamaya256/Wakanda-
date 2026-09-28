const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

const importReplacement = `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';`;

content = content.replace(/import tailwindcss.*import {defineConfig} from 'vite';/s, importReplacement);

const pluginReplacement = `plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'DJ Emma Pro Mixes',
          short_name: 'DJEmmaPro',
          description: 'Nonstop Ateso and Reggae Video Mixes',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\\/\\/res\\.cloudinary\\.com\\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cloudinary-media-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200, 206],
                },
                rangeRequests: true,
              },
            },
            {
              urlPattern: /^https:\\/\\/fonts\\.googleapis\\.com\\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\\/\\/fonts\\.gstatic\\.com\\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      })
    ],`;

content = content.replace(/plugins: \[react\(\), tailwindcss\(\)\],/, pluginReplacement);

fs.writeFileSync('vite.config.ts', content);
