import { 
    useState,
 } from 'react'

interface Props {
  houseName: string
}

export const BookButton: React.FC<Props> = ({ houseName }) => {
  const [isBooked, setIsBooked] = useState(false)

  return (
    <div className="mt-8 rounded-xl border border-gray-200 p-6">
      <button
        type="button"  // para que nunca envíe un formulario sin querer
        onClick={() => setIsBooked(true)}
        disabled={isBooked}
        className="w-full rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isBooked ? 'Reserva solicitada' : 'Reservar'}
      </button>

      {isBooked && (
        <p role="status" className="mt-4 text-center text-sm text-gray-700">
          Hemos recibido tu solicitud de reserva para{' '}
          <strong>{houseName}</strong>. Te escribiremos para confirmar la disponibilidad.
        </p>
      )}
    </div>
  )
}