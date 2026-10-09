import type { 
    House, 
} from '#/types/house'


const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export const getHouses = async (): Promise<House[]> => {
  const response = await fetch(`${API_URL}/api/houses`)

  if (!response.ok) {
    throw new Error('Error al obtener el listado de casas')
  }

  return response.json()
}

export const getHouse = async (id: string): Promise<House | null> => {
  const response = await fetch(`${API_URL}/api/houses/${id}`)

  if (!response.ok) {
    throw new Error('Error al obtener la casa rural')
  }

  const text = await response.text()
  return text ? (JSON.parse(text) as House) : null
}