import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function PaymentFailurePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <XCircle className="text-red-500 text-6xl" width={100} height={100} />
      <h1 className="text-3xl font-bold mt-4">Paiement échoué</h1>
      <p className="text-lg mt-2">
        Une erreur est survenue lors du paiement. Veuillez réessayer plus tard.
      </p>
      <Link href="/">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Retour à l'accueil
        </button>
      </Link>
    </div>
  )
}

