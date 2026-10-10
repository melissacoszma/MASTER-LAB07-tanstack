import { 
  HeadContent, 
  Scripts, 
  createRootRoute,
  Link, 
} from '@tanstack/react-router'

import { 
  TanStackRouterDevtoolsPanel, 
} from '@tanstack/react-router-devtools'

import { 
  TanStackDevtools, 
} from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Casas rurales | Alquiler vacacional',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="border-b border-gray-200">
          <nav className="mx-auto max-w-6xl px-4 py-4">
            <Link to="/" className="text-lg font-semibold">
              Casas rurales
            </Link>
          </nav>
        </header>

        {children}

        <footer className="mt-16 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
          Laboratorio MetaFrameworks · TanStack Start
        </footer>

        {/* los devtools y Scripts se quedan como estaban, al final */}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
