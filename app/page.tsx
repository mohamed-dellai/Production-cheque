"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { TableauDeBordCheques } from "../components/tableau-de-bord-cheques"
import { TableauDeBordGraphique } from "../components/tableau-de-bord-graphique"
import { CaptureCheque } from "../components/capture-cheque"
import { calculerTotalCheques } from "../utils/calcul-cheques"
import type { Cheque, ChequeType, chequeOuqb } from "../types/cheque"
import { PlusCircle, BarChart3, CheckCircle, XCircle, Menu, Home, User } from "lucide-react"
import { UserContext } from "../app/context/context"
import Link from "next/link"
import { PopUpAddPaylent } from "@/components/popUpAddPaylent"
import { useRouter } from 'next/navigation';
import { requestForToken } from '@/utils/firebase';

export default function Accueil() {
  const [cheques, setCheques] = useState<Cheque[]>([])
  const [activeTab, setActiveTab] = useState<"liste" | "graphiques" | "capture">("liste")
  const [activeListTab, setActiveListTab] = useState<ChequeType>("a-payer")
  const [capturedCheque, setCapturedCheque] = useState<Omit<Cheque, "id"> | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [visibleCheques, setVvisibleCheques] = useState<Cheque[]>([])
  const [totalAPayer, setTotalAPayer] = useState(0)
  const [totalARecevoir, setTotalARecevoir] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (cheques.length !== 0) {
      return
    }

    const fetchCheques = async () => {
      try {
        const response = await axios.get("/api/cheque")
        setCheques(response.data)
      } catch (error) {
        console.error("Failed to fetch cheques:", error)
        setMessage({ type: "error", text: "Erreur lors du chargement des chèques" })
      } finally {
        setLoading(false)
      }
    }

    fetchCheques()
  }, [cheques.length])

  useEffect(() => {
    const aPayer =
      activeListTab === "a-payer"
        ? calculerTotalCheques(visibleCheques, "a-payer")
        : calculerTotalCheques(visibleCheques, "a-recevoir")
    const aRecevoir =
      activeListTab === "a-payer"
        ? visibleCheques.filter((cheque) => cheque.status === "encaisse").reduce((cumm, elem) => cumm + elem.amount, 0)
        : visibleCheques.filter((cheque) => cheque.status === "encaisse").reduce((cumm, elem) => cumm + elem.amount, 0)
    setTotalAPayer(aPayer)
    setTotalARecevoir(aRecevoir)
  }, [visibleCheques, activeListTab])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [message])

  const handleUpdateCheque = async (updatedCheque: Cheque) => {
    try {
      const _ = await axios.put("/api/cheque/" + updatedCheque.id, updatedCheque)
      setMessage({ type: "success", text: "Chèque modifié avec succès" })
    } catch (e) {
      console.log(e)
      setMessage({ type: "error", text: "Erreur lors de la modification du chèque" })
    }
    setCheques((prevCheques) => prevCheques.map((cheque) => (cheque.id === updatedCheque.id ? updatedCheque : cheque)))
  }

  const handleCaptureCheque = (newCheque: Omit<Cheque, "id">) => {
    setCapturedCheque(newCheque)
  }

  const saveCapturedCheque = async () => {
    if(!capturedCheque)
      return
    if(!capturedCheque.date.includes("T"))
    {
    var date = new Date(capturedCheque.date)
    const isoString = date.toISOString()
    capturedCheque.date=isoString
  }
     if (capturedCheque) {
      setIsSaving(true)
      try {
        if(capturedCheque.typeDepapier==="espece")
          capturedCheque.status="encaisse"
        
        const response = await axios.post("/api/cheque", capturedCheque)
        setCheques((prevCheques) => [...prevCheques, response.data])
        setCapturedCheque(null)
        setActiveTab("liste")
        setMessage({ type: "success", text: "Chèque sauvegardé avec succès" })
      } catch (error) {
        console.error("Failed to save cheque:", error)
        setMessage({ type: "error", text: "Erreur lors de la sauvegarde du chèque" })
      } finally {
        setIsSaving(false)
      }
    } 
  }

  const handlePredictionClick = () => {
    router.push(`/predection`);
  };

  const handleLogout = async () => {
    try {
      const fcmToken = await requestForToken();
      if (fcmToken) {
        await axios.post('/api/fcm/remove', { fcmToken });
      }
    } catch (error) {
      console.error('Error removing FCM token:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex space-x-2 animate-bounce">
          <div className="w-6 h-6 bg-indigo-600 rounded-full"></div>
          <div className="w-6 h-6 bg-indigo-600 rounded-full"></div>
          <div className="w-6 h-6 bg-indigo-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-gray-100 pb-20">
      {message && (
        <div
          className={`
            fixed top-4 left-1/2 transform -translate-x-1/2 z-50
            flex items-center p-4 mb-4 rounded-lg shadow-lg
            ${message.type === "success" ? "bg-green-500" : "bg-red-500"} text-white
            animate-fade-in-down
          `}
        >
          {message.type === "success" ? <CheckCircle className="w-6 h-6 mr-2" /> : <XCircle className="w-6 h-6 mr-2" />}
          {message.text}
        </div>
      )}

      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">STE SMART STEP CONTROL</h1>
      </header>

      <div className="container mx-auto px-4 py-6">
        {activeTab !== "capture" && !capturedCheque && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-indigo-700">Résumé Financier</h2>
            <p className="text-sm">
              <span className="font-medium text-slate-600">
                {activeListTab === "a-payer" ? "Total à payer" : "Total à recevoir :"}
              </span>{" "}
              <span className="font-bold text-red-600">{Math.round(totalAPayer)} TND</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-slate-600">
                {activeListTab === "a-payer" ? "Total Payer" : "Total Recu :"}
              </span>{" "}
              <span className="font-bold text-green-600">{Math.round(totalARecevoir)} TND</span>
            </p>
          </div>
        )}

        {activeTab === "liste" && (
          <UserContext.Provider value={{ visibleCheques, setVvisibleCheques }}>
            <TableauDeBordCheques type={activeListTab} cheques={cheques} onUpdateCheque={handleUpdateCheque} />
          </UserContext.Provider>
        )}

        {activeTab === "graphiques" && <TableauDeBordGraphique cheques={cheques} />}

        {activeTab === "capture" && <CaptureCheque onCapture={handleCaptureCheque} />}
      </div>

      {capturedCheque && (
        <PopUpAddPaylent capturedCheque={capturedCheque} setCapturedCheque={setCapturedCheque} isSaving={isSaving} setIsSaving={setIsSaving} onSave={saveCapturedCheque}  ></PopUpAddPaylent>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-lg">
        <button
          onClick={() => {
            setActiveTab("liste")
            setActiveListTab("a-payer")
          }}
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            activeTab === "liste" && activeListTab === "a-payer" ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <Home size={24} />
          <span className="text-xs">Fournisseur</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("liste")
            setActiveListTab("a-recevoir")
          }}
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            activeTab === "liste" && activeListTab === "a-recevoir" ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <User size={24} />
          <span className="text-xs">Clients</span>
        </button>
        <button
          onClick={() => setActiveTab("capture")}
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            activeTab === "capture" ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <PlusCircle size={24} />
          <span className="text-xs">Ajouter</span>
        </button>
        <button
          onClick={() => setActiveTab("graphiques")}
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            activeTab === "graphiques" ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <BarChart3 size={24} />
          <span className="text-xs">Graphiques</span>
        </button>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isMenuOpen ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <Menu size={24} />
          <span className="text-xs">Menu</span>
        </button>
      </nav>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="bg-white w-64 h-full shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            <ul>
              <li className="mb-2">
                <Link href="/print" className="text-indigo-600 hover:text-indigo-800">
                  Imprimer les traites
                </Link>
              </li>
              {/* <li className="mb-2">
                <button onClick={handlePredictionClick} className="text-indigo-600 hover:text-indigo-800">
                  Prediction
                </button>
              </li> */}
              <li className="mb-2">
                <Link href="/payment" className="text-indigo-600 hover:text-indigo-800">
                  Payment et subscription
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/settings" className="text-indigo-600 hover:text-indigo-800">
                  Paramétres
                </Link>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => {handleLogout ;  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";window.location.href = "/login";}}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}

