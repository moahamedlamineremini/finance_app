interface MonthSelectorProps {
  selectedMonth: number
  selectedYear: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export default function MonthSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: MonthSelectorProps) {
  // Générer les années disponibles (5 ans en arrière et 1 an en avant)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i)

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11)
      onYearChange(selectedYear - 1)
    } else {
      onMonthChange(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0)
      onYearChange(selectedYear + 1)
    } else {
      onMonthChange(selectedMonth + 1)
    }
  }

  const isCurrentMonth = () => {
    const now = new Date()
    return selectedMonth === now.getMonth() && selectedYear === now.getFullYear()
  }

  const goToCurrentMonth = () => {
    const now = new Date()
    onMonthChange(now.getMonth())
    onYearChange(now.getFullYear())
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          {/* Bouton mois précédent */}
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Mois précédent"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Sélecteur de mois */}
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-medium"
          >
            {MONTHS.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>

          {/* Sélecteur d'année */}
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-medium"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Bouton mois suivant */}
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Mois suivant"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Bouton retour au mois actuel */}
        {!isCurrentMonth() && (
          <button
            onClick={goToCurrentMonth}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            Mois actuel
          </button>
        )}
      </div>

      {/* Indicateur visuel du mois actuel */}
      {isCurrentMonth() && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Mois en cours</span>
        </div>
      )}
    </div>
  )
}
