"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, DollarSign, PieChart, Shield, Printer, Calculator, Bell, Menu, X } from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Témoignages", href: "#testimonials" },
    { name: "Tarifs", href: "#pricing" },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white shadow-md" : ""}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="GCT Logo" width={40} height={40} className="rounded-full" />
            <span className="ml-2 text-2xl font-bold text-indigo-600">GCT</span>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-600 hover:text-indigo-600 transition duration-300">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white py-4"
          >
            <ul className="flex flex-col items-center space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-indigo-600 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </header>

      <main>
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-indigo-50 to-white">
          <div className="absolute inset-0 overflow-hidden">
            <Image src="/hero-background.jpg" alt="Background" layout="fill" objectFit="cover" quality={100} priority />
            <div className="absolute inset-0 bg-white/75 backdrop-blur-sm"></div>
          </div>
          <div className="container mx-auto px-4 py-20 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-indigo-600"
            >
              Gestion financière intelligente
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto"
            >
              Optimisez la gestion de vos chèques, traites et paiements en espèces avec notre solution innovante, conçue
              spécialement pour les entreprises tunisiennes modernes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                href="/signup"
                className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition duration-300 inline-flex items-center group"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-indigo-600">Fonctionnalités révolutionnaires</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: DollarSign,
                  title: "Gestion complète",
                  description: "Gérez efficacement vos chèques, traites et paiements en espèces en un seul endroit.",
                },
                {
                  icon: Printer,
                  title: "Impression des traites",
                  description: "Générez et imprimez vos traites rapidement, économisant un temps précieux.",
                },
                {
                  icon: PieChart,
                  title: "Tableau de bord intuitif",
                  description: "Visualisez vos données financières avec des graphiques clairs et informatifs.",
                },
                {
                  icon: Calculator,
                  title: "Prédiction et analyse de risque",
                  description: "Déterminez les meilleures échéances et évaluez les risques de paiement.",
                },
                {
                  icon: Bell,
                  title: "Système de notifications",
                  description: "Recevez des alertes pour les chèques et traites non payés à temps.",
                },
                {
                  icon: Shield,
                  title: "Sécurité de niveau bancaire",
                  description: "Protégez vos données financières avec notre système de sécurité ultra-robuste.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
                >
                  <feature.icon size={48} className="text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="print-demo" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-indigo-600">Impression des traites simplifiée</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-8 md:mb-0"
              >
                <Image
                  src="/print-demo.png"
                  alt="Démonstration d'impression de traites"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 md:pl-8"
              >
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Générez vos traites en quelques clics</h3>
                <p className="text-gray-600 mb-6">
                  Notre fonctionnalité d'impression de traites vous fait gagner un temps précieux. Plus besoin de
                  remplir manuellement vos traites, notre système les génère automatiquement avec toutes les
                  informations nécessaires.
                </p>
                <ul className="space-y-2">
                  {[
                    "Génération automatique des traites",
                    "Personnalisation facile",
                    "Impression haute qualité",
                    "Archivage numérique",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="text-green-500 mr-2" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="risk-calculator" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-indigo-600">Prédiction et analyse de risque</h2>
            <div className="flex flex-col md:flex-row-reverse items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-8 md:mb-0"
              >
                <Image
                  src="/risk-calculator.png"
                  alt="Calculateur de risque"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 md:pr-8"
              >
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Optimisez vos échéances et minimisez les risques
                </h3>
                <p className="text-gray-600 mb-6">
                  Notre système intelligent analyse vos données financières pour vous aider à choisir les meilleures
                  semaines pour vos échéances et évalue le risque associé à chaque transaction.
                </p>
                <ul className="space-y-2">
                  {[
                    "Prédiction des meilleures semaines pour les échéances",
                    "Calcul du risque de paiement",
                    "Recommandations personnalisées",
                    "Analyse des tendances de paiement",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="text-green-500 mr-2" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="dashboard" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-indigo-600">Tableau de bord intuitif</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-8 md:mb-0"
              >
                <Image
                  src="/dashboard-demo.png"
                  alt="Démonstration du tableau de bord"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 md:pl-8"
              >
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Visualisez vos données financières en un coup d'œil
                </h3>
                <p className="text-gray-600 mb-6">
                  Notre tableau de bord simple et efficace vous offre une vue d'ensemble de votre situation financière
                  avec des graphiques clairs et des indicateurs pertinents.
                </p>
                <ul className="space-y-2">
                  {[
                    "Vue d'ensemble des chèques et traites",
                    "Graphiques de flux de trésorerie",
                    "Indicateurs de performance clés",
                    "Alertes et notifications intégrées",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="text-green-500 mr-2" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-indigo-600">Ce que disent nos clients</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: "Ahmed B.",
                  role: "Directeur financier",
                  quote:
                    "Cette application a transformé notre gestion financière. Nous économisons des heures chaque semaine sur la gestion des chèques et des traites.",
                },
                {
                  name: "Sonia M.",
                  role: "Entrepreneur",
                  quote:
                    "Intuitive et puissante. La fonctionnalité de prédiction des échéances nous a permis d'optimiser notre trésorerie de manière significative.",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 rounded-xl shadow-md"
                >
                  <p className="text-lg mb-4 italic text-gray-600">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full mr-4"></div>
                    <div>
                      <p className="font-semibold text-gray-800">{testimonial.name}</p>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-indigo-600">Choisissez votre plan</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "Gratuit",
                  features: [
                    "Jusqu'à 50 chèques/mois",
                    "Gestion des traites basique",
                    "Tableau de bord simple",
                    "Support par email",
                  ],
                },
                {
                  name: "Pro",
                  price: "99 DT/mois",
                  features: [
                    "Chèques et traites illimités",
                    "Impression des traites",
                    "Prédiction des échéances",
                    "Analyse de risque avancée",
                    "Support prioritaire",
                  ],
                  highlight: true,
                },
                {
                  name: "Entreprise",
                  price: "Sur mesure",
                  features: ["Solutions personnalisées", "Intégration complète", "Formation dédiée", "Support 24/7"],
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`${
                    plan.highlight ? "bg-indigo-600 text-white transform scale-105" : "bg-gray-50 text-gray-800"
                  } p-8 rounded-xl shadow-lg transition duration-300`}
                >
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-6">{plan.price}</p>
                  <ul className="mb-8 space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className={`${plan.highlight ? "text-white" : "text-green-500"} mr-2`} size={20} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === "Entreprise" ? "/contact" : "/signup"}
                    className={`block text-center ${
                      plan.highlight ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
                    } px-6 py-3 rounded-full font-semibold hover:opacity-90 transition duration-300`}
                  >
                    {plan.name === "Entreprise" ? "Contactez-nous" : "Commencer"}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Prêt à révolutionner votre gestion financière ?</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/signup"
                className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 inline-flex items-center group"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 text-gray-600 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-indigo-600">À propos</h4>
              <p className="text-sm">
                GCT est votre solution complète pour une gestion financière innovante et sécurisée, adaptée aux besoins
                des entreprises tunisiennes modernes.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-indigo-600">Liens rapides</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-indigo-600 transition duration-300">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition duration-300">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-indigo-600 transition duration-300">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition duration-300">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-indigo-600">Support</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-indigo-600 transition duration-300">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition duration-300">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition duration-300">
                    Tutoriels
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-indigo-600">Légal</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-indigo-600 transition duration-300">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition duration-300">
                    Politique de confidentialité
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm">
            <p>&copy; 2023 Gestionnaire de Chèques Tunisien. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

