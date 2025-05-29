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
  nomEtAdresse: string
}

const initialFormData: BonDeCommandeData = {
  echeance: "",
  documentNumber: "",
  payeALordreDe: "",
  bankName: "",
  dateDeCreation: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
  bankRIB: "",
  montantEnLettre: "",
  montant: "",
  lieu: "Tunis",
  nomEtAdresse: ""
}

const Print: React.FC = () => {
  const [formData, setFormData] = useState<BonDeCommandeData>(initialFormData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})  
  const [suggestions, setSuggestions] = useState<BonDeCommandeData[]>([])
  const [rib, setRib] = useState<string>("")
  const [bankName, setBankName] = useState<string>("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === "montant" && !isNaN(Number(value))) {
      setFormData((prevState) => ({
        ...prevState,
        montantEnLettre: convertAmountToFrench(Number(value)),
      }))
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handlePrint = () => {
    
    // Save form data to localStorage
    const fieldsToSave = {
      payeALordreDe: formData.payeALordreDe,
      bankName: formData.bankName,
      bankRIB: formData.bankRIB,
      lieu: formData.lieu,
      nomEtAdresse: formData.nomEtAdresse
    };
    
    // Check if this entry already exists
    let savedData = localStorage.getItem('savedFormData') ? 
      JSON.parse(localStorage.getItem('savedFormData') || '[]') : [];
    
    // Only add if payeALordreDe doesn't already exist
    const exists = savedData.some((item: any) => 
      item.payeALordreDe === fieldsToSave.payeALordreDe);
    
    if (!exists) {
      savedData = [fieldsToSave, ...savedData].slice(0, 10); // Keep only the 10 most recent entries
      localStorage.setItem('savedFormData', JSON.stringify(savedData));
      setSuggestions(savedData);
    }
    
    window.print();
  }

  useEffect(() => {
    const getInfo = async () => {
      const getInfo = await axios.get('../api/getSocieteInfo')
      console.log(getInfo.data)
      setRib(getInfo.data.rib)
      setBankName(getInfo.data.bank)
    }
    getInfo()
    
    // Load saved form data from localStorage
    const savedFormData = localStorage.getItem('savedFormData')
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData)
        setSuggestions(parsedData)
      } catch (error) {
        console.error('Error parsing saved form data:', error)
      }
    }
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
          <div className="relative">
            <input
              type="text"
              id="payeALordreDe"
              name="payeALordreDe"
              value={formData.payeALordreDe}
              onChange={(e) => {
                handleInputChange(e);
                // Filter suggestions based on input
                if (e.target.value) {
                  const filtered = suggestions.filter(item => 
                    item.payeALordreDe.toLowerCase().includes(e.target.value.toLowerCase()));
                  setSuggestions(filtered.length > 0 ? filtered : suggestions);
                }
              }}
              onFocus={() => {
                // Show all saved suggestions when field is focused
                const savedData = localStorage.getItem('savedFormData');
                if (savedData) {
                  setSuggestions(JSON.parse(savedData));
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              autoComplete="off"
            />
            {formData.payeALordreDe && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFormData(prevState => ({
                        ...prevState,
                        payeALordreDe: suggestion.payeALordreDe,
                        bankName: suggestion.bankName || prevState.bankName,
                        bankRIB: suggestion.bankRIB || prevState.bankRIB,
                        lieu: suggestion.lieu || prevState.lieu,
                        nomEtAdresse: suggestion.nomEtAdresse || prevState.nomEtAdresse
                      }));
                      // Hide suggestions after selection
                      setSuggestions([]);
                    }}
                  >
                    {suggestion.payeALordreDe}
                  </div>
                ))}
              </div>
            )}
          </div>
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
        <div className="space-y-2">
          <label htmlFor="nomEtAdresse" className="block text-sm font-medium text-gray-700">
            Nom et Adresse
          </label>
          <textarea
            id="nomEtAdresse"
            name="nomEtAdresse"
            value={formData.nomEtAdresse}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
              }))
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            autoComplete="off"
            rows={3} // Adjust the number of rows as needed
          />
          {errors.nomEtAdresse && <p className="text-red-500 text-sm">{errors.nomEtAdresse}</p>}
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Imprimer Triate</h2>
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
          <div style={{ position: "absolute", top: "37mm", left: "70mm" }}>
            {formData.payeALordreDe}
          </div>

          <div style={{ position: "absolute", top: "53mm", left: "80mm" }}>{formData.echeance}</div>
          <div style={{ position: "absolute", top: "9mm", left: "80mm" }}>{formData.echeance}</div>

          <div style={{ position: "absolute", top: "10mm", left: "114mm" }}>
            {formData.dateDeCreation}
          </div>
          <div style={{ position: "absolute", top: "53mm", left: "53mm" }}>
            {formData.dateDeCreation}
          </div>
          <div style={{ position: "absolute", top: "67mm", left: "150mm" }}>{formData.bankName}</div>

          <div style={{ position: "absolute", top: "18mm", left: "70mm" }}>{formData.bankRIB.substring(0,2)}</div>
          <div style={{ position: "absolute", top: "18mm", left: "84mm" }}>{formData.bankRIB.substring(2,5)}</div>
          <div style={{ position: "absolute", top: "18mm", left: "97mm" }}>{formData.bankRIB.substring(5,18)}</div>
          <div style={{ position: "absolute", top: "18mm", left: "140mm" }}>{formData.bankRIB.substring(18,20)}</div>


          <div style={{ position: "absolute", top: "63mm", left: "26mm" }}>{formData.bankRIB.substring(0,2)}</div>
          <div style={{ position: "absolute", top: "63mm", left: "36mm" }}>{formData.bankRIB.substring(2,5)}</div>
          <div style={{ position: "absolute", top: "63mm", left: "47mm" }}>{formData.bankRIB.substring(5,18)}</div>
          <div style={{ position: "absolute", top: "63mm", left: "90mm" }}>{formData.bankRIB.substring(18,20)}</div>

          <div style={{ position: "absolute", top: "19mm", left: "163mm" }}> # {formData.montant} #</div>
          <div style={{ position: "absolute", top: "33mm", left: "163mm" }}># {formData.montant} #</div>
          
          <div style={{ position: "absolute", top: "42mm", left: "35mm" }}>
            {formData.montantEnLettre}
          </div>
          <div style={{ position: "absolute", top: "53mm", left: "35mm" }}>{formData.lieu}</div>
          <div style={{ position: "absolute", top: "5mm", left: "120mm" }}>{formData.lieu}</div>
           <div style={{ position: "absolute", top: "69mm", left: "105mm" }} className="text-sm mb-2" dangerouslySetInnerHTML={{ __html: formData.nomEtAdresse.replace(/\n/g, '<br />') }}></div>
        </div>
      </div>
    </div>
  )
}

export default Print
