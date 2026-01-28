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
    <div className="bg-notion-gray-light/30 border-b border-notion-border px-4 py-1.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2">
          {(totalItems !== undefined || filteredItems !== undefined) && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-notion-gray">
              {searchQuery && filteredItems !== undefined ? (
                <>
                  <span className="text-notion-blue">{filteredItems}</span> matches found
                  {pagination?.totalPages > 1 && (
                    <span className="opacity-60 ml-2">
                      (Page {pagination.currentPage} of {pagination.totalPages})
                    </span>
                  )}
                </>
              ) : totalItems !== undefined ? (
                <>
                  <span className="text-notion-text">{totalItems}</span> archived records
                  {selectedYear && <span className="opacity-60 ml-1"> [{selectedYear}]</span>}
                </>
              ) : (
                <><span>{filteredItems}</span> records</>
              )}
            </span>
          )}
        </div>

        {cached && (
          <div className="flex items-center text-notion-gray uppercase text-[10px] font-bold" title="Data served from local sync">
            <Database size={10} className="mr-1 opacity-60" />
            <span>Local Sync Active</span>
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