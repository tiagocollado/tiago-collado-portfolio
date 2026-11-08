// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://tiagocollado.vercel.app',

  // El sitio sigue siendo estático (output 'static' es el default): todas
  // las páginas se generan en el build. El adapter solo hace falta para la
  // única ruta que se ejecuta a pedido, /api/now-playing.json, que lleva
  // `export const prerender = false`.
  adapter: vercel(),

  // Todas las URLs de páginas terminan en "/" (/en/, /en/projects/x/), igual
  // que las carpetas que genera el build (build.format: 'directory') y que
  // los links que arma getRelativeLocaleUrl. Rige en el servidor de dev; en
  // producción, el adapter de Vercel traduce esta opción a la configuración
  // de rutas del deploy, que redirige /en a /en/ con un 308.
  trailingSlash: 'always',

  // El CV vive en Google Drive y no entra al repo. La redirección es
  // temporal (307) para poder cambiar el destino sin que los navegadores
  // guarden la anterior. El adapter la escribe en la configuración de rutas
  // de Vercel, así que es una redirección HTTP real.
  redirects: {
    '/tiago-collado-cv.pdf': {
      status: 307,
      destination:
        'https://drive.google.com/file/d/19FWiqwOhMsQw0O8YDWqDSPAlvMvX5DOo/view?usp=sharing',
    },
  },

  // Variables de entorno validadas por Astro (astro:env). Las dos son de
  // servidor: solo las lee el endpoint, nunca llegan al navegador.
  env: {
    schema: {
      // Secreta: Astro no la escribe en el código generado; se lee del
      // entorno cuando el endpoint se ejecuta. Es opcional para que, si
      // falta, el endpoint responda un estado claro en vez de romper al
      // importar el módulo (Astro valida las secretas al importarlas).
      LASTFM_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Pública de servidor: el usuario de Last.fm no es un secreto (su
      // perfil es público), pero tampoco hace falta mandarlo al navegador.
      LASTFM_USERNAME: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist-sans',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});