"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleProceedToPayment = async () => {
    setIsRedirecting(true);

    try {
      const konnectResponse = await fetch('https://api.sandbox.konnect.network/api/v2/payments/init-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '67cff9f7c4277886850ba2f2:nBbCayuzbPzLLE9aq',
        },
        body: JSON.stringify({
          receiverWalletId: "67cff9f7c4277886850ba2f8",
          token: 'TND',
          webhook: `https://finflowtn.vercel.app/api/payment/receivePaymentStatus`,  
          amount: selectedPlan === 'monthly' ? 24000 : 240000,
          type: 'immediate',
          description: `Abonnement ${selectedPlan === 'monthly' ? 'mensuel' : 'annuel'} - Cheques Management`,
          acceptedPaymentMethods: ['bank_card', 'e-DINAR'],
          lifespan: 30,
          checkoutForm: true,
          addPaymentFeesToAmount: false,
          orderId: `ORDER-${Date.now()}`,
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/payment/failure`,
          theme: 'light'
        })
      });
      var konnectData = await konnectResponse.json();
    }
    catch(e){
      console.error(e);
    }
    try{
      
      // Save payment details to our database
      const { data: savePaymentResponse } = await axios.post('/api/payment/initPaymen', {
        paymentRef: konnectData.paymentRef,
        amount: selectedPlan === 'monthly' ? 24000 : 240000,
      });

      console.log(savePaymentResponse)

      // Redirect to payment URL
      window.location.href = konnectData.payUrl;
    } catch (error: any) {
      console.error(error.stack);
      setIsRedirecting(false);
      // Handle error - show error message to user
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choisissez votre abonnement</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Accédez à toutes les fonctionnalités premium et optimisez la gestion de vos finances
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="p-8 text-center">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPlan === "monthly"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setSelectedPlan("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPlan === "yearly"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                Annuel
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: selectedPlan === "monthly" ? 1 : 0.5,
                  y: 0,
                  scale: selectedPlan === "monthly" ? 1 : 0.98,
                }}
                transition={{ duration: 0.3 }}
                className={`bg-gradient-to-br from-indigo-50 to-white rounded-xl p-8 border-2 transition-all ${
                  selectedPlan === "monthly" ? "border-indigo-600" : "border-gray-200"
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Abonnement Mensuel</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-4">
                  24 <span className="text-lg font-normal">DT/mois</span>
                </div>
                <p className="text-gray-600 mb-6">Facturation mensuelle</p>
                <ul className="space-y-3 mb-8 text-left">
                  {[
                    "Accès à toutes les fonctionnalités",
                    "Gestion illimitée des chèques et traites",
                    "Impression des traites",
                    "Prédiction des échéances",
                    "Support prioritaire",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: selectedPlan === "yearly" ? 1 : 0.5,
                  y: 0,
                  scale: selectedPlan === "yearly" ? 1 : 0.98,
                }}
                transition={{ duration: 0.3 }}
                className={`bg-gradient-to-br from-indigo-50 to-white rounded-xl p-8 border-2 transition-all ${
                  selectedPlan === "yearly" ? "border-indigo-600" : "border-gray-200"
                }`}
              >
                <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full inline-block mb-3">
                  ÉCONOMISEZ 48 DT
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Abonnement Annuel</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-4">
                  240 <span className="text-lg font-normal">DT/an</span>
                </div>
                <p className="text-gray-600 mb-6">Facturation annuelle, 2 mois gratuits</p>
                <ul className="space-y-3 mb-8 text-left">
                  {[
                    "Accès à toutes les fonctionnalités",
                    "Gestion illimitée des chèques et traites",
                    "Impression des traites",
                    "Prédiction des échéances",
                    "Support prioritaire",
                    "Formation personnalisée",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <div className="mt-8 max-w-md mx-auto">
              <button
                onClick={handleProceedToPayment}
                disabled={isRedirecting}
                className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isRedirecting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Redirection vers le service de paiement...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Procéder au paiement de {selectedPlan === "monthly" ? "35 DT" : "360 DT"}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Paiement sécurisé via</span>
                  <div className="flex items-center space-x-2">
                    <Image src="/payment-provider-logo.svg" alt="Payment Provider" width={80} height={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions fréquentes</h3>
          <div className="space-y-4">
            {[
              {
                question: "Puis-je annuler mon abonnement à tout moment ?",
                answer:
                  "Oui, vous pouvez annuler votre abonnement à tout moment. Pour les abonnements mensuels, l'annulation prendra effet à la fin du mois en cours. Pour les abonnements annuels, vous pouvez demander un remboursement au prorata pour la période non utilisée.",
              },
              {
                question: "Comment fonctionne la facturation ?",
                answer:
                  "Pour l'abonnement mensuel, vous serez facturé 35 DT chaque mois. Pour l'abonnement annuel, vous serez facturé 360 DT une fois par an, ce qui vous fait économiser l'équivalent de 2 mois d'abonnement.",
              },
              {
                question: "Y a-t-il une période d'essai gratuite ?",
                answer:
                  "Oui, nous offrons une période d'essai gratuite de 14 jours pour tous les nouveaux utilisateurs. Vous pouvez tester toutes les fonctionnalités premium sans engagement.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h4 className="text-base font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

