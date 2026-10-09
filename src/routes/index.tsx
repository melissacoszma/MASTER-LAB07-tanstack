import { 
  createFileRoute, 
} from '@tanstack/react-router'

import { 
  getHouses, 
} from '#/lib/api'

import { 
  HouseCard, 
} from '#/components/HouseCard'

// forma de los parámetros de búsqueda de esta ruta
interface HousesSearch {
  q?: string
}

export const Route = createFileRoute('/')({
  
  validateSearch: (search: Record<string, unknown>): HousesSearch => ({   // validateSearch recibe la query string como objeto sin tipar y devuelve el objeto tipado que usará la ruta

    q: typeof search.q === 'string' && search.q !== '' ? search.q : undefined,
  }),

  // el loader no depende de los search params, no se vuelve a ejecutar al teclear
  loader: () => getHouses(),   // el loader se ejecuta ANTES de renderizar el componente
  component: Home,
})


const normalize = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')


function Home() {
 
  const houses = Route.useLoaderData()  // useLoaderData devuelve lo que retornó el loader, YA TIPADO y TS sabe que esto es House[] sin que se lo digamos porque lo deduce del loader

  const { q = '' } = Route.useSearch()

  const navigate = Route.useNavigate()   // este navigate está ligado a ESTA ruta, TS comprueba que los search que le pasamos son los que la ruta declara

  const term = normalize(q.trim())

  const filteredHouses = term
    ? houses.filter(
        (house) =>
          normalize(house.name).includes(term) ||
          normalize(house.city).includes(term),
      )
    : houses  

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Casas rurales</h1>
        <p className="mt-2 text-gray-600">
          ¿Dónde será tu próxima escapada al campo?
        </p>
      </header>

      <div className="mb-8">
        <label htmlFor="search" className="sr-only">
          Buscar casas rurales
        </label>

        <input
          id="search"
          type="search"
          // la URL es el estado
          value={q}
          onChange={(event) =>
            navigate({

              // el formato función recibe los search anteriores así que si en un futuro añadimos un filtro de precio no lo pisarí
              search: (prev) => ({ ...prev, q: event.target.value || undefined, }),

              replace: true,    // sin esto el botón de atrás tendría que pulsarse una vez por letra escrita
            })
          }
          placeholder="Buscar por nombre o ubicación..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        />

        <p aria-live="polite" className="mt-2 text-sm text-gray-600">
          {filteredHouses.length}{' '}
          {filteredHouses.length === 1
            ? 'alojamiento encontrado'
            : 'alojamientos encontrados'}
        </p>
      </div>

      {filteredHouses.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
          No hemos encontrado ninguna casa que coincida con la búsqueda «{q}».
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHouses.map((house) => (
            <li key={house.id}>
              <HouseCard house={house} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
