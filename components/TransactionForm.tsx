'use client'

import { useState } from 'react'

interface Transaction {
  type: 'income' | 'expense'
  title: string
  amount: number
  category: string
  date: string
  description?: string
}

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void
}

const CATEGORIES = {
  income: ['Salaire', 'Freelance', 'Investissement', 'Autre'],
  expense: ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Épargne', 'Autre']
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [formData, setFormData] = useState<Transaction>({
    type: 'expense',
    title: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    
    // Réinitialiser le formulaire
    setFormData({
      type: 'expense',
      title: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense', category: '' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-medium"
          >
            <option value="expense">Dépense</option>
            <option value="income">Revenu</option>
          </select>
        </div>

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-medium"
            placeholder="Ex: Courses du mois"
          />
        </div>

        {/* Montant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant (€) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-medium"
            placeholder="0.00"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-medium"
          >
            <option value="">Sélectionner...</option>
            {CATEGORIES[formData.type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-medium"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optionnel)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Détails supplémentaires..."
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Ajouter la transaction
        </button>
      </div>
    </form>
  )
}
