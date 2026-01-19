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
    <div className="bg-white border-neo border-black shadow-neo p-4 md:p-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-neo-pink border-neo-sm border-black shadow-neo-sm rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <label htmlFor="yearFilter" className="block text-lg font-black uppercase tracking-tighter text-black">
              Filter by Year
            </label>
            <p className="text-xs font-bold text-black opacity-70 hidden sm:block uppercase">
              Select a year to filter attendance data
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="neo-input appearance-none pr-10 cursor-pointer font-black uppercase"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t-2 border-dashed border-black/20">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase text-black">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{availableYears.length} year{availableYears.length !== 1 ? 's' : ''} archives</span>
        </div>
        <div className="neo-badge bg-neo-yellow text-black uppercase">
          Ready to sync
        </div>
      </div>
    </div>
  )
}

YearFilter.propTypes = {
  selectedYear: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired
} 