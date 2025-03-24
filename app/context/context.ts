// contexts/UserContext.tsx
import { createContext } from 'react';
import { Cheque } from '../../types/cheque';

interface UserContextType {
  visibleCheques: Cheque[];
  setVvisibleCheques: React.Dispatch<React.SetStateAction<Cheque[]>>;
}

export const UserContext = createContext<UserContextType | null>(null);
