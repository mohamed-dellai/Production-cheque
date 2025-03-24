"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Cheque } from '../../types/cheque';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from "axios"

interface WeeklyRiskResult {
  weekOffset: number
  candidateDate: Date
  availableCash: {
    worst: number
    average: number
    bestCase: number
    worstCase: number
  }
  riskPercentage: {
    worst: number
    average: number
    bestCase: number
    worstCase: number
  }
}

function getRiskLevel(riskPercentage: number): string {
  if (riskPercentage <= 20) return "Low"
  if (riskPercentage <= 50) return "Medium"
  if (riskPercentage <= 80) return "High"
  return "Critical"
}

function getRecommendation(riskLevel: string): string {
    switch (riskLevel) {
        case "Low":
            return "La position financière actuelle est solide. Envisagez d'investir dans des opportunités de croissance."
        case "Medium":
            return "Surveillez de près les flux de trésorerie. Envisagez de négocier de meilleures conditions de paiement avec les fournisseurs."
        case "High":
            return "Prenez des mesures immédiates pour améliorer les flux de trésorerie. Envisagez de réduire les dépenses non essentielles et d'accélérer les comptes clients."
        case "Critical":
            return "Action urgente requise. Cherchez un financement supplémentaire ou négociez avec les créanciers pour éviter un défaut potentiel."
        default:
            return "Impossible de fournir une recommandation basée sur les données actuelles."
    }
}

export default function AdvancedPaymentRiskCalculator() {
  const [currentBalance, setCurrentBalance] = useState<number>(1000)
  const [worstMonthSales, setWorstMonthSales] = useState<number>(400)
  const [averageMonthSales, setAverageMonthSales] = useState<number>(600)
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(300)
  const [supplierPaymentAmount, setSupplierPaymentAmount] = useState<number>(2500)
  const [maxMonths, setMaxMonths] = useState<number>(3)
  const [results, setResults] = useState<WeeklyRiskResult[]>([])
  const [selectedWeek, setSelectedWeek] = useState<number>(0)
  const [cheques, setCheques] = useState<Cheque[]>([]);

  useEffect(() => {
    async function fet() {
        const {data: cheques} = await axios.get<Cheque[]>('/api/calculPredection');
        setCheques(cheques);
    }
    fet();
  }, []);
    


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const weeklyResults = calculateWeeklyRisk(
      currentBalance,
      worstMonthSales,
      averageMonthSales,
      monthlyExpenses,
      supplierPaymentAmount,
      maxMonths,
      cheques.map((cheque) => ({
        amount: cheque.amount,
        dateOfPayment: new Date(cheque.date),
      })),
    )
    setResults(weeklyResults)
    setSelectedWeek(0)
  }

  function addWeeks(date: Date, weeks: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + weeks * 7)
    return result
  }

  function calculateWeeklyRisk(
    currentBalance: number,
    worstMonthSales: number,
    averageMonthSales: number,
    monthlyExpenses: number,
    supplierPayment: number,
    maxMonths: number,
    futurePayments: { amount: number; dateOfPayment: Date }[],
  ): WeeklyRiskResult[] {
    const results: WeeklyRiskResult[] = []
    const today = new Date()
    const maxWeeks = maxMonths * 4
    const worstWeekSales = worstMonthSales / 4
    const averageWeekSales = averageMonthSales / 4
    const bestCaseWeekSales = averageWeekSales * 1.2
    const worstCaseWeekSales = worstWeekSales * 0.8
    const weeklyExpenses = monthlyExpenses / 4

    for (let week = 0; week <= maxWeeks; week++) {
      const candidateDate = addWeeks(today, week)
      var totalFuturePayments = futurePayments.reduce((sum, payment) => {
        if (payment.dateOfPayment <= candidateDate) {
          return sum + payment.amount
        }
        return sum
      }, 0)

      const calculateCashAndRisk = (weeklySales: number) => {
        const totalInflow = weeklySales * week
        const totalExpenses = weeklyExpenses * week
        const availableCash = currentBalance + totalInflow - totalExpenses - totalFuturePayments
        const riskPercentage = availableCash > 0 ? Math.min(100, (supplierPayment / availableCash) * 100) : 100
        return { availableCash, riskPercentage }
      }

      const worst = calculateCashAndRisk(worstWeekSales)
      const average = calculateCashAndRisk(averageWeekSales)
      const bestCase = calculateCashAndRisk(bestCaseWeekSales)
      const worstCase = calculateCashAndRisk(worstCaseWeekSales)

      results.push({
        weekOffset: week,
        candidateDate,
        availableCash: {
          worst: worst.availableCash,
          average: average.availableCash,
          bestCase: bestCase.availableCash,
          worstCase: worstCase.availableCash,
        },
        riskPercentage: {
          worst: worst.riskPercentage,
          average: average.riskPercentage,
          bestCase: bestCase.riskPercentage,
          worstCase: worstCase.riskPercentage,
        },
      })
    }
    
    return results
  }

return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Calculateur Avancé de Risque de Paiement</CardTitle>
            <CardDescription className="text-gray-600">
                Calculez et visualisez les risques de paiement au fil du temps avec plusieurs scénarios
            </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentBalance" className="text-sm font-medium text-gray-700">
                            Solde Actuel (HT)
                        </Label>
                        <Input
                            id="currentBalance"
                            type="number"
                            value={currentBalance}
                            onChange={(e) => setCurrentBalance(Number(e.target.value))}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="worstMonthSales" className="text-sm font-medium text-gray-700">
                            Ventes du Mois le Plus Bas (HT)
                        </Label>
                        <Input
                            id="worstMonthSales"
                            type="number"
                            value={worstMonthSales}
                            onChange={(e) => setWorstMonthSales(Number(e.target.value))}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="averageMonthSales" className="text-sm font-medium text-gray-700">
                            Ventes Moyennes Mensuelles (HT)
                        </Label>
                        <Input
                            id="averageMonthSales"
                            type="number"
                            value={averageMonthSales}
                            onChange={(e) => setAverageMonthSales(Number(e.target.value))}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="monthlyExpenses" className="text-sm font-medium text-gray-700">
                            Dépenses Mensuelles (HT)
                        </Label>
                        <Input
                            id="monthlyExpenses"
                            type="number"
                            value={monthlyExpenses}
                            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="supplierPaymentAmount" className="text-sm font-medium text-gray-700">
                            Montant du Paiement Fournisseur (HT)
                        </Label>
                        <Input
                            id="supplierPaymentAmount"
                            type="number"
                            value={supplierPaymentAmount}
                            onChange={(e) => setSupplierPaymentAmount(Number(e.target.value))}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxMonths" className="text-sm font-medium text-gray-700">
                            Mois Maximum
                        </Label>
                        <Input
                            id="maxMonths"
                            type="number"
                            value={maxMonths}
                            onChange={(e) => setMaxMonths(Number(e.target.value))}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Calculer le Risque
                </Button>
            </form>
        </CardContent>
        <CardFooter className="flex-col items-start">
            {results.length > 0 && (
                <div className="w-full space-y-6">
                    <Tabs defaultValue="graph" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="graph">Graphique de Risque</TabsTrigger>
                            <TabsTrigger value="table">Résultats Détaillés</TabsTrigger>
                            <TabsTrigger value="analysis">Analyse de Risque</TabsTrigger>
                        </TabsList>
                        <TabsContent value="graph" className="mt-4">
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={results}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="weekOffset" label={{ value: "Semaines", position: "insideBottom", offset: -5 }} />
                                    <YAxis label={{ value: "Risque (%)", angle: -90, position: "insideLeft" }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="riskPercentage.worst"
                                        name="Pire"
                                        stroke="#ff0000"
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="riskPercentage.average"
                                        name="Moyenne"
                                        stroke="#00ff00"
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="riskPercentage.bestCase"
                                        name="Meilleur Cas"
                                        stroke="#0000ff"
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="riskPercentage.worstCase"
                                        name="Pire Cas"
                                        stroke="#ff00ff"
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="mt-4">
                                <Label htmlFor="weekSelect" className="text-sm font-medium text-gray-700">
                                    Sélectionnez la Semaine pour une Analyse Détaillée
                                </Label>
                                <Select value={selectedWeek.toString()} onValueChange={(value) => setSelectedWeek(Number(value))}>
                                    <SelectTrigger id="weekSelect" className="mt-2">
                                        <SelectValue placeholder="Sélectionnez une semaine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {results.map((_, index) => (
                                            <SelectItem key={index} value={index.toString()}>
                                                Semaine {index}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                        <TabsContent value="table" className="mt-4">
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {results.map((result) => (
                                    <div key={result.weekOffset} className="bg-gray-50 p-2 rounded shadow">
                                        <h4 className="font-medium">Semaine {result.weekOffset}</h4>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                            <div>
                                                <span className="text-sm text-gray-600">Pire :</span>
                                                <span className="block text-red-600">Risque : {result.riskPercentage.worst.toFixed(2)}%</span>
                                                <span className="block">Trésorerie : ${result.availableCash.worst.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Moyenne :</span>
                                                <span className="block text-green-600">
                                                    Risque : {result.riskPercentage.average.toFixed(2)}%
                                                </span>
                                                <span className="block">Trésorerie : ${result.availableCash.average.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Meilleur Cas :</span>
                                                <span className="block text-blue-600">
                                                    Risque : {result.riskPercentage.bestCase.toFixed(2)}%
                                                </span>
                                                <span className="block">Trésorerie : ${result.availableCash.bestCase.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Pire Cas :</span>
                                                <span className="block text-purple-600">
                                                    Risque : {result.riskPercentage.worstCase.toFixed(2)}%
                                                </span>
                                                <span className="block">Trésorerie : ${result.availableCash.worstCase.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
              </TabsContent>
              <TabsContent value="analysis" className="mt-4">
                {results[selectedWeek] && (
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Risk Analysis for Week {selectedWeek}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700">Worst Scenario</h4>
                        <p className="text-red-600">Risk: {results[selectedWeek].riskPercentage.worst.toFixed(2)}%</p>
                        <p>Availabl Cash: ${results[selectedWeek].availableCash.worst.toFixed(2)}</p>
                        <p className="mt-2">Risk Level: {getRiskLevel(results[selectedWeek].riskPercentage.worst)}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {getRecommendation(getRiskLevel(results[selectedWeek].riskPercentage.worst))}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Average Scenario</h4>
                        <p className="text-green-600">
                          Risk: {results[selectedWeek].riskPercentage.average.toFixed(2)}%
                        </p>
                        <p>Available Cash: ${results[selectedWeek].availableCash.average.toFixed(2)}</p>
                        <p className="mt-2">Risk Level: {getRiskLevel(results[selectedWeek].riskPercentage.average)}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {getRecommendation(getRiskLevel(results[selectedWeek].riskPercentage.average))}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Best Case Scenario</h4>
                        <p className="text-blue-600">
                          Risk: {results[selectedWeek].riskPercentage.bestCase.toFixed(2)}%
                        </p>
                        <p>Available Cash: ${results[selectedWeek].availableCash.bestCase.toFixed(2)}</p>
                        <p className="mt-2">
                          Risk Level: {getRiskLevel(results[selectedWeek].riskPercentage.bestCase)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {getRecommendation(getRiskLevel(results[selectedWeek].riskPercentage.bestCase))}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Worst Case Scenario</h4>
                        <p className="text-purple-600">
                          Risk: {results[selectedWeek].riskPercentage.worstCase.toFixed(2)}%
                        </p>
                        <p>Available Cash: ${results[selectedWeek].availableCash.worstCase.toFixed(2)}</p>
                        <p className="mt-2">
                          Risk Level: {getRiskLevel(results[selectedWeek].riskPercentage.worstCase)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {getRecommendation(getRiskLevel(results[selectedWeek].riskPercentage.worstCase))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <div className="bg-gray-50 p-4 rounded shadow">
              <h4 className="font-semibold text-gray-800">Résumé général :</h4>
              <p className="mt-2">
                <span className="font-medium">Semaine la moins risquée (Meilleur cas) :</span> Semaine{" "}
                {
                  results.reduce((min, r) => (r.riskPercentage.bestCase < min.riskPercentage.bestCase ? r : min))
                    .weekOffset
                }
                (Risque :{" "}
                {results
                  .reduce((min, r) => (r.riskPercentage.bestCase < min.riskPercentage.bestCase ? r : min))
                  .riskPercentage.bestCase.toFixed(2)}
                %)
              </p>
              <p className="mt-1">
                <span className="font-medium">Semaine la plus risquée (Pire cas) :</span> Semaine{" "}
                {
                  results.reduce((max, r) => (r.riskPercentage.worstCase > max.riskPercentage.worstCase ? r : max))
                    .weekOffset
                }
                (Risque :{" "}
                {results
                  .reduce((max, r) => (r.riskPercentage.worstCase > max.riskPercentage.worstCase ? r : max))
                  .riskPercentage.worstCase.toFixed(2)}
                %)
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {getRecommendation(
                  getRiskLevel(
                    results.reduce((max, r) => (r.riskPercentage.worstCase > max.riskPercentage.worstCase ? r : max))
                      .riskPercentage.worstCase,
                  ),
                )}
              </p>
            </div>
           
           
          </div>
        )}
      </CardFooter>
    </Card>
  )
}


