import { useState, useMemo, useEffect, useContext } from "react"
import type { Cheque, ChequeType, chequeOuqb } from "@/types/cheque"
import { ElementCheque } from "@/components/element-cheque"
import { Button } from "@/components/ui/button"
import { CustomAlert } from "../components/custom-alerte"
import { List, Grid, AlertCircle } from "lucide-react"
import { UserContext } from "../app/context/context"
import { Input } from "@/components/ui/input"

function filtrerCheques(cheques: Cheque[], type: ChequeType, filtres: any): Cheque[] {
  // Log for debugging if needed:

  if (!filtres) return cheques.filter((cheque) => cheque.type === type)

  return cheques
    .filter((cheque) => cheque.type === type)
    .filter((cheque) => {
      const dateCheque = new Date(cheque.date)
      const dateDebut = filtres.dateDebut ? new Date(filtres.dateDebut) : null
      const dateFin = filtres.dateFin ? new Date(filtres.dateFin) : null

      return (
        (!dateDebut || dateCheque >= dateDebut) &&
        (!dateFin || dateCheque <= dateFin) &&
        (!filtres.montantMin || cheque.amount >= Number(filtres.montantMin)) &&
        (!filtres.montantMax || cheque.amount <= Number(filtres.montantMax)) &&
        (filtres.statuts.length === 0 || filtres.statuts.includes(cheque.status)) &&
        (filtres.banques.length === 0 || filtres.banques.includes(cheque.bank)) &&
        (filtres.typePapier.length === 0 || filtres.typePapier.includes(cheque.typeDepapier as chequeOuqb)) &&
        (filtres.beneficiary.length === 0 || filtres.beneficiary.includes(cheque.beneficiary.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")))
      )
    })
}

interface ListeChequesProps {
  type: ChequeType
  cheques: Cheque[]
  filtres: any
  onUpdateCheque: (updatedCheque: Cheque) => void
}

export function ListeCheques({ type, cheques, filtres, onUpdateCheque }: ListeChequesProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showOverdueOnly, setShowOverdueOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const userContext = useContext(UserContext)
  function chekOverdue(cheque: Cheque): boolean{
    const now = new Date()

    {
      let chequeDate = new Date(cheque.date)
     
// For kimbielle type checks, use 7 days before now as overdue date
if (cheque.typeDepapier === "kimbielle") {
  const sevenDaysFromNow = new Date(cheque.date);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() - 7);
  console.log(sevenDaysFromNow, "sevenDaysFromNow", cheque.amount)
  chequeDate = sevenDaysFromNow;
}
      console.log( chequeDate < now)    
      return ((chequeDate < now) && (cheque.status === "en-attente" || cheque.status==='a-deposer'))
    }
  }
  const chequesToDisplay = useMemo(() => {
    const now = new Date()
    const filtered = filtrerCheques(cheques, type, filtres)
    
    const searched = searchQuery
      ? filtered.filter((cheque) =>
          Object.values(cheque).some(
            (value) => typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        )
      : filtered

    const overdue = searched.filter((cheque) => chekOverdue(cheque))

    return showOverdueOnly ? overdue : searched
  }, [cheques, type, filtres, showOverdueOnly, searchQuery])

  useEffect(() => {
    if (userContext) {
      userContext.setVvisibleCheques(chequesToDisplay)
    }
  }, [chequesToDisplay, userContext]) // Added userContext to dependencies

  return (
    <div>
      <Input
        type="text"
        placeholder="Rechercher un chèque..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <div className="flex justify-between items-center mb-4">
        <Button
          variant={showOverdueOnly ? "secondary" : "outline"}
          onClick={() => setShowOverdueOnly(!showOverdueOnly)}
          className="flex items-center"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          {showOverdueOnly ? "Tous les chèques" : "Chèques en retard"}
        </Button>
        <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}>
          {viewMode === "card" ? <List size={20} /> : <Grid size={20} />}
        </Button>
      </div>

      {chequesToDisplay.filter((cheque) => new Date(cheque.date) < new Date() && cheque.status === "en-attente")
        .length > 0 && (
        <CustomAlert
          variant="destructive"
          title="Chèques en retard"
          description={`Il y a ${
            chequesToDisplay.filter((cheque) => new Date(cheque.date) < new Date() && cheque.status === "en-attente")
              .length
          } chèque(s) en retard qui nécessite(nt) votre attention.`}
        />
      )}

      <div className={viewMode === "card" ? "space-y-4" : "space-y-2"}>
        {chequesToDisplay.map((cheque) => (
          <ElementCheque
            key={cheque.id}
            cheque={cheque}
            onUpdate={onUpdateCheque}
            viewMode={viewMode}
            isOverdue={chekOverdue(cheque)}
          />
        ))}
      </div>

      {chequesToDisplay.length === 0 && <p className="text-center text-gray-500 mt-4">Aucun chèque à afficher.</p>}
    </div>
  )
}

