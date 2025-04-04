import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function VerificationFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <XCircle className="text-red-500 text-6xl" width={100} height={100}/>
      <h1 className="text-3xl font-bold mt-4">Vérification échouée</h1>
      <p className="text-lg mt-2">Le lien de vérification est invalide ou a expiré.</p>
      <p className="text-md mt-1">Veuillez vous connecter pour demander un nouveau lien de vérification.</p>
      <Link href="/login">
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Se connecter
        </button>
      </Link>
    </div>
  )
} 