import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,         // genera HTML estático en tiempo de compilación
        crawlLinks: true,      // rastrea los enlaces para descubrir más páginas: parte del listado sigue los seis Link de las tarjetas y genera cada ficha

      },
    }),
    viteReact(),
  ],
})

export default config
