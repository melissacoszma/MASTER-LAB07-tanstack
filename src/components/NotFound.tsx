import { 
    Link, 
} from '@tanstack/react-router'

export const NotFound = () => (
  <main className="mx-auto max-w-4xl px-4 py-20 text-center">
    <h1 className="text-2xl font-bold">Página no encontrada</h1>
    <p className="mt-3 text-gray-600">
      La página que buscas no existe o ya no está disponible.
    </p>
    <Link
      to="/"
      className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700"
    >
      Ver todas las casas
    </Link>
  </main>
)