import PropTypes from 'prop-types'
import { Pagination } from './Pagination'
import { formatTimeToHHMM } from '../utils/dateUtils'

export const PresenceTable = ({
  data,
  isLoading,
  pagination,
  onPageChange,
  currentPage,
  searchQuery
}) => {
  const getEmptyMessage = () => {
    if (searchQuery && searchQuery.trim()) {
      return `No results found for "${searchQuery}". Try adjusting your search terms.`
    }
    return "Type in the search box above to view your data."
  }

  return (
    <div className="mt-4">
      <div id="tableTop" className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2">Tutor</th>
              <th className="border border-gray-300 p-2">Student</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Time</th>
              <th className="border border-gray-300 p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading ? (
              [...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={`${item["Timestamp"]}-${index}`}>
                  <td className="border border-gray-300 p-2">{item["Nama Tentor"]}</td>
                  <td className="border border-gray-300 p-2">{item["Nama Siswa"]}</td>
                  <td className="border border-gray-300 p-2">{item["Hari dan Tanggal Les"]}</td>
                  <td className="border border-gray-300 p-2">{formatTimeToHHMM(item["Jam Kegiatan Les"])}</td>
                  <td className="border border-gray-300 p-2">{item["Timestamp"]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  <div>
                    <p className="mb-2">{getEmptyMessage()}</p>
                    {searchQuery && (
                      <p className="text-sm text-gray-400">
                        Search is performed across tutor names, student names, dates, times, and timestamps.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Show pagination if we have more than one page */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

PresenceTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    "Nama Tentor": PropTypes.string,
    "Nama Siswa": PropTypes.string,
    "Hari dan Tanggal Les": PropTypes.string,
    "Jam Kegiatan Les": PropTypes.string,
    "Timestamp": PropTypes.string
  })).isRequired,
  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    totalItems: PropTypes.number,
    hasNextPage: PropTypes.bool,
    hasPreviousPage: PropTypes.bool
  }),
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  searchQuery: PropTypes.string
}
