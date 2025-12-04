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
    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-slate-600">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-slate-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <label htmlFor="yearFilter" className="block text-sm font-semibold text-gray-900 dark:text-white">
              Filter by Year
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
              Select a year to filter attendance data
            </p>
          </div>
        </div>
        
        <div className="relative">
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="appearance-none bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg px-3 py-2 sm:px-4 sm:py-2 pr-8 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm cursor-pointer text-sm sm:text-base"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{availableYears.length} year{availableYears.length !== 1 ? 's' : ''} available</span>
        </div>
        <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
          Click Search to apply filter
        </div>
      </div>
    </div>
  )
}

YearFilter.propTypes = {
  selectedYear: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired
} 