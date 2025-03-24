export type ChequeType = 'a-payer' | 'a-recevoir';

export type ChequeStatus = 'en-attente' | 'encaisse' | 'a-deposer';
export type chequeOuqb= 'cheque' | 'kimbielle' | 'espece';
export interface Cheque {
  id: number;
  type: ChequeType;
  typeDepapier: chequeOuqb;
  bank: string;
  number: string;
  amount: number;
  date: string;
  beneficiary: string;
  status: ChequeStatus;
  notes?: string;
  savedAt: string;
  imageUrl: string;
}

export type FilterOption = 'tous' | 'cette-semaine' | 'ce-mois' | ChequeStatus;

