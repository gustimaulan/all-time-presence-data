import PropTypes from 'prop-types'
import { useMemo } from 'react'

export const YearFilter = ({ selectedYear, onYearChange }) => {
  // Generate years from 2022 to current year (2025)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const startYear = 2022
    const years = []
    
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString())
    }
    
    return years
  }, [])

  return (
    <div className="mb-4">
      <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Year
      </label>
      <select
        id="yearFilter"
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Years</option>
        {availableYears.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <span className="ml-3 text-sm text-gray-500">
        ({availableYears.length} year{availableYears.length !== 1 ? 's' : ''} available)
      </span>
    </div>
  )
}

YearFilter.propTypes = {
  selectedYear: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired
} 