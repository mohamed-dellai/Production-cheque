import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function VerificationSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <CheckCircle className="text-green-500 text-6xl" width={100} height={100}/>
      <h1 className="text-3xl font-bold mt-4">Email vérifié avec succès</h1>
      <p className="text-lg mt-2">Votre compte a été activé. Vous pouvez maintenant vous connecter.</p>
      <Link href="/login">
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Se connecter
        </button>
      </Link>
    </div>
  )
} 