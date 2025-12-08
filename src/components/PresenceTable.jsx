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
    <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div id="tableTop" className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-full">
          <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600">
            <tr>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <FaUser className="text-gray-400" size={12} />
                  <span className="hidden sm:inline">Tutor</span>
                  <span className="sm:hidden">T</span>
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <FaUser className="text-gray-400" size={12} />
                  <span className="hidden sm:inline">Student</span>
                  <span className="sm:hidden">S</span>
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <FaCalendarAlt className="text-gray-400" size={12} />
                  <span className="hidden sm:inline">Date & Time</span>
                  <span className="sm:hidden">Date</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {isLoading ? ([...Array(10)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 dark:bg-slate-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                      <div className="flex flex-col space-y-2">
                        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4"></div>
                        <div className="h-2 sm:h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/2"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-200 dark:bg-slate-600 rounded w-2/3 mb-2"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/3"></div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-200 dark:bg-slate-600 rounded w-4/5"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 dark:bg-slate-600 rounded w-3/5"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 dark:bg-slate-600 rounded w-2/5 hidden sm:block"></div>
                    </div>
                  </td>
                </tr>
              )))
            : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={`${item["Timestamp"]}-${index}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-start">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                            {item["Nama Tentor"]?.charAt(0)?.toUpperCase() || 'T'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white break-words text-sm sm:text-base">
                            {item["Nama Tentor"]}
                          </span>
                          {item["Email Address"] && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 break-words mt-1">
                              {item["Email Address"]}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="space-y-1 sm:space-y-2">
                        <div className="font-medium text-gray-900 dark:text-white break-words text-sm sm:text-base" title={item["Nama Siswa"]}>
                          {item["Nama Siswa"]}
                        </div>
                        {item["Durasi Les"] && (
                          <div className="inline-flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${getDurationBadgeColor(item["Durasi Les"])}`}>
                              <FaHourglassHalf className="mr-1" size={8} />
                              {item["Durasi Les"]} min
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex items-start">
                          <FaCalendarAlt className="mr-1.5 sm:mr-2 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0" size={10} />
                          <span className="text-gray-900 dark:text-white break-words">
                            {formatDateToLong(item["Hari dan Tanggal Les"])}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <FaClock className="mr-1.5 sm:mr-2 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0" size={10} />
                          <span className="text-gray-600 dark:text-gray-300 break-words">
                            {formatTimeToHHMM(String(item["Jam Kegiatan Les"]))}
                          </span>
                        </div>
                        <div className="flex items-start sm:block">
                          <FaHashtag className="mr-2 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0" size={10} />
                          <span className="text-xs text-gray-500 dark:text-gray-400 break-words">
                            {item["Timestamp"]}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="3" className="px-3 sm:px-6 py-8 sm:py-12 text-center">
                  <div className="max-w-xs sm:max-w-sm mx-auto">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium mb-2 text-sm sm:text-base">{getEmptyMessage()}</p>
                    {searchQuery && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
        <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/30 px-3 sm:px-6 py-3 sm:py-4">
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
    "Email Address": PropTypes.string,
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
