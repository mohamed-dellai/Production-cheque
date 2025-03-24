'use client';

import { useState, useRef, useCallback, Ref } from 'react';
import { ChequeType, Cheque, chequeOuqb } from '../types/cheque';
import { Camera, Edit } from 'lucide-react';
import { saveImageToFirebase } from "../utils/uploadImgae"
import axios from "axios"
import { blobToBase64 } from '../utils/blobToBase64';
import { compressImage } from '../utils/compression';
interface CaptureChequeProps {
  onCapture: (cheque: Omit<Cheque, 'id'>) => void;
}

export function CaptureCheque({ onCapture }: CaptureChequeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chequeType, setChequeType] = useState<ChequeType>('a-payer');
  const [typePapier, setTypePapier] = useState<chequeOuqb>('kimbielle');
  const [isLoading, setIsLoading] = useState(false);

  const [manualCheque, setManualCheque] = useState<Omit<Cheque, 'id'>>({
    type: 'a-payer',
    bank: '',
    number: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    beneficiary: '',
    status: 'en-attente',
    savedAt: new Date().toISOString(),
    imageUrl: '',
    typeDepapier: "kimbielle"
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleTypePapierChange = useCallback((newTypePapier: chequeOuqb) => {
    setTypePapier(newTypePapier);
    if(newTypePapier === "espece") {
      if(buttonRef.current)
      buttonRef.current.style.display="none"
    } else {
      if(buttonRef.current)
      buttonRef.current.style.display="block"
    }
    setManualCheque({ ...manualCheque, typeDepapier: newTypePapier });
  }, [manualCheque]);

  

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Compress the image
      const compressedFile = await compressImage(file);

      const blob = new Blob([compressedFile], { type: compressedFile.type });
      let base64Data = await blobToBase64(blob);
      base64Data = base64Data.replace(/^data:.+?;base64,/, '');

      const [result, res] = await Promise.all([
        axios.post("api/getInfo", { url: base64Data, type: typePapier, clientOufour: chequeType }),
        saveImageToFirebase(blob)
      ]);
      console.log(result.data);
      if(result.data.date!==null)
      result.data.date.replace("-", "/");
      const newCheque: Omit<Cheque, 'id'> = {
        type: chequeType,
        bank: result.data.BankName,
        number: result.data.chequeNum,
        amount: result.data.amount !== null ? parseFloat(result.data.amount.replace(",", ".")) : -1,
        date: new Date(result.data.date !== null ? result.data.date : "1/1/1970").toISOString(),
        beneficiary: result.data.owner,
        status: 'en-attente',
        savedAt: new Date().toISOString(),
        imageUrl: res,
        typeDepapier: typePapier
      };
      onCapture(newCheque);
    } catch(e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [chequeType, onCapture, typePapier]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(manualCheque);
    onCapture(manualCheque);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-xl rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Capturer un Chèque</h2>
        <div className="space-y-4">
          <select
            value={chequeType}
            onChange={(e) => {
              setChequeType(e.target.value as ChequeType);
              setManualCheque({ ...manualCheque, type: e.target.value as ChequeType });
            }}
            className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="a-payer">Fournisseur</option>
            <option value="a-recevoir">Client</option>
          </select>

          <select
            value={typePapier}
            onChange={(e) => handleTypePapierChange(e.target.value as chequeOuqb)}
            className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="cheque">Cheque</option>
            <option value="kimbielle">Bon d'echange</option>
            <option value="espece">Espéce</option>

          </select>

          <div className="flex space-x-2">
            <button
              ref={buttonRef}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-white text-indigo-700 hover:bg-indigo-100 font-semibold py-2 px-4 rounded-md flex items-center justify-center"
            >
              <Camera className="mr-2 h-4 w-4" /> Capturer une Image
            </button>
            <button
              onClick={handleManualSubmit}
              className="flex-1 bg-white text-indigo-700 hover:bg-indigo-100 font-semibold py-2 px-4 rounded-md flex items-center justify-center"
            >
              <Edit className="mr-2 h-4 w-4" /> Saisie Manuelle
            </button>
          </div>

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

          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-white h-12 w-12"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

