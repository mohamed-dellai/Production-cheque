'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Cheque, ChequeType } from '../types/cheque'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface TableauDeBordGraphiqueProps {
  cheques: Cheque[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function TableauDeBordGraphique({ cheques }: TableauDeBordGraphiqueProps) {
  const [selectedChart, setSelectedChart] = useState<string>('mois')
  const [selectedChequeType, setSelectedChequeType] = useState<ChequeType>('a-payer')

  const filteredCheques = cheques.filter(cheque => cheque.type === selectedChequeType)

  const montantParType = filteredCheques.reduce((acc, cheque) => {
    acc[cheque.type] = (acc[cheque.type] || 0) + cheque.amount
    return acc
  }, {} as Record<ChequeType, number>)

  const montantParBanque = filteredCheques.reduce((acc, cheque) => {
    acc[cheque.bank] = (acc[cheque.bank] || 0) + cheque.amount
    return acc
  }, {} as Record<string, number>)

  const chequesParStatut = filteredCheques.reduce((acc, cheque) => {
    acc[cheque.status] = (acc[cheque.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const montantParMois = filteredCheques.reduce((acc, cheque) => {
    const date = new Date(cheque.date)
    const moisAnnee = `${date.getMonth() + 1}/${date.getFullYear()}`
    acc[moisAnnee] = (acc[moisAnnee] || 0) + cheque.amount
    return acc
  }, {} as Record<string, number>)
  const montantParMoisEnAttente = filteredCheques.filter(cheque=> cheque.status!=="encaisse").reduce((acc, cheque) => {
   
    const date = new Date(cheque.date)
    const moisAnnee = `${date.getMonth() + 1}/${date.getFullYear()}`
    acc[moisAnnee] = (acc[moisAnnee] || 0) + cheque.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = {
    montants: Object.entries(montantParType).map(([type, montant]) => ({
      name: type === 'a-payer' ? 'À Payer' : 'À Recevoir',
      montant
    })),
    banques: Object.entries(montantParBanque).map(([bank, montant]) => ({
      name: bank,
      montant
    })),
    statuts: Object.entries(chequesParStatut).map(([status, count]) => ({
      name: status === 'en-attente' ? 'En Attente' : status === 'encaisse' ? 'Encaissé' : status === 'a-deposer' ? 'À Déposer' : 'Rejeté',
      value: count
    })),
    mois: Object.entries(montantParMois)
      .map(([mois, montant]) => ({
        name: mois,
        montant
      }))
      .sort((a, b) => {
        const dateA = new Date(`${a.name.split('/')[1]}-${a.name.split('/')[0]}-01`)
        const dateB = new Date(`${b.name.split('/')[1]}-${b.name.split('/')[0]}-01`)
        return dateA.getTime() - dateB.getTime()
      }),
    moisEnAttente: Object.entries(montantParMoisEnAttente).map( ([mois, montant]) => ({
      name: mois,
      montant
    })).sort((a, b) => {
      const dateA = new Date(`${a.name.split('/')[1]}-${a.name.split('/')[0]}-01`)
      const dateB = new Date(`${b.name.split('/')[1]}-${b.name.split('/')[0]}-01`)
      return dateA.getTime() - dateB.getTime()
    } )
  }

  const renderChart = () => {
    switch (selectedChart) {
      case 'montants':
      case 'banques':
      case 'mois':
      case 'moisEnAttente':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData[selectedChart]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="montant" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'statuts':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.statuts}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.statuts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tableau de Bord Graphique</CardTitle>
        <CardDescription>Visualisation des données des chèques</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={selectedChart} onValueChange={setSelectedChart}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un graphique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="montants">Montants par Type</SelectItem>
              <SelectItem value="banques">Montants par Banque</SelectItem>
              <SelectItem value="statuts">Répartition des Statuts</SelectItem>
              <SelectItem value="mois">Montants par Mois</SelectItem>
              <SelectItem value="moisEnAttente">Montants no payeé par Mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Select value={selectedChequeType} onValueChange={(value) => setSelectedChequeType(value as ChequeType)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type de chèque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a-recevoir">Client</SelectItem>
              <SelectItem value="a-payer">Fournisseur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {renderChart()}
      </CardContent>
    </Card>
  )
}


