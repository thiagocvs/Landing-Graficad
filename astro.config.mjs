// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Cambiá esto por el dominio real antes de publicar: alimenta el canonical y el sitemap.
  site: 'https://www.graficad.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
