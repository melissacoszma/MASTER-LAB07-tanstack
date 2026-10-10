import { 
    Link,
 } from '@tanstack/react-router'

import type { 
    House,
 } from '#/types/house'

 import { 
  Image,
 } from '@unpic/react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface Props {
  house: House
}

export const HouseCard: React.FC<Props> = ({ house }) => {
  return (

    <Link
      to="/houses/$id"     // "to" no es la URL final, es el PATRÓN de la ruta y los valores van aparte en "params" Gracias a eso TS comprueba que la ruta existe y que le pasamos los parámetros que necesita.
      params={{ id: house.id }}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* <img
        src={`${API_URL}${house.image}`}
        alt=""
        className="h-48 w-full object-cover transition group-hover:scale-105"
      /> */}

      <Image
        src={`${API_URL}${house.image}`}
        alt=""
        layout="constrained"
        width={400}
        height={192}
        loading="lazy"
        decoding="async"
        className="h-48 w-full object-cover transition group-hover:scale-105"
      />

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">{house.name}</h2>

        <p className="text-sm text-gray-500">
          {house.city}, {house.country}
        </p>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {house.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {house.bedrooms} habitaciones · {house.bathrooms} baños
          </span>
          <span className="font-semibold text-gray-900">
            {house.price} €
            <span className="text-sm font-normal text-gray-500"> por noche</span>
          </span>
        </div>
      </div>
    </Link>
  )
}