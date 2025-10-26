// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // 1. Eklentiyi import et

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
    // 2. PWA eklentisini yapılandırmasıyla birlikte ekle
    VitePWA({
      registerType: 'autoUpdate', // Service worker'ı otomatik günceller
      devOptions: {
        enabled: true, // Geliştirme modunda da PWA eklentisini aktif et
        type: 'module',
      },
      injectRegister: 'auto',
      
      // manifest.json dosyamızın içeriği
      manifest: {
        name: 'Online Mangala Oyunu',
        short_name: 'Mangala',
        description: 'Arkadaşlarınla online mangala oyna.',
        theme_color: '#282c34', // Arka plan rengimiz
        background_color: '#282c34',
        display: 'standalone', // Tam ekran bir uygulama gibi açılmasını sağlar
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable', // "Maskable" iconlar Android'de daha iyi görünür
          },
        ],
      },
    }),
  ],
});