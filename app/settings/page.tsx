"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useState, useEffect } from "react"

// Modifier le type UserAccount pour inclure un champ password optionnel
type UserAccount = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  password?: string
}

export default function OrganizationSettings() {
  // État pour les paramètres utilisateur
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rib: "",
    bank: "",
    password: "",
  })

  // État pour les erreurs du formulaire principal
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    rib: "",
    bank: "",
    password: "",
  })

  // États pour le message et statut global
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const [toast, setToast] = useState<{
    visible: boolean
    type: "success" | "error" | "info"
    title: string
    message: string
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  })

  // Ajouter ces nouveaux états pour gérer les états de chargement spécifiques
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [addingAccount, setAddingAccount] = useState(false)
  const [updatingAccount, setUpdatingAccount] = useState(false)
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null)

  // États pour le formulaire d'ajout de compte
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  })

  // État pour les erreurs du formulaire d'ajout de compte
  const [accountErrors, setAccountErrors] = useState({
    name: "",
    email: "",
    password: "",
  })

  // État pour le compte en cours d'édition
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null)

  // État pour stocker la liste des comptes depuis l'API
  const [accounts, setAccounts] = useState<UserAccount[]>([])

  // Chargement initial des comptes
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoadingAccounts(true)
      try {
        const res = await fetch("/api/accounts")
        if (!res.ok) throw new Error("Erreur lors de la récupération des comptes")
        const data = await res.json()
        setAccounts(
          data.accounts.map((acc: any) => ({
            ...acc,
          })),
        )
      } catch (error) {
        console.error(error)
        showToast("error", "Erreur de chargement", "Impossible de charger la liste des comptes. Veuillez réessayer.")
      } finally {
        setLoadingAccounts(false)
      }
    }
    fetchAccounts()
  }, [])

  // Gestion des changements dans le formulaire principal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Gestion des changements dans le formulaire d'ajout de compte
  const handleNewAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setNewAccount({
      ...newAccount,
      [name]: type === "checkbox" ? checked : value,
    })
    if (accountErrors[name as keyof typeof accountErrors]) {
      setAccountErrors({
        ...accountErrors,
        [name]: "",
      })
    }
  }

  // Validation du formulaire principal
  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères."
      isValid = false
    } else {
      newErrors.name = ""
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide."
      isValid = false
    } else {
      newErrors.email = ""
    }

    if (formData.rib.trim() === "") {
      newErrors.rib = "Le RIB est requis."
      isValid = false
    } else {
      newErrors.rib = ""
    }

    if (formData.bank.trim() === "") {
      newErrors.bank = "Le nom de la banque est requis."
      isValid = false
    } else {
      newErrors.bank = ""
    }

    if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères."
      isValid = false
    } else {
      newErrors.password = ""
    }

    setErrors(newErrors)
    return isValid
  }

  // Validation du formulaire d'ajout de compte
  const validateAccountForm = () => {
    let isValid = true
    const newErrors = { ...accountErrors }

    if (newAccount.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères."
      isValid = false
    } else {
      newErrors.name = ""
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newAccount.email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide."
      isValid = false
    } else {
      newErrors.email = ""
    }

    if (newAccount.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères."
      isValid = false
    } else {
      newErrors.password = ""
    }

    setAccountErrors(newErrors)
    return isValid
  }

  // Ajouter cette fonction pour afficher les toasts
  const showToast = (type: "success" | "error" | "info", title: string, message: string) => {
    setToast({
      visible: true,
      type,
      title,
      message,
    })

    // Masquer le toast après 5 secondes
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 5000)
  }

  // Soumission du formulaire principal
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setIsSuccess(false)
    setMessage("")

    try {
      // Simuler la mise à jour via une API (à personnaliser selon vos besoins)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
      setMessage("Paramètres mis à jour avec succès.")
      showToast("success", "Paramètres enregistrés", "Vos paramètres personnels ont été mis à jour avec succès.")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      setMessage(`Une erreur s'est produite: ${errorMessage}`)
      showToast("error", "Échec de mise à jour", `Impossible de mettre à jour vos paramètres: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Ajout d'un nouveau compte via l'API
  const handleAddAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateAccountForm()) return

    setAddingAccount(true)
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAccount,
          // map isAdmin boolean to auth value: 1 pour admin, 0 pour utilisateur
          auth: newAccount.isAdmin ? 1 : 0,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Erreur lors de l'ajout du compte")
      }

      const data = await res.json()
      const createdAccount = {
        ...data.account,
        isAdmin: data.account.auth === 1,
      }
      setAccounts([...accounts, createdAccount])
      setNewAccount({ name: "", email: "", password: "", isAdmin: false })

      showToast("success", "Compte créé", `Le compte pour ${createdAccount.name} a été créé avec succès.`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      showToast("error", "Échec de création", `Impossible de créer le compte: ${errorMessage}`)
    } finally {
      setAddingAccount(false)
    }
  }

  // Commencer l'édition d'un compte
  const startEditing = (account: UserAccount) => {
    setEditingAccount({
      ...account,
      password: "",
    })
  }

  // Annuler l'édition
  const cancelEditing = () => {
    setEditingAccount(null)
  }

  // Sauvegarder les modifications d'un compte via l'API
  const saveAccountChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingAccount) return

    if (editingAccount.password && editingAccount.password.length > 0 && editingAccount.password.length < 8) {
      showToast("error", "Mot de passe invalide", "Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    setUpdatingAccount(true)
    try {
      const res = await fetch(`/api/accounts/${editingAccount.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingAccount,
          auth: editingAccount.isAdmin ? 1 : 0,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Erreur lors de la mise à jour")
      }

      const data = await res.json()
      const updatedAccount = { ...data.account, isAdmin: data.account.auth === 1 }
      const updatedAccounts = accounts.map((account) => (account.id === updatedAccount.id ? updatedAccount : account))
      setAccounts(updatedAccounts)
      setEditingAccount(null)

      showToast(
        "success",
        "Compte mis à jour",
        `Les informations de ${updatedAccount.name} ont été mises à jour avec succès.`,
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      showToast("error", "Échec de mise à jour", `Impossible de mettre à jour le compte: ${errorMessage}`)
    } finally {
      setUpdatingAccount(false)
    }
  }

  // Supprimer un compte via l'API
  const deleteAccount = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) return

    setDeletingAccountId(id)
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Erreur lors de la suppression")
      }

      // Trouver le nom du compte avant de le supprimer pour le message
      const accountToDelete = accounts.find((account) => account.id === id)
      const accountName = accountToDelete?.name || "Le compte"

      setAccounts(accounts.filter((account) => account.id !== id))
      showToast("success", "Compte supprimé", `${accountName} a été supprimé avec succès.`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      showToast("error", "Échec de suppression", `Impossible de supprimer le compte: ${errorMessage}`)
    } finally {
      setDeletingAccountId(null)
    }
  }

  // Mettre à jour les champs du compte en cours d'édition
  const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingAccount) return
    const { name, value, type, checked } = e.target
    setEditingAccount({
      ...editingAccount,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
         <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft className="mr-2" size={20} />
        Retour
      </Link>
      {/* Toast notification */}
      {toast.visible && (
        <div
          className={`fixed top-4 right-4 z-50 w-80 p-4 rounded-md shadow-lg ${
            toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : "bg-blue-600"
          } text-white transition-all duration-300 transform translate-y-0 opacity-100`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              <p className="text-sm mt-1 opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className="ml-4 text-white opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Paramètres de l'Organisation</h1>
          <p className="text-gray-500 mt-2">Gérez les comptes utilisateurs et les paramètres de votre organisation</p>
        </div>

        {/* Section de gestion des comptes */}
        <div className="bg-white rounded-lg border border-blue-100 shadow-md overflow-hidden mb-8">
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Gestion des Comptes</h2>
            <p className="text-gray-500 text-sm mt-1">Ajoutez, modifiez ou supprimez des comptes utilisateurs</p>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Comptes Existants</h3>

            <div className="overflow-x-auto">
              {loadingAccounts ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Chargement des comptes...</span>
                </div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  <p className="mt-2">Aucun compte trouvé. Ajoutez un nouveau compte ci-dessous.</p>
                </div>
              ) : (
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{account.name}</td>
                        <td className="py-3 px-4 text-sm">{account.email}</td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              account.isAdmin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {account.isAdmin ? "Administrateur" : "Utilisateur"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <button
                            onClick={() => startEditing(account)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                            disabled={updatingAccount || deletingAccountId === account.id}
                          >
                            Modifier
                          </button>
                          {deletingAccountId === account.id ? (
                            <span className="text-red-600 inline-flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                              Suppression...
                            </span>
                          ) : (
                            <button
                              onClick={() => deleteAccount(account.id)}
                              className="text-red-600 hover:text-red-800"
                              disabled={updatingAccount}
                            >
                              Supprimer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Formulaire d'édition de compte */}
            {editingAccount && (
              <div className="mt-6 p-4 border border-blue-200 rounded-md bg-blue-50">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Modifier le Compte</h3>
                <form onSubmit={saveAccountChanges} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        id="edit-name"
                        name="name"
                        type="text"
                        value={editingAccount.name}
                        onChange={handleEditingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={updatingAccount}
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="edit-email"
                        name="email"
                        type="email"
                        value={editingAccount.email}
                        onChange={handleEditingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={updatingAccount}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de Passe
                    </label>
                    <input
                      id="edit-password"
                      name="password"
                      type="password"
                      value={editingAccount.password || ""}
                      onChange={handleEditingChange}
                      placeholder="Laisser vide pour ne pas modifier"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={updatingAccount}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Laisser vide pour conserver le mot de passe actuel. Minimum 8 caractères pour un nouveau mot de
                      passe.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <input
                        id="edit-isAdmin"
                        name="isAdmin"
                        type="checkbox"
                        checked={editingAccount.isAdmin}
                        onChange={handleEditingChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={updatingAccount}
                      />
                      <label htmlFor="edit-isAdmin" className="ml-2 block text-sm text-gray-700">
                        Administrateur
                      </label>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center ${
                        updatingAccount ? "opacity-80 cursor-not-allowed" : ""
                      }`}
                      disabled={updatingAccount}
                    >
                      {updatingAccount ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Mise à jour...
                        </>
                      ) : (
                        "Enregistrer"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      disabled={updatingAccount}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Formulaire d'ajout de compte */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Ajouter un Nouveau Compte</h3>
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="new-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      id="new-name"
                      name="name"
                      type="text"
                      value={newAccount.name}
                      onChange={handleNewAccountChange}
                      placeholder="Nom complet"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        accountErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={addingAccount}
                    />
                    {accountErrors.name && <p className="mt-1 text-sm text-red-600">{accountErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="new-email"
                      name="email"
                      type="email"
                      value={newAccount.email}
                      onChange={handleNewAccountChange}
                      placeholder="email@exemple.com"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        accountErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={addingAccount}
                    />
                    {accountErrors.email && <p className="mt-1 text-sm text-red-600">{accountErrors.email}</p>}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de Passe
                    </label>
                    <input
                      id="new-password"
                      name="password"
                      type="password"
                      value={newAccount.password}
                      onChange={handleNewAccountChange}
                      placeholder="••••••••"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        accountErrors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={addingAccount}
                    />
                    {accountErrors.password && <p className="mt-1 text-sm text-red-600">{accountErrors.password}</p>}
                  </div>
                  <div className="flex items-center mt-8">
                    <input
                      id="new-isAdmin"
                      name="isAdmin"
                      type="checkbox"
                      checked={newAccount.isAdmin}
                      onChange={handleNewAccountChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={addingAccount}
                    />
                    <label htmlFor="new-isAdmin" className="ml-2 block text-sm text-gray-700">
                      Administrateur
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center ${
                      addingAccount ? "opacity-80 cursor-not-allowed" : ""
                    }`}
                    disabled={addingAccount}
                  >
                    {addingAccount ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Création en cours...
                      </>
                    ) : (
                      "Ajouter le Compte"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Section des paramètres utilisateur (inchangée) */}
        <div className="bg-white rounded-lg border border-blue-100 shadow-md overflow-hidden">
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Informations de l'organisation'</h2>
            <p className="text-gray-500 text-sm mt-1">
              Mettez à jour les données et les informations de votre organisation
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nom de l'entreprise"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.dupont@exemple.com"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="rib" className="block text-sm font-medium text-gray-700 mb-1">
                    RIB
                  </label>
                  <input
                    id="rib"
                    name="rib"
                    type="text"
                    value={formData.rib}
                    onChange={handleChange}
                    placeholder="Votre numéro RIB"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.rib ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">Votre numéro d'identification bancaire</p>
                  {errors.rib && <p className="mt-1 text-sm text-red-600">{errors.rib}</p>}
                </div>
                <div>
                  <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la Banque
                  </label>
                  <input
                    id="bank"
                    name="bank"
                    type="text"
                    value={formData.bank}
                    onChange={handleChange}
                    placeholder="Nom de votre banque"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.bank ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.bank && <p className="mt-1 text-sm text-red-600">{errors.bank}</p>}
                </div>
              </div>
             
              <div className="pt-4">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white font-medium flex items-center ${
                    isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Enregistrement...
                    </>
                  ) : isSuccess ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Enregistré
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        ></path>
                      </svg>
                      Enregistrer les Modifications
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-blue-50 border-t border-blue-100 px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">Dernière mise à jour: {new Date().toLocaleDateString()}</p>
            {message && (
              <p className={`text-sm font-medium flex items-center ${isSuccess ? "text-blue-600" : "text-red-600"}`}>
                {isSuccess ? (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                )}
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

