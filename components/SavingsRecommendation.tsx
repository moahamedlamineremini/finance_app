interface SavingsRecommendationProps {
  salary: number
  averageExpenses: number
  onAccept: (amount: number) => void
  onDismiss: () => void
}

export default function SavingsRecommendation({
  salary,
  averageExpenses,
  onAccept,
  onDismiss,
}: SavingsRecommendationProps) {
  // Calcul des différentes stratégies d'épargne
  const conservativeRate = 0.10 // 10%
  const moderateRate = 0.20 // 20%
  const aggressiveRate = 0.30 // 30%

  const conservative = salary * conservativeRate
  const moderate = salary * moderateRate
  const aggressive = salary * aggressiveRate

  // Calcul intelligent basé sur les dépenses moyennes
  const intelligentSuggestion = Math.max(
    salary - averageExpenses - (averageExpenses * 0.2), // Garder 20% de marge
    salary * 0.10 // Minimum 10%
  )

  const recommendations = [
    {
      label: 'Conservateur',
      amount: conservative,
      description: '10% du salaire - Épargne de sécurité',
      color: 'green',
    },
    {
      label: 'Modéré',
      amount: moderate,
      description: '20% du salaire - Épargne régulière',
      color: 'blue',
    },
    {
      label: 'Ambitieux',
      amount: aggressive,
      description: '30% du salaire - Épargne maximale',
      color: 'purple',
    },
    {
      label: 'Intelligent',
      amount: intelligentSuggestion,
      description: 'Basé sur vos dépenses moyennes',
      color: 'orange',
      recommended: true,
    },
  ].filter(rec => rec.amount > 0 && rec.amount < salary)

  const colorClasses = {
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 rounded-full p-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">💰 Recommandation d'Épargne</h3>
            <p className="text-sm text-gray-600">
              Salaire reçu : {salary.toFixed(2)} € | Dépenses moyennes : {averageExpenses.toFixed(2)} €
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            🎯 <strong>Conseil :</strong> Épargner régulièrement est essentiel pour construire votre sécurité financière. 
            Voici nos recommandations pour votre livret A :
          </p>
        </div>

        {/* Recommandations */}
        <div className="space-y-3 mb-6">
          {recommendations.map((rec) => (
            <button
              key={rec.label}
              onClick={() => onAccept(rec.amount)}
              className={`w-full p-4 border-2 rounded-lg transition-all ${
                colorClasses[rec.color as keyof typeof colorClasses]
              } ${rec.recommended ? 'ring-2 ring-orange-400' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{rec.label}</span>
                    {rec.recommended && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                        Recommandé
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{rec.amount.toFixed(2)} €</p>
                  <p className="text-xs text-gray-500">
                    Reste : {(salary - rec.amount).toFixed(2)} €
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Plus tard
          </button>
          <button
            onClick={() => onAccept(0)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Montant personnalisé
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          💡 Cette suggestion est calculée automatiquement. Vous pouvez toujours l'ajuster selon vos besoins.
        </div>
      </div>
    </div>
  )
}
