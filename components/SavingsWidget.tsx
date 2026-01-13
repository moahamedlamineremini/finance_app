interface SavingsWidgetProps {
  lastSalary: number
  currentExpenses: number
  currentIncome: number
  averageExpenses: number
  onClick: () => void
}

export default function SavingsWidget({
  lastSalary,
  currentExpenses,
  currentIncome,
  averageExpenses,
  onClick,
}: SavingsWidgetProps) {
  // Si pas de salaire ce mois-ci, utiliser le dernier salaire connu
  const salaryToUse = currentIncome > 0 ? currentIncome : lastSalary
  
  if (salaryToUse === 0) {
    return null // N'affiche rien si aucun salaire
  }

  // Calcul de ce qui reste disponible ce mois
  const remainingThisMonth = currentIncome - currentExpenses
  
  // Recommandation intelligente basée sur les dépenses moyennes
  const intelligentSuggestion = Math.max(
    salaryToUse - averageExpenses - (averageExpenses * 0.2),
    salaryToUse * 0.10
  )

  // Calcul du pourcentage déjà épargné
  const savingsTransactions = currentExpenses // Les dépenses incluent l'épargne
  const alreadySaved = Math.max(0, currentIncome - currentExpenses)
  const savingsRate = currentIncome > 0 ? (alreadySaved / currentIncome) * 100 : 0

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-green-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 rounded-full p-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">💰 Épargne Recommandée</h3>
            <p className="text-xs text-gray-600">Basé sur vos finances actuelles</p>
          </div>
        </div>
        <button
          onClick={onClick}
          className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
        >
          Voir détails
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Disponible ce mois */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Disponible ce mois</p>
          <p className={`text-xl font-bold ${remainingThisMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remainingThisMonth.toFixed(2)} €
          </p>
        </div>

        {/* Recommandation */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">À mettre de côté</p>
          <p className="text-xl font-bold text-blue-600">
            {Math.min(intelligentSuggestion, remainingThisMonth).toFixed(2)} €
          </p>
        </div>

        {/* Taux d'épargne */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Taux d'épargne</p>
          <p className="text-xl font-bold text-purple-600">
            {savingsRate.toFixed(0)} %
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Objectif recommandé : 20%</span>
          <span>{savingsRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              savingsRate >= 20 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(100, savingsRate)}%` }}
          />
        </div>
      </div>

      {/* Message encourageant */}
      <div className="text-xs text-gray-700">
        {savingsRate >= 20 ? (
          <p className="text-green-700">
            🎉 <strong>Excellent !</strong> Vous épargnez {savingsRate.toFixed(0)}% de vos revenus !
          </p>
        ) : savingsRate >= 10 ? (
          <p className="text-blue-700">
            👍 <strong>Bon début !</strong> Vous pouvez encore épargner {intelligentSuggestion.toFixed(2)} € ce mois.
          </p>
        ) : remainingThisMonth > 0 ? (
          <p className="text-orange-700">
            💡 <strong>Conseil :</strong> Il vous reste {remainingThisMonth.toFixed(2)} € ce mois. Pensez à épargner !
          </p>
        ) : (
          <p className="text-gray-600">
            📊 Continuez à suivre vos dépenses pour mieux épargner le mois prochain.
          </p>
        )}
      </div>
    </div>
  )
}
