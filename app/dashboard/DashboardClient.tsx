'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import StatsCards from '@/components/StatsCards'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  title: string
  amount: number
  category: string
  date: string
  description?: string
}

interface User {
  id: string
  email: string
  name?: string | null
}

export default function DashboardClient({ user }: { user: User }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      })

      if (response.ok) {
        fetchTransactions()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction:', error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTransactions()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Finance</h1>
            <p className="text-sm text-gray-600">Bienvenue, {user.name || user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <StatsCards 
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
        />

        {/* Bouton ajouter transaction */}
        <div className="mt-8 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Annuler' : '+ Nouvelle transaction'}
          </button>
        </div>

        {/* Formulaire d'ajout */}
        {showForm && (
          <div className="mt-4">
            <TransactionForm onSubmit={handleAddTransaction} />
          </div>
        )}

        {/* Liste des transactions */}
        <div className="mt-6">
          {loading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : (
            <TransactionList 
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          )}
        </div>
      </main>
    </div>
  )
}
