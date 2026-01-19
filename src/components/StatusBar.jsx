import { Database } from 'react-feather'
import PropTypes from 'prop-types'

export const StatusBar = ({
  totalItems,
  filteredItems,
  cached,
  selectedYear,
  searchQuery,
  pagination
}) => {
  return (
    <div className="bg-neo-bg border-b-2 border-black px-4 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2">
          {(totalItems !== undefined || filteredItems !== undefined) && (
            <span className="text-xs font-black uppercase tracking-tighter text-black">
              {searchQuery && filteredItems !== undefined ? (
                <>
                  <span className="bg-neo-blue text-black px-1 border-neo-sm border-black">{filteredItems}</span> MATCHES FOUND
                  {pagination?.totalPages > 1 && (
                    <span className="opacity-50 ml-2">
                      (SYNC {pagination.currentPage} / {pagination.totalPages})
                    </span>
                  )}
                </>
              ) : totalItems !== undefined ? (
                <>
                  <span className="bg-neo-yellow px-1 border-neo-sm border-black">{totalItems}</span> ARCHIVED RECORDS
                  {selectedYear && <span className="opacity-50 ml-1"> [{selectedYear}]</span>}
                </>
              ) : (
                <><span className="bg-neo-yellow px-1 border-neo-sm border-black">{filteredItems}</span> RECORDS</>
              )}
            </span>
          )}
        </div>

        {cached && (
          <div className="flex items-center bg-black text-white px-2 py-0.5 border-neo-sm border-black uppercase text-[10px] font-bold" title="Data served from local sync">
            <Database size={10} className="mr-1" />
            <span>LOCAL SYNC ACTIVE</span>
          </div>
        )}
      </div>
    </div>
  )
}

StatusBar.propTypes = {
  totalItems: PropTypes.number,
  filteredItems: PropTypes.number,
  cached: PropTypes.bool,
  selectedYear: PropTypes.string,
  searchQuery: PropTypes.string,
  pagination: PropTypes.object
} 