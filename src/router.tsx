import { createRouter as createTanStackRouter, 
} from '@tanstack/react-router'

import { 
  routeTree,
} from './routeTree.gen'

import { 
  NotFound, 
} from './components/NotFound'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,

    defaultNotFoundComponent: NotFound,

    defaultErrorComponent: ({ error }) => (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Algo no ha salido como esperábamos</h1>
        <p className="mt-3 text-gray-600">
          No hemos podido cargar el contenido. Comprueba que el servidor de la API esté arrancado en el puerto correspondiente.
        </p>
        {/* <pre className="mt-6 overflow-x-auto rounded-lg bg-gray-100 p-4 text-left text-xs text-gray-600">
          {error.message}
        </pre> */}
        <pre className="mt-6 overflow-x-auto rounded-lg bg-gray-100 p-4 text-left text-xs text-gray-600">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </main>
    ),

  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
