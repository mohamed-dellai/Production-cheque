import { Cheque, ChequeType } from '@/types/cheque'

export function calculerTotalCheques(cheques: Cheque[], type: ChequeType): number {
  return cheques
    .filter(cheque => cheque.type === type && cheque.status !== "encaisse")
    .reduce((total, cheque) => total + cheque.amount,0)
}

