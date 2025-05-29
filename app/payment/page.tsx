"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, ExternalLink, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch subscription status when the component mounts
  useEffect(() => {
    async function checkSubscription() {
      try {
        setIsLoading(true)
        const response = await axios.get('/api/subscription/check')
        console.log('Subscription data:', response.data)
        setSubscriptionInfo(response.data)
      } catch (error) {
        console.error('Error checking subscription:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [])

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

  // Render subscription status section
  const renderSubscriptionStatus = () => {
    if (isLoading) {
      return (
        <div className="bg-gray-100 rounded-lg p-4 mb-8 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      );
    }

    if (!subscriptionInfo) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Aucune information d'abonnement</h3>
              <p className="text-sm text-yellow-700">Nous n'avons pas pu récupérer les informations de votre abonnement.</p>
            </div>
          </div>
        </div>
      );
    }

    const isExpired = !subscriptionInfo.valid;
    const formattedDate = subscriptionInfo.nextBillingDate 
      ? new Date(subscriptionInfo.nextBillingDate).toLocaleDateString('tn-TN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : '';

    if (isExpired) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 text-lg">Votre abonnement a expiré</h3>
              <p className="text-red-700 mt-1">
                Votre abonnement a expiré le {formattedDate}. Veuillez renouveler votre abonnement pour continuer à utiliser toutes les fonctionnalités.
              </p>
              <div className="mt-4 inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                Action requise : Renouveler maintenant
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <Clock className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-800 text-lg">Votre abonnement est actif</h3>
            <p className="text-green-700 mt-1">
              Plan : <span className="font-medium">{subscriptionInfo.planName}</span> | 
              Expiration : <span className="font-medium">{formattedDate}</span>
            </p>
            {subscriptionInfo.daysRemaining > 0 && (
              <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {subscriptionInfo.daysRemaining} {subscriptionInfo.daysRemaining > 1 ? 'jours' : 'jour'} restants
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
            Accédez à toutes les fonctionnalités et optimisez la gestion de vos finances
          </p>
        </div>

        {/* Subscription Status Section */}
        {renderSubscriptionStatus()}

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
                    {subscriptionInfo?.valid 
                      ? "Renouveler mon abonnement" 
                      : "Réactiver mon abonnement"}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Paiement sécurisé via</span>
                  <div className="flex items-center space-x-2">
                    <p>konnect.network</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}

