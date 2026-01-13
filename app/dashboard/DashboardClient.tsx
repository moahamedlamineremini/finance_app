'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import StatsCards from '@/components/StatsCards'
import MonthSelector from '@/components/MonthSelector'
import CategoryFilter from '@/components/CategoryFilter'
import SavingsRecommendation from '@/components/SavingsRecommendation'
import SavingsWidget from '@/components/SavingsWidget'

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
  
  // État pour le mois/année sélectionné
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  
  // État pour le filtre de catégorie
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // État pour la recommandation d'épargne
  const [showSavingsRecommendation, setShowSavingsRecommendation] = useState(false)
  const [lastSalary, setLastSalary] = useState(0)

  useEffect(() => {
    fetchTransactions()
    // Charger le dernier salaire depuis localStorage
    const savedSalary = localStorage.getItem('lastSalary')
    if (savedSalary) {
      setLastSalary(parseFloat(savedSalary))
    }
  }, [])

  // Sauvegarder le dernier salaire et le détecter depuis les transactions
  useEffect(() => {
    if (transactions.length > 0) {
      // Trouver le dernier salaire dans toutes les transactions
      const salaries = transactions
        .filter(t => t.type === 'income' && t.category === 'Salaire')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      if (salaries.length > 0 && salaries[0].amount > 0) {
        setLastSalary(salaries[0].amount)
        localStorage.setItem('lastSalary', salaries[0].amount.toString())
      }
    }
  }, [transactions])

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
        
        // Détecter si c'est un salaire et proposer l'épargne
        if (transaction.type === 'income' && transaction.category === 'Salaire') {
          setLastSalary(transaction.amount)
          setShowSavingsRecommendation(true)
        }
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

  // Filtrer les transactions par mois et catégorie sélectionnés
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    const matchesMonth = transactionDate.getMonth() === selectedMonth &&
      transactionDate.getFullYear() === selectedYear
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
    
    return matchesMonth && matchesCategory
  })
  
  // Obtenir toutes les catégories uniques des transactions du mois
  const availableCategories = Array.from(
    new Set(
      transactions
        .filter((t) => {
          const transactionDate = new Date(t.date)
          return (
            transactionDate.getMonth() === selectedMonth &&
            transactionDate.getFullYear() === selectedYear
          )
        })
        .map((t) => t.category)
    )
  )

  // Calculer les statistiques pour le mois sélectionné
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  // Calculer le total épargné (Livret A) pour le mois sélectionné
  const totalSavings = filteredTransactions
    .filter((t) => t.type === 'expense' && t.category === 'Épargne')
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculer le taux d'épargne pour le mois sélectionné
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0

  // Calculer les dépenses moyennes des 3 derniers mois pour la recommandation d'épargne
  const calculateAverageExpenses = () => {
    const now = new Date()
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
    
    const recentTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate >= threeMonthsAgo && t.type === 'expense'
    })
    
    const totalExpenses = recentTransactions.reduce((sum, t) => sum + t.amount, 0)
    const monthsCount = Math.max(1, 3)
    
    return totalExpenses / monthsCount
  }

  // Gérer l'acceptation de la recommandation d'épargne
  const handleAcceptSavings = async (amount: number) => {
    setShowSavingsRecommendation(false)
    
    if (amount > 0) {
      // Créer une transaction d'épargne
      const savingsTransaction = {
        type: 'expense' as const,
        title: 'Épargne Livret A',
        amount: amount,
        category: 'Épargne',
        date: new Date().toISOString().split('T')[0],
        description: 'Épargne recommandée automatiquement',
      }
      
      await handleAddTransaction(savingsTransaction)
    } else {
      // Ouvrir le formulaire pour un montant personnalisé
      setShowForm(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Recommandation d'épargne */}
      {showSavingsRecommendation && (
        <SavingsRecommendation
          salary={lastSalary}
          averageExpenses={calculateAverageExpenses()}
          onAccept={handleAcceptSavings}
          onDismiss={() => setShowSavingsRecommendation(false)}
        />
      )}

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
        {/* Sélecteur de mois */}
        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />

        {/* Statistiques */}
        <StatsCards 
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
          totalSavings={totalSavings}
          savingsRate={savingsRate}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />

        {/* Widget d'épargne permanent */}
        <div className="mt-6">
          <SavingsWidget
            lastSalary={lastSalary}
            currentExpenses={totalExpense}
            currentIncome={totalIncome}
            averageExpenses={calculateAverageExpenses()}
            onClick={() => setShowSavingsRecommendation(true)}
          />
        </div>

        {/* Filtre par catégorie */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={availableCategories}
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
              transactions={filteredTransactions}
              onDelete={handleDeleteTransaction}
            />
          )}
        </div>
      </main>
    </div>
  )
}
