import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        id: '/',
        name: 'مريم AI - مساحة العمل والذكاء الاصطناعي',
        short_name: 'مريم AI',
        description: 'منصة مريم للعمل عن بُعد والذكاء الاصطناعي: تدقيق وتقييم الفرص، إدارة وتسليم المشاريع، ومزامنة الأرباح مع بنك الكريمي للتمويل الأصغر (حساب: 3181903553).',
        theme_color: '#064e3b',
        background_color: '#0a071f',
        display: 'standalone',
        orientation: 'portrait-primary',
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
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});

