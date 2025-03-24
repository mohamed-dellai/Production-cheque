'use client'

import { useState } from 'react'
import { Cheque, ChequeStatus, chequeOuqb } from '../types/cheque'

interface ModalEditionChequeProps {
  cheque: Cheque;
  onSave: (updatedCheque: Cheque) => void;
}

export function ModalEditionCheque({ cheque, onSave }: ModalEditionChequeProps) {
  const [chequeEdite, setChequeEdite] = useState<Cheque>(cheque)
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    onSave(chequeEdite)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left p-2 hover:bg-slate-100 rounded transition-colors duration-200"
      >
        Éditer
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Éditer le Chèque</h2>
          <div className="space-y-4">
            <div style={{display: chequeEdite.typeDepapier!=="espece" ? "block" : "none"}}>
              <label htmlFor="bank" className="block text-sm font-medium text-slate-600">Banque</label>
              <input
                id="bank"
                type="text"
                value={chequeEdite.bank}
                onChange={(e) => setChequeEdite({ ...chequeEdite, bank: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div style={{display: chequeEdite.typeDepapier!=="espece" ? "block" : "none"}}>
              <label htmlFor="number" className="block text-sm font-medium text-slate-600">Numéro</label>
              <input
                id="number"
                type="text"
                value={chequeEdite.number}
                onChange={(e) => setChequeEdite({ ...chequeEdite, number: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-600">Montant</label>
              <input
                id="amount"
                type="number"
                value={chequeEdite.amount}
                onChange={(e) => setChequeEdite({ ...chequeEdite, amount: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-600">Date</label>
              <input
                id="date"
                type="date"
                value={chequeEdite.date.split('T')[0]}
                onChange={(e) => setChequeEdite({ ...chequeEdite, date: new Date(e.target.value).toISOString() })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="beneficiary" className="block text-sm font-medium text-slate-600">Ordre</label>
              <input
                id="beneficiary"
                type="text"
                value={chequeEdite.beneficiary}
                onChange={(e) => setChequeEdite({ ...chequeEdite, beneficiary: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-600">Type de paiment</label>
              <select
                id="KIMBIELLEOUCHEQUE"
                value={chequeEdite.typeDepapier}
                onChange={(e) => setChequeEdite({ ...chequeEdite, typeDepapier: e.target.value as chequeOuqb })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="cheque">Cheque</option>
                <option value="kimbielle">Kimbielle</option>
                <option value="espece">Espéce</option>
              </select>

              <label style={{display: chequeEdite.typeDepapier!=="espece" ? "block" : "none"}} htmlFor="status" className="block text-sm font-medium text-slate-600">Statut</label>
              <select style={{display: chequeEdite.typeDepapier!=="espece" ? "block" : "none"}}
                id="status"
                value={chequeEdite.status}
                onChange={(e) => setChequeEdite({ ...chequeEdite, status: e.target.value as ChequeStatus })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="en-attente">En Attente</option>
                <option value="encaisse">Encaissé</option>
                <option value="a-deposer">À Déposer</option>
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-600">Notes</label>
              <textarea
                id="notes"
                value={chequeEdite.notes || ''}
                onChange={(e) => setChequeEdite({ ...chequeEdite, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={3}
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

