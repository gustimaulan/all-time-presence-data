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
    <div className="notion-card p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-notion-pink/20 rounded-notion flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-notion-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <label htmlFor="yearFilter" className="block text-sm font-bold text-notion-text uppercase tracking-tight">
              Filter by Year
            </label>
            <p className="text-[10px] font-medium text-notion-gray uppercase tracking-wider">
              Select archives
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="notion-input appearance-none pr-8 cursor-pointer font-medium min-w-[100px]"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-notion-gray">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-notion-border">
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase text-notion-gray tracking-wider">
          <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{availableYears.length} archives available</span>
        </div>
        <div className="notion-badge bg-notion-green/20 text-notion-text text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
          Synced
        </div>
      </div>
    </div>
  )
}

YearFilter.propTypes = {
  selectedYear: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired
} 