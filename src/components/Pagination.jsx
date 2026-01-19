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
          className="neo-btn bg-neo-yellow text-black disabled:bg-gray-200"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="neo-btn bg-neo-yellow text-black disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-tight text-black">
            Page <span className="bg-neo-yellow px-1 border-neo-sm border-black">{currentPage}</span> OF{' '}
            <span className="bg-neo-blue text-black px-1 border-neo-sm border-black">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="inline-flex items-center space-x-2" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="neo-btn bg-white text-black p-2 disabled:bg-gray-200"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5 stroke-[3px]" />
            </button>

            <div className="neo-badge bg-black text-white px-4 py-2 uppercase tracking-widest flex items-center space-x-2">
              <span className="font-black">{currentPage}</span>
              <span className="text-white/50">/</span>
              <span className="font-bold">{totalPages}</span>
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="neo-btn bg-white text-black p-2 disabled:bg-gray-200"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5 stroke-[3px]" />
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
