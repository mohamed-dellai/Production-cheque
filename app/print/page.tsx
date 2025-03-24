"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import "./print.css"
import { convertAmountToFrench } from "../../utils/convertTofrensh"
import axios from "axios"

interface BonDeCommandeData {
  echeance: string
  documentNumber: string
  payeALordreDe: string
  bankName: string
  dateDeCreation: string
  bankRIB: string
  montantEnLettre: string
  montant: string
  lieu: string
}

const initialFormData: BonDeCommandeData = {
  echeance: "",
  documentNumber: "",
  payeALordreDe: "",
  bankName: "",
  dateDeCreation: "",
  bankRIB: "",
  montantEnLettre: "",
  montant: "",
  lieu: "Tunis"
}

const Print: React.FC = () => {
  const [formData, setFormData] = useState<BonDeCommandeData>(initialFormData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [rib, setRib] = useState<string>("")
  const [bankName, setBankName] = useState<string>("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let error = ""

    if (name === "echeance" || name === "dateDeCreation") {
      const datePattern = /^\d{2}\/\d{2}\/\d{2}$/
      if (!datePattern.test(value)) {
        error = "Date must be in dd/mm/yy format"
      }
    } else if (name === "bankRIB") {
      if (value.length !== 20) {
        error = "RIB must be 20 digits"
      }
    } else if (name === "montant") {
      if (isNaN(Number(value))) {
        error = "Montant must be a number"
      } else {
        setFormData((prevState) => ({
          ...prevState,
          montantEnLettre: convertAmountToFrench(Number(value)),
        }))
      }
    } else if (value.trim() === "") {
      error = "This field cannot be empty"
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }))

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    const getInfo = async () => {
      const getInfo = await axios.get('../api/getSocieteInfo')
      console.log(getInfo.data)
      setRib(getInfo.data.rib)
      setBankName(getInfo.data.bank)
    }
    getInfo()
  }, [])

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      bankName: bankName,
      bankRIB: rib,
    }))
  }, [bankName, rib])

  const renderForm = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="payeALordreDe" className="block text-sm font-medium text-gray-700">
            Payé à l'ordre de
          </label>
          <input
            type="text"
            id="payeALordreDe"
            name="payeALordreDe"
            value={formData.payeALordreDe}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            autoComplete="name"
          />
          {errors.payeALordreDe && <p className="text-red-500 text-sm">{errors.payeALordreDe}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="echeance" className="block text-sm font-medium text-gray-700">
            Echéance
          </label>
          <input
            type="text"
            id="echeance"
            name="echeance"
            value={formData.echeance}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="dd/mm/yy"
            autoComplete="off"
          />
          {errors.echeance && <p className="text-red-500 text-sm">{errors.echeance}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
            Nom de la banque
          </label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            autoComplete="organization"
          />
          {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
            Lieu de creation
          </label>
          <input
            type="text"
            id="lieu"
            name="lieu"
            value={formData.lieu}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            autoComplete="organization"
          />
          {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="dateDeCreation" className="block text-sm font-medium text-gray-700">
            Date de création
          </label>
          <input
            type="text"
            id="dateDeCreation"
            name="dateDeCreation"
            value={formData.dateDeCreation}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="dd/mm/yy"
            autoComplete="off"
          />
          {errors.dateDeCreation && <p className="text-red-500 text-sm">{errors.dateDeCreation}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="bankRIB" className="block text-sm font-medium text-gray-700">
            RIB de la banque
          </label>
          <input
            type="text"
            id="bankRIB"
            name="bankRIB"
            value={formData.bankRIB}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            autoComplete="off"
          />
          {errors.bankRIB && <p className="text-red-500 text-sm">{errors.bankRIB}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="montant" className="block text-sm font-medium text-gray-700">
            Montant
          </label>
          <input
            type="text"
            id="montant"
            name="montant"
            value={formData.montant}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            autoComplete="off"
          />
          {errors.montant && <p className="text-red-500 text-sm">{errors.montant}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="montantEnLettre" className="block text-sm font-medium text-gray-700">
            Montant en lettres
          </label>
          <input
            type="text"
            id="montantEnLettre"
            name="montantEnLettre"
            value={formData.montantEnLettre}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            autoComplete="off"
          />
          {errors.montantEnLettre && <p className="text-red-500 text-sm">{errors.montantEnLettre}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft className="mr-2" size={20} />
        Retour
      </Link>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Imprimer Bon d'Echange</h2>
          <p className="text-gray-600 mb-6">Remplissez les informations</p>
          <div className="mb-6">{renderForm()}</div>
          <button
            onClick={handlePrint}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
          >
            <Printer className="mr-2" size={20} />
            Imprimer
          </button>
        </div>
      </div>

      <div className="mt-8 print-visible bg-gray-50">
        <div className="w-[210mm] h-[297mm] bg-white relative overflow-hidden" style={{fontWeight: "bold"}}>
          <div style={{ position: "absolute", top: "37mm", left: "63mm" }}>
            {formData.payeALordreDe}
          </div>

          <div style={{ position: "absolute", top: "53mm", left: "78mm" }}>{formData.echeance}</div>
          <div style={{ position: "absolute", top: "9mm", left: "80mm" }}>{formData.echeance}</div>

          <div style={{ position: "absolute", top: "10mm", left: "114mm" }}>
            {formData.dateDeCreation}
          </div>
          <div style={{ position: "absolute", top: "53mm", left: "50mm" }}>
            {formData.dateDeCreation}
          </div>
          <div style={{ position: "absolute", top: "67mm", left: "148mm" }}>{formData.bankName}</div>

          <div style={{ position: "absolute", top: "18mm", left: "68mm" }}>{formData.bankRIB.substring(0,2)}</div>
          <div style={{ position: "absolute", top: "18mm", left: "82mm" }}>{formData.bankRIB.substring(2,5)}</div>
          <div style={{ position: "absolute", top: "18mm", left: "95mm" }}>{formData.bankRIB.substring(5,18)}</div>
          <div style={{ position: "absolute", top: "18mm", left: "138mm" }}>{formData.bankRIB.substring(18,20)}</div>


          <div style={{ position: "absolute", top: "63mm", left: "22mm" }}>{formData.bankRIB.substring(0,2)}</div>
          <div style={{ position: "absolute", top: "63mm", left: "28mm" }}>{formData.bankRIB.substring(2,5)}</div>
          <div style={{ position: "absolute", top: "64mm", left: "43mm" }}>{formData.bankRIB.substring(5,18)}</div>
          <div style={{ position: "absolute", top: "63mm", left: "88mm" }}>{formData.bankRIB.substring(18,20)}</div>

          <div style={{ position: "absolute", top: "19mm", left: "163mm" }}> # {formData.montant} #</div>
          <div style={{ position: "absolute", top: "34mm", left: "163mm" }}># {formData.montant} #</div>

          <div style={{ position: "absolute", top: "42mm", left: "33mm" }}>
            {formData.montantEnLettre}
          </div>
          <div style={{ position: "absolute", top: "53mm", left: "33mm" }}>{formData.lieu}</div>
          <div style={{ position: "absolute", top: "5mm", left: "118mm" }}>{formData.lieu}</div>

        </div>
      </div>
    </div>
  )
}

export default Print
