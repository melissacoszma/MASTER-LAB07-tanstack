import { 
  createFileRoute,
  Link,
  notFound,
 } from '@tanstack/react-router'

 import { 
  getHouse,
 } from '#/lib/api'

 import {
  BookButton,
 } from '#/components/BookButton'

 import {
  Image,
 } from '@unpic/react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001' 

// los parámetros dinámicos se marcan con $ delante, no con corchetes

export const Route = createFileRoute('/houses/$id')({

  // el router inyecta params ya resueltos y tipados a partir del patrón '/houses/$id' por eso params.id existe y TS lo conoce

  loader: async ({ params }) => {
    const house = await getHouse(params.id)

    // OJO que notFound() no se devuelve se LANZA
    if (!house) {
      throw notFound()
    }

    return house
  },

  
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.name} | Casas rurales`
          : 'Casa rural | Casas rurales',
      },
      { name: 'description', content: loaderData?.description ?? '' },
    ],
  }),

  component: HouseDetail,

  // cada sección de la app puede tener su 404 con su contexto.
  notFoundComponent: () => (
    <main className="mx-auto max-w-4xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Casa no encontrada</h1>
      <p className="mt-3 text-gray-600">
        La casa que buscas no existe o ya no está disponible.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700"
      >
        Ver todas las casas
      </Link>
    </main>
  ),
})

function HouseDetail() {

  // el throw de arriba garantiza que si llegamos aquí es que la casa existe

  const house = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
        ← Volver al listado
      </Link>

      {/* <img
        src={`${API_URL}${house.image}`}
        alt={`Vista de ${house.name}, en ${house.city}`}
        className="mt-6 h-80 w-full rounded-xl object-cover"
      /> */}

      <Image
        src={`${API_URL}${house.image}`}
        alt={`Vista de ${house.name}, en ${house.city}`}
        layout="constrained"
        width={896}
        height={320}
        loading="eager"
        fetchPriority="high" // priority no lo consume unpic sin CDN y acaba en el DOM provocando error 
        className="mt-6 h-80 w-full rounded-xl object-cover"
      />

      <header className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{house.name}</h1>
          <p className="mt-1 text-gray-600">
            {house.address}, {house.city}, {house.country}
          </p>
        </div>

        {/* shrink-0 evita que el precio se comprima si el título es largo */}
        <p className="shrink-0 text-2xl font-semibold">
          {house.price} €
          <span className="text-base font-normal text-gray-500"> por noche</span>
        </p>
      </header>

      <p className="mt-6 leading-relaxed text-gray-700">{house.description}</p>

      <ul className="mt-6 flex flex-wrap gap-4 text-sm text-gray-700">
        <li>{house.bedrooms} habitaciones</li>
        <li>{house.beds} camas</li>
        <li>{house.bathrooms} baños</li>
      </ul>
      
      <BookButton houseName={house.name} /> 

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Servicios</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {house.amenities.map((amenity) => (
            <li
              key={amenity}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {amenity}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          Opiniones ({house.reviews.length})
        </h2>

        {house.reviews.length === 0 ? (
          <p className="mt-3 text-gray-600">Todavía no tiene opiniones.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {house.reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.author}</span>

                  {/* mismo patrón de accesibilidad que next y nuxt */}
                  <span className="text-sm text-yellow-600">
                    <span aria-hidden="true">{'★'.repeat(review.rating)}</span>
                    <span className="sr-only">
                      {review.rating} de 5 estrellas
                    </span>
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}