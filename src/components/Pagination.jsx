import PropTypes from 'prop-types'
import { ChevronLeft, ChevronRight } from 'react-feather'

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 dark:disabled:bg-slate-800 transition-all duration-200"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 dark:disabled:bg-slate-800 transition-all duration-200"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Page <span className="font-semibold text-primary-600 dark:text-primary-400">{currentPage}</span> of{' '}
            <span className="font-semibold text-primary-600 dark:text-primary-400">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="inline-flex items-center space-x-1" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400 dark:hover:bg-slate-600 dark:hover:text-gray-200 dark:disabled:bg-slate-800 dark:disabled:text-gray-500 transition-all duration-200"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg">
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                {currentPage}
              </span>
              <span className="text-sm text-primary-500 dark:text-primary-400">/</span>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400 dark:hover:bg-slate-600 dark:hover:text-gray-200 dark:disabled:bg-slate-800 dark:disabled:text-gray-500 transition-all duration-200"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}
