"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, DollarSign, PieChart, Users, Printer, Calculator, Bell, Menu, X } from "lucide-react"

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
      <header style={{maxWidth: "100vw"}}className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white shadow-md" : ""}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="ml-2 text-2xl font-bold text-indigo-600">FinFlow</span>
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

      <main style={{overflowX: "hidden"}} >
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/30 to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 py-20 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-indigo-600"
            >
              Gestion des traites et cheques 
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto"
            >
              Optimisez la gestion de vos chèques, traites avec notre solution innovante, conçue
              spécialement pour les entreprises tunisiennes.
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex justify-center items-center space-x-4 text-gray-700"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Web
              </span>
              <span className="text-gray-400">|</span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                Mobile
              </span>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-black">Fonctionnalités Clés</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: DollarSign,
                  title: "Gestion complète",
                  description: "Gérez efficacement vos chèques, traites en un seul endroit.",
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
                  title: "Remplissage auto des information de triate ou cheque",
                  description: "Saisie intelligente par photo : Fini la saisie manuelle !",
                },
                {
                  icon: Bell,
                  title: "Système de notifications",
                  description: "Recevez des alertes pour les chèques et traites non payés à temps.",
                },
                {
                  icon: Users,
                  title: "Gestion multi-utilisateurs",
                  description: "Gérez facilement plusieurs comptes utilisateurs avec différents rôles (administrateurs et utilisateurs standards)."
                },
             
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-3 bg-indigo-100 rounded-full inline-block mb-4">
                    <feature.icon size={32} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section id="risk-calculator" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-black">Remplissage Automatique: Gagnez du Temps</h2>
            <div className="flex flex-col md:flex-row-reverse items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-8 md:mb-0"
              >
                <video
                  src="/0530.mp4"
                  controls
                  autoPlay
                  loop
                  muted
                  className="rounded-lg shadow-xl w-full max-w-2xl h-auto max-h-[70vh] mx-auto"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 md:pr-8"
              >
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Reconnaissance automatique des informations
              </h3>
              <p className="text-gray-600 mb-6">
                Prenez une photo d’un chèque ou d’une traite, et notre système intelligent extrait automatiquement toutes les données nécessaires pour un enregistrement rapide et sans erreur.
              </p>
              <ul className="space-y-2">
                {[
                  "Capture photo directement depuis l’application",
                  "Lecture automatique des informations du chèque ou de la traite",
                  "Remplissage instantané du formulaire de saisie",
                  "Gain de temps et réduction des erreurs",
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
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-black">Suivi des Statuts en Temps Réel</h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-8 md:mb-0"
            >
              <Image
                src="/image-traite.png"
                alt="Démonstration du suivi des statuts"
                width={500}
                height={300}
                className="rounded-lg shadow-xl object-contain h-auto max-h-[70vh] mx-auto"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 md:pl-8"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Gardez le contrôle sur chaque étape
              </h3>
              <p className="text-gray-600 mb-6">
                Suivez facilement l’évolution de chaque chèque ou traite grâce à notre système de statuts clairs et mis à jour en temps réel.
              </p>
              <ul className="space-y-2">
                {[
                  "Statut 'à déposer' pour les paiements préparés",
                  "Suivi 'en attente' pour les opérations en cours",
                  "Indicateur 'rejeté' pour les refus bancaires",
                  "Confirmation 'encaissé' dès réception des fonds",
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
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-black">Tableau de Bord Intuitif et Complet</h2>
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
                  width={500}
                  height={300}
                  className="rounded-lg shadow-xl object-contain h-auto max-h-[70vh] mx-auto"
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

        <section id="print-demo" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-black">Impression des Traites Simplifiée et Rapide</h2>
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
                  width={500}
                  height={300}
                  className="rounded-lg shadow-xl object-contain h-auto max-h-[70vh] mx-auto"
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

        
  <section id="dashboard" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-black">Notifications Intelligentes</h2>
    <div className="flex flex-col md:flex-row-reverse items-center justify-between">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="md:w-1/2 mb-8 md:mb-0"
      >
        <Image
          src="/notification-demo.png"
          alt="Démonstration des notifications"
          width={500}
          height={300}
          className="rounded-lg shadow-xl object-contain h-auto max-h-[70vh] mx-auto"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="md:w-1/2 md:pl-8"
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Restez informé à tout moment
        </h3>
        <p className="text-gray-600 mb-6">
          Notre système de notifications vous alerte automatiquement pour ne jamais rater une échéance.
        </p>
        <ul className="space-y-2">
          {[
            "Alertes pour les traites ou chèques en retard",
            "Rappels pour les dépôts à venir"
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



      <section id="multi-accounts" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-black">Gestion Multi-Comptes Centralisée</h2>
          <div className="flex flex-col md:flex-row-reverse items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-8 md:mb-0"
            >
              <Image
                src="/multi.png"
                alt="Gestion Multi-Comptes"
                width={500}
                height={300}
                className="rounded-lg shadow-xl object-contain h-auto max-h-[70vh] mx-auto"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 md:pl-8"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Gérez plusieurs comptes en toute simplicité
              </h3>
              <p className="text-gray-600 mb-6">
                Notre application vous permet de gérer plusieurs comptes au sein d'une seule interface.
              </p>
              <ul className="space-y-2">
                {[
                  "Ajoutez un nombre illimité de comptes",
                  "Suivez les activité de chaque compte"
 
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

        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-black">Prêt à Simplifier Votre Gestion?</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }} >
              {[
                {
                  name: "Essai Gratuit",
                  price: "7 jours gratuits",
                  features: [
                    "Toutes les fonctionnality inclus",
                  ],
                },
                {
                  name: "Après l'essai",
                  price: "24 TND/mois",
                  features: [
                    "Toutes les fonctionnality inclus",

                    
                  ],
                },

              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{maxWidth: "400px"}}
                  className={`${ 
"bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                  } p-10 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 max-w-md mx-auto`}
                >
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-5xl font-bold mb-6">{plan.price}</p>
                  <ul className="mb-8 space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" size={20} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === "Entreprise" ? "/contact" : "/signup"}
                    className={`block text-center ${ 
"bg-white text-indigo-600"
                    } px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition duration-300 text-xl shadow-md hover:shadow-lg`}
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
            <h2 className="text-4xl font-bold mb-8">Prêt à simplifier votre gestion financière ?</h2>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex justify-center items-center space-x-4 text-gray-700"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Web
              </span>
              <span className="text-gray-400">|</span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                Mobile
              </span>
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
                FINFLOW est votre solution complète pour une gestion financière innovante et sécurisée, adaptée aux besoins
                des entreprises tunisiennes.
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
            <div>
              <h4 className="text-lg font-semibold mb-4 text-indigo-600">Contact</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="tel:+21620201133" className="hover:text-indigo-600 transition duration-300">
                    +216 20 201 133
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm">
            <p>&copy; 2024 FinFlow. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

