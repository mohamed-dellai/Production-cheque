import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import type { Cheque, ChequeType, ChequeStatus, chequeOuqb } from "../types/cheque"

interface FiltreAvance {
  dateDebut: string
  dateFin: string
  montantMin: string
  montantMax: string
  statuts: ChequeStatus[]
  banques: string[]
  typePapier: chequeOuqb[]
  beneficiary: string[]
}

interface ModalFiltreAvanceProps {
  type: ChequeType
  appliquerFiltres: (filtres: FiltreAvance) => void
  cheques: Cheque[]
}

export function ModalFiltreAvance({ type, appliquerFiltres, cheques }: ModalFiltreAvanceProps) {
  const [open, setOpen] = useState(false)
  const [filtres, setFiltres] = useState<FiltreAvance>({
    dateDebut: "",
    dateFin: "",
    montantMin: "",
    montantMax: "",
    statuts: [],
    banques: [],
    typePapier: [] as chequeOuqb[],
    beneficiary: [],
  })
  const [beneficiarySearch, setBeneficiarySearch] = useState("")
  const beneficiaries: string[] = []
  const map = new Map<string, string>()
  for (const cheque of cheques) {
      if(map.has(cheque.beneficiary.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
          continue
      }
      beneficiaries.push(cheque.beneficiary.toLocaleUpperCase())
      map.set(cheque.beneficiary.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), cheque.beneficiary)
  }
  const handleCheckboxChange = (value: ChequeStatus) => {
    setFiltres((prev) => ({
      ...prev,
      statuts: prev.statuts.includes(value)
        ? prev.statuts.filter((status) => status !== value)
        : [...prev.statuts, value],
    }))
  }

  const handleTypePapierChange = (value: chequeOuqb) => {
    setFiltres((prev) => ({
      ...prev,
      typePapier: prev.typePapier.includes(value)
        ? prev.typePapier.filter((type) => type !== value)
        : [...prev.typePapier, value],
    }))
  }

  const handleBeneficiaryChange = (value: string) => {
    setFiltres((prev) => ({
      ...prev,
      beneficiary: prev.beneficiary.includes(value)
        ? prev.beneficiary.filter((beneficiary) => beneficiary !== value)
        : [...prev.beneficiary, value],
    }))
    console.log(filtres.beneficiary)
  }

  const handleAppliquerFiltres = () => {
    appliquerFiltres(filtres)
    setOpen(false)
  }

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) =>
    beneficiary.toLowerCase().includes(beneficiarySearch.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Filtres Avancés</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtres Avancés pour Chèques {type === "a-payer" ? "à Payer" : "à Recevoir"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="dateDebut">Date de début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={filtres.dateDebut}
                onChange={(e) => setFiltres({ ...filtres, dateDebut: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="dateFin">Date de fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={filtres.dateFin}
                onChange={(e) => setFiltres({ ...filtres, dateFin: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="montantMin">Montant min</Label>
              <Input
                id="montantMin"
                type="number"
                value={filtres.montantMin}
                onChange={(e) => setFiltres({ ...filtres, montantMin: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="montantMax">Montant max</Label>
              <Input
                id="montantMax"
                type="number"
                value={filtres.montantMax}
                onChange={(e) => setFiltres({ ...filtres, montantMax: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Statut</Label>
            <div className="flex space-x-4">
              {["en-attente", "encaisse", "a-deposer"].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={status}
                    checked={filtres.statuts.includes(status as ChequeStatus)}
                    onCheckedChange={() => handleCheckboxChange(status as ChequeStatus)}
                  />
                  <label htmlFor={status}>
                    {status === "en-attente" ? "En Attente" : status === "encaisse" ? "Encaissé" : "À Déposer"}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label>Type Papier</Label>
            <div className="flex space-x-4">
              {["cheque", "kimbielle"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filtres.typePapier.includes(type as chequeOuqb)}
                    onCheckedChange={() => handleTypePapierChange(type as chequeOuqb)}
                  />
                  <label htmlFor={type}>{type === "cheque" ? "Cheque" : "Bon d'echange"}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Bénéficiaire</Label>
            <Input
              placeholder="Rechercher un bénéficiaire"
              value={beneficiarySearch}
              onChange={(e) => setBeneficiarySearch(e.target.value)}
            />
            <div className="h-[200px] w-full rounded-md border overflow-y-auto">
              <div className="p-4">
                {filteredBeneficiaries.map((beneficiary) => (
                  <div key={beneficiary} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`beneficiary-${beneficiary}`}
                      checked={filtres.beneficiary.includes(beneficiary)}
                      onCheckedChange={() => handleBeneficiaryChange(beneficiary)}
                    />
                    <label htmlFor={`beneficiary-${beneficiary}`}>{beneficiary}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleAppliquerFiltres}>Appliquer les filtres</Button>
      </DialogContent>
    </Dialog>
  )
}

