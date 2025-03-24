"use client"

import type React from "react"

import { deleteImageFromFirebase } from "@/utils/uploadImgae"
import type { Cheque, ChequeType, chequeOuqb } from "@/types/cheque"
import { useRef, useState } from "react"
import { compressImage } from "../utils/compression"
import { saveImageToFirebase } from "../utils/uploadImgae"
interface PopUpAddPaylentProps {
  capturedCheque: Omit<Cheque, "id">
  setCapturedCheque: React.Dispatch<React.SetStateAction<Omit<Cheque, "id"> | null>>
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>
  isSaving: boolean
  onSave: () => void
}

export function PopUpAddPaylent({
  capturedCheque,
  setCapturedCheque,
  setIsSaving,
  isSaving,
  onSave,
}: PopUpAddPaylentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageData, setImage] = useState<Blob | null>(null)
  const confirm=async()=>{
    var url=""
    if(imageData!==null) 
      url= await saveImageToFirebase(imageData)
    
    setCapturedCheque({ ...capturedCheque, imageUrl: url })
    onSave()
  }
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      console.log("start compression")
      const compressedFile = await compressImage(file)
      console.log("end compression")
      const blob = new Blob([compressedFile], { type: compressedFile.type })
      setImage(blob)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        style={{ overflow: "auto", maxHeight: "95vh" }}
      >
        <h2 className="text-xl font-bold mb-4">Vérifier les informations du chèque</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              value={capturedCheque.type}
              onChange={(e) => setCapturedCheque({ ...capturedCheque, type: e.target.value as ChequeType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="a-payer">À Payer</option>
              <option value="a-recevoir">À Recevoir</option>
            </select>
          </div>
          <div>
            <label htmlFor="typePapier" className="block text-sm font-medium text-gray-700">
              Type de papier
            </label>
            <select
              id="type"
              value={capturedCheque.typeDepapier}
              onChange={(e) => setCapturedCheque({ ...capturedCheque, typeDepapier: e.target.value as chequeOuqb })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="cheque">Cheque</option>
              <option value="kimbielle">Bon d'echnage</option>
              <option value="espece">Espéce</option>
            </select>
          </div>
          <div style={{ display: capturedCheque.typeDepapier !== "espece" ? "block" : "none" }}>
            <label className="block text-sm font-medium text-gray-700">Banque</label>
            <input
              type="text"
              value={capturedCheque.bank}
              onChange={(e) => setCapturedCheque({ ...capturedCheque, bank: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div style={{ display: capturedCheque.typeDepapier !== "espece" ? "block" : "none" }}>
            <label className="block text-sm font-medium text-gray-700">Numéro</label>
            <input
              type="text"
              value={capturedCheque.number}
              onChange={(e) => setCapturedCheque({ ...capturedCheque, number: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Montant</label>
            <input
              type="text"
              value={capturedCheque.amount}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) return
                setCapturedCheque({ ...capturedCheque, amount: Number(e.target.value) })
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div style={{ display: capturedCheque.typeDepapier !== "espece" ? "block" : "none" }}>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={
                capturedCheque.typeDepapier !== "espece"
                  ? capturedCheque.date.split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              onChange={(e) => {
                const date = new Date(e.target.value)
                const isoString = date.toISOString()
                setCapturedCheque({ ...capturedCheque, date: isoString })
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {capturedCheque.type === "a-recevoir" ? "Client" : "Bénéficiaire"}
            </label>
            <input
              type="text"
              value={capturedCheque.beneficiary}
              onChange={(e) => setCapturedCheque({ ...capturedCheque, beneficiary: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div style={{display: (capturedCheque.imageUrl===null || capturedCheque.number==="")? "block": "none"	}} className="mt-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-semibold py-3 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Télécharger une Image
            </button>
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {imageData && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Image capturée</h3>
              <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                <img
                  alt="payment paper"
                  src={URL.createObjectURL(imageData)}
                  className="max-h-48 object-contain rounded-md shadow-md"
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => {
              if (!capturedCheque.imageUrl) {
                setIsSaving(false)
                setCapturedCheque(null)
                return
              }
              deleteImageFromFirebase(capturedCheque.imageUrl)
              setIsSaving(false)
              setCapturedCheque(null)
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={confirm}
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  )
}

