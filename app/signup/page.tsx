"use client"

import { ArrowLeft, Mail, Lock, User, Building, CreditCard, Download } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function SignupPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showInstall, setShowInstall] = useState(false);
  const deferredPrompt = useRef<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bank: "",
    rib: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    
    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide.")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await axios.post("/api/signup", formData)
      setSuccess("Votre compte a été créé. Veuillez vérifier votre email pour activer votre compte.")
      
      // Optionally redirect after a delay
      setTimeout(() => {
        router.push("/login")
      }, 5000)
    } catch (err: any) {
      setError(err.response?.data?.error || "Une erreur s'est produite lors de l'inscription.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add PWA install prompt logic
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
      deferredPrompt.current = null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div>
            <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Créer un compte
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Inscrivez-vous pour accéder à toutes les fonctionnalités.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="relative">
                <label htmlFor="name" className="sr-only">Nom</label>
                <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="relative">
                <label htmlFor="email" className="sr-only">Email</label>
                <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                  placeholder="Adresse email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="relative">
                <label htmlFor="bank" className="sr-only">Banque</label>
                <Building className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="bank"
                  name="bank"
                  type="text"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                  placeholder="Nom de votre banque (optionnel)"
                  value={formData.bank}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="relative">
                <label htmlFor="rib" className="sr-only">RIB</label>
                <CreditCard className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="rib"
                  name="rib"
                  type="text"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                  placeholder="RIB (optionnel)"
                  value={formData.rib}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="relative">
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">Confirmer le mot de passe</label>
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inscription en cours...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
      {showInstall && (
        <div className="w-full flex justify-center pb-4">
          <button
            onClick={handleInstallClick}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Download className="h-5 w-5 mr-1" />
            Installe l’app
          </button>
        </div>
      )}
    </div>
  )
}