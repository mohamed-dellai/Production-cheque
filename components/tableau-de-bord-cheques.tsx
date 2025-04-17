"use client"

import { useState, useEffect } from "react"
import { ListeCheques } from "./liste-cheques"
import { ModalFiltreAvance } from "./modal-filtre-avance"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import type { ChequeType, Cheque } from "../types/cheque"

interface TableauDeBordChequesProps {
  type: ChequeType
  cheques: Cheque[]
  onUpdateCheque: (updatedCheque: Cheque) => void
  
}

type SortCriteria = "amount" | "date" | "savedAt"
type SortOrder = "asc" | "desc" | null

export function TableauDeBordCheques({ type, cheques, onUpdateCheque }: TableauDeBordChequesProps) {
  const [filtresActifs, setFiltresActifs] = useState<any>(null)
  const [sortCriteria, setSortCriteria] = useState<SortCriteria | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [sortedCheques, setSortedCheques] = useState<Cheque[]>([])

  const titre = type === "a-payer" ? "à Payer" : "à Recevoir"

  const appliquerFiltres = (filtres: any) => {
    setFiltresActifs(filtres)
  }

  useEffect(() => {
    const sorted = [...cheques]
    if (sortCriteria && sortOrder) {
      sorted.sort((a, b) => {
        let comparison = 0
        if (sortCriteria === "amount") {
          comparison = a.amount - b.amount
        } else if (sortCriteria === "date") {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        } else if (sortCriteria === "savedAt") {
          comparison = new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
        }
        return sortOrder === "asc" ? comparison : -comparison
      })
    }
    setSortedCheques(sorted)
  }, [cheques, sortCriteria, sortOrder])

  const handleSortChange = (criteria: SortCriteria) => {
    if (sortCriteria === criteria) {
      if (sortOrder === "asc") {
        setSortOrder("desc")
      } else if (sortOrder === "desc") {
        setSortCriteria(null)
        setSortOrder(null)
      } else {
        setSortOrder("asc")
      }
    } else {
      setSortCriteria(criteria)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (criteria: SortCriteria) => {
    if (sortCriteria === criteria) {
      if (sortOrder === "asc") {
        return <ArrowUp className="ml-2 h-4 w-4" />
      } else if (sortOrder === "desc") {
        return <ArrowDown className="ml-2 h-4 w-4" />
      }
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{titre}</CardTitle>
        <ModalFiltreAvance type={type} appliquerFiltres={appliquerFiltres} cheques={cheques} />
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4" style={{flexWrap: "wrap"}}>
          <Button
            onClick={() => handleSortChange("amount")}
            variant={sortCriteria === "amount" ? "secondary" : "outline"}
            className="flex-1"
          >
            Montant
            {getSortIcon("amount")}
          </Button>
          <Button
            onClick={() => handleSortChange("date")}
            variant={sortCriteria === "date" ? "secondary" : "outline"}
            className="flex-1"
          >
            Date
            {getSortIcon("date")}
          </Button>
          <Button
            onClick={() => handleSortChange("savedAt")}
            variant={sortCriteria === "savedAt" ? "secondary" : "outline"}
            className="flex-1"
          >
            Date d'Enregistrement
            {getSortIcon("savedAt")}
          </Button>
        </div>
        <ListeCheques  type={type} cheques={sortedCheques} filtres={filtresActifs} onUpdateCheque={onUpdateCheque} />
      </CardContent>
    </Card>
  )
}

