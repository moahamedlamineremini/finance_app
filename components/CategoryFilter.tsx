interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: string[]
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  categories,
}: CategoryFilterProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Filtrer par catégorie :</span>
        
        <div className="flex gap-2 flex-wrap">
          {/* Bouton "Toutes" */}
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes les catégories
          </button>

          {/* Boutons pour chaque catégorie */}
          {categories.sort().map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Compteur de transactions filtrées */}
        {selectedCategory !== 'all' && (
          <span className="text-xs text-gray-500 ml-auto">
            Catégorie sélectionnée : {selectedCategory}
          </span>
        )}
      </div>
    </div>
  )
}
