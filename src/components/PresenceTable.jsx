import PropTypes from 'prop-types'
import React from 'react'
import { Pagination } from './Pagination'
import { formatTimeToHHMM, formatDateToLong } from '../utils/dateUtils'
import { FaUser, FaClock, FaCalendarAlt, FaHourglassHalf, FaHashtag } from 'react-icons/fa'

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

  const getDurationBadgeColor = (duration) => {
    if (!duration) return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    
    const numDuration = parseInt(duration)
    if (isNaN(numDuration)) return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    
    // Badge color ranges based on duration (in minutes)
    if (numDuration <= 30) return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'      // Cool blue for short sessions
    if (numDuration <= 60) return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100'     // Light blue
    if (numDuration <= 90) return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'    // Green
    if (numDuration <= 120) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'  // Yellow
    if (numDuration <= 150) return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'  // Orange
    return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'                              // Hot red for long sessions
  }

  return (
    <div className="mt-4 bg-white rounded-lg dark:bg-slate-800">
      <div id="tableTop" className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-slate-700 table-fixed">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="border border-gray-300 p-2 text-gray-700 dark:border-slate-700 dark:text-slate-200">Tutor</th>
              <th className="border border-gray-300 p-2 text-gray-700 dark:border-slate-700 dark:text-slate-200 ">Student</th>
              <th className="border border-gray-300 p-2 text-gray-700 dark:border-slate-700 dark:text-slate-200 ">Date Time</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 dark:text-slate-300">
            {isLoading ? ([...Array(10)].map((_, index) => (
                <tr key={index}><td className="border border-gray-300 p-2 dark:border-slate-700">
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-slate-600"></div>
                  </td><td className="border border-gray-300 p-2 dark:border-slate-700">
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-slate-600"></div>
                  </td><td className="border border-gray-300 p-2 dark:border-slate-700">
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-slate-600"></div>
                  </td></tr>
              )))
            : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={`${item["Timestamp"]}-${index}`}><td className="border border-gray-300 p-2 dark:border-slate-700">
                      <div className="flex items-center">
                        <span className="font-medium break-words">{item["Nama Tentor"]}</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2 dark:border-slate-700">
                      <div className="break-words" title={item["Nama Siswa"]}>
                        {item["Nama Siswa"]}
                      </div>
                      {item["Durasi Les"] && (
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDurationBadgeColor(item["Durasi Les"])}`}>
                            {item["Durasi Les"]} min
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 dark:border-slate-700">
                      <div className="flex items-start">
                        <FaCalendarAlt className="mr-2 mt-1 text-gray-400 dark:text-gray-400 flex-shrink-0" />
                        <span className="break-words">{formatDateToLong(item["Hari dan Tanggal Les"])}</span>
                      </div>
                      <div className="flex items-start mt-1">
                        <FaClock className="mr-2 mt-1 text-gray-400 dark:text-gray-500 text-sm flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-slate-400 break-words">{formatTimeToHHMM(String(item["Jam Kegiatan Les"]))}</span>
                      </div>
                      <div className="flex items-start mt-1">
                        <FaHashtag className="mr-2 mt-1 text-gray-400 dark:text-slate-500 text-xs flex-shrink-0" />
                        <span className="text-xs text-gray-400 dark:text-slate-500 break-words">Submitted at: {item["Timestamp"]}</span>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr><td colSpan="3" className="text-center py-8 text-gray-500 dark:text-slate-400">
                  <div>
                    <p className="mb-2">{getEmptyMessage()}</p>
                    {searchQuery && (
                      <p className="text-sm text-slate-400">
                        Search is performed across tutor names, student names, dates, times, and timestamps.
                      </p>
                    )}
                  </div>
                </td></tr>
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
    "Durasi Les": PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
