interface StatsCardsProps {
  totalIncome: number
  totalExpense: number
  balance: number
  totalSavings: number
  savingsRate: number
  selectedMonth: number
  selectedYear: number
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export default function StatsCards({ 
  totalIncome, 
  totalExpense, 
  balance,
  totalSavings,
  savingsRate,
  selectedMonth,
  selectedYear 
}: StatsCardsProps) {
  // Déterminer la couleur du cadre en fonction du taux d'épargne
  const getSavingsBorderColor = () => {
    if (savingsRate >= 20) return 'border-green-400'
    if (savingsRate >= 10) return 'border-blue-400'
    if (savingsRate > 0) return 'border-orange-400'
    return 'border-gray-300'
  }

  const getSavingsBgColor = () => {
    if (savingsRate >= 20) return 'bg-green-50'
    if (savingsRate >= 10) return 'bg-blue-50'
    if (savingsRate > 0) return 'bg-orange-50'
    return 'bg-gray-50'
  }

  return (
    <div>
      {/* Titre avec période */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Statistiques - {MONTHS[selectedMonth]} {selectedYear}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenus */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenus</p>
            <p className="text-2xl font-bold text-green-600">
              {totalIncome.toFixed(2)} €
            </p>
          </div>
          <div className="bg-green-100 rounded-full p-3 flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600">€</span>
          </div>
        </div>
      </div>

      {/* Total Dépenses */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Dépenses</p>
            <p className="text-2xl font-bold text-red-600">
              {totalExpense.toFixed(2)} €
            </p>
          </div>
          <div className="bg-red-100 rounded-full p-3 flex items-center justify-center">
            <span className="text-2xl font-bold text-red-600">€</span>
          </div>
        </div>
      </div>

      {/* Solde */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Solde</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {balance.toFixed(2)} €
            </p>
          </div>
          <div className={`${balance >= 0 ? 'bg-blue-100' : 'bg-red-100'} rounded-full p-3 flex items-center justify-center`}>
            <span className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>€</span>
          </div>
        </div>
      </div>

      {/* Livret A (Épargne) */}
      <div className={`bg-white rounded-lg shadow p-6 border-2 ${getSavingsBorderColor()} ${getSavingsBgColor()}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Livret A</p>
            <p className="text-2xl font-bold text-purple-600">
              {totalSavings.toFixed(2)} €
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {savingsRate.toFixed(1)}% du revenu
            </p>
          </div>
          <div className="bg-purple-100 rounded-full p-3 flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-600">💰</span>
          </div>
        </div>
        {savingsRate >= 20 && (
          <div className="mt-2 text-xs text-green-600 font-medium">
            🎉 Objectif atteint !
          </div>
        )}
        {savingsRate >= 10 && savingsRate < 20 && (
          <div className="mt-2 text-xs text-blue-600 font-medium">
            👍 Bon début !
          </div>
        )}
        {savingsRate > 0 && savingsRate < 10 && (
          <div className="mt-2 text-xs text-orange-600 font-medium">
            💡 Continuez vos efforts
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
