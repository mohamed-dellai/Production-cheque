"use client"

import { useState } from "react"
import type { Cheque } from "@/types/cheque"
import { ModalEditionCheque } from "./modal-edition-cheque"
import Image from "next/image"
import axios from "axios"
import { Eye, EyeOff, Trash2 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { deleteImageFromFirebase } from "@/utils/uploadImgae"
interface ElementChequeProps {
  cheque: Cheque
  onUpdate: (updatedCheque: Cheque) => void
  viewMode: "card" | "list"
  isOverdue: boolean
}

export function ElementCheque({ cheque, onUpdate, viewMode, isOverdue }: ElementChequeProps) {
  const [showImage, setShowImage] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  interface AccountInfo {
    name: string
    email: string
  }
  
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const overdueClass = isOverdue ? "border-l-4 border-red-500" : ""

  const fetchAccountInfo = async () => {
    if (showSaved) {
      setShowSaved(false)
      return
    }
    setIsLoading(true)
    try {
      const response = await axios.get("/api/getChequeOwner", {
        params: { chequeId: cheque.id },
      })
      const data = response.data
      setAccountInfo(data)
      setShowSaved(true)
    } catch (error) {
      console.error("Error fetching account info:", error)
      alert("Erreur : Impossible de récupérer les informations du créateur.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce chèque ?")) {
      setIsDeleting(true)
      if(cheque.imageUrl)
        deleteImageFromFirebase(cheque.imageUrl)
        
      try {
        await axios.delete(`/api/delete`, { params: { id: cheque.id } })
        alert("Le chèque a été supprimé avec succès.")
      } catch (error) {
        console.error("Error deleting cheque:", error)
        alert("Erreur : Impossible de supprimer le chèque.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  if (viewMode === "list") {
    return (
      <div
        className={`flex items-center justify-between p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg ${overdueClass}`}
      >
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">
            {cheque.beneficiary} - {cheque.number}
          </h3>
          <p className="text-sm text-gray-600">
            {cheque.bank} - {cheque.amount} TND
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              cheque.status === "en-attente"
                ? isOverdue
                  ? "bg-red-500 text-white"
                  : "bg-yellow-500 text-white"
                : cheque.status === "encaisse"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
            }`}
          >
            {cheque.status === "en-attente"
              ? isOverdue
                ? "En retard"
                : "En Attente"
              : cheque.status === "encaisse"
                ? "Encaissé"
                : "À Déposer"}
          </span>
          <ModalEditionCheque cheque={cheque} onSave={onUpdate} />
          <button
            onClick={fetchAccountInfo}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            {showSaved ? (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                Masquer le créateur
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Voir le créateur
              </>
            )}
          </button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Spinner className="mr-2" /> : <Trash2 className="w-4 h-4 mr-1" />}
            Supprimer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`mb-4 overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg ${overdueClass}`}>
      <div
        className={`bg-gradient-to-r ${
          isOverdue ? "from-red-500 to-red-700" : "from-indigo-500 to-indigo-700"
        } text-white p-4`}
      >
        <h3 className="text-lg">
          <span className="truncate font-semibold">
            {cheque.beneficiary} - {cheque.amount}DT
          </span>
          <div className="flex space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                cheque.type === "a-payer" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {cheque.type === "a-payer" ? "À Payer" : "À Recevoir"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                cheque.status === "en-attente"
                  ? isOverdue
                    ? "bg-red-500"
                    : "bg-yellow-500"
                  : cheque.status === "encaisse"
                    ? "bg-green-500"
                    : "bg-blue-500"
              }`}
            >
              {cheque.status === "en-attente"
                ? isOverdue
                  ? "En retard"
                  : "En Attente"
                : cheque.status === "encaisse"
                  ? "Encaissé"
                  : "À Déposer"}
            </span>
          </div>
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <span className="font-semibold text-slate-600">Type:</span>{" "}
            {cheque.typeDepapier === "kimbielle" ? "Bon d'echange" : cheque.typeDepapier === "cheque" ? "Cheque" : "Espece"}
          </p>
          <p style={{display: cheque.typeDepapier!=="espece" ? "block" : "none"}}>
            <span className="font-semibold text-slate-600">Numero:</span> {cheque.number}
          </p>
          <p style={{display: cheque.typeDepapier!=="espece" ? "block" : "none"}}>
            <span className="font-semibold text-slate-600">Date d'échéance:</span>{" "}
            {new Date(cheque.date).toLocaleString()}
          </p>
          <p style={{display: cheque.typeDepapier!=="espece" ? "block" : "none"}} className="col-span-2 truncate">
            <span className="font-semibold text-slate-600">Bank:</span> {cheque.bank}
          </p>
          <p className="col-span-2">
            <span className="font-semibold text-slate-600">Enregistré le:</span>{" "}
            {new Date(cheque.savedAt).toLocaleString()}
          </p>
          {cheque.notes && (
            <p className="col-span-2 mt-2">
              <span className="font-semibold text-slate-600">Notes:</span> {cheque.notes}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center" style={{flexWrap: "wrap"}}>
          <button onClick={() => setShowImage(true)} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Voir l'image
          </button>
          <ModalEditionCheque cheque={cheque} onSave={onUpdate} />
          <button
            onClick={fetchAccountInfo}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            {showSaved ? (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                Masquer le créateur
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Voir le créateur
              </>
            )}
          </button>
          <Button variant="destructive" size="sm" style={{marginLeft: "0.8em"}} onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Spinner className="mr-2" /> : <Trash2 className="w-4 h-4 mr-1" />}
            Supprimer
          </Button>
        </div>
        {showSaved && accountInfo && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h4 className="text-lg font-semibold text-indigo-800 mb-2">Informations du créateur</h4>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm">
                <span className="font-medium text-indigo-600">Nom:</span> {accountInfo.name}
              </p>
              <p className="text-sm">
                <span className="font-medium text-indigo-600">Email:</span> {accountInfo.email}
              </p>
            </div>
          </div>
        )}
      </div>
      {showImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full">
            <Image
              src={cheque.imageUrl || "/placeholder.svg"}
              alt={`Chèque ${cheque.number}`}
              width={400}
              height={300}
              className="w-full h-auto"
            />
            <button
              onClick={() => setShowImage(false)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

