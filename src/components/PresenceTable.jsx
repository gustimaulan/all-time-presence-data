import PropTypes from 'prop-types'
import React from 'react'
import { Pagination } from './Pagination'
import { formatTimeToHHMM, formatDateToLong } from '../utils/dateUtils'
import { FaUser, FaClock, FaCalendarAlt, FaHourglassHalf, FaHashtag } from 'react-icons/fa'
import { maskEmail } from '../utils/privacyUtils'

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
    if (!duration) return 'bg-neo-blue text-black'

    const numDuration = parseInt(duration)
    if (isNaN(numDuration)) return 'bg-neo-blue text-black'

    if (numDuration <= 30) return 'bg-neo-blue text-black'
    if (numDuration <= 60) return 'bg-neo-green text-black'
    if (numDuration <= 90) return 'bg-neo-yellow text-black'
    if (numDuration <= 120) return 'bg-neo-orange text-black'
    if (numDuration <= 150) return 'bg-neo-pink text-black'
    return 'bg-neo-red text-black'
  }

  return (
    <div className="neo-card p-0 md:p-0 overflow-hidden">
      <div id="tableTop" className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-full border-collapse">
          <thead className="bg-black border-b-neo border-black">
            <tr>
              <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-black text-white uppercase tracking-widest border-r-2 border-white/20">
                <div className="flex items-center space-x-2">
                  <FaUser size={14} />
                  <span>Tutor</span>
                </div>
              </th>
              <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-black text-white uppercase tracking-widest border-r-2 border-white/20">
                <div className="flex items-center space-x-2">
                  <FaUser size={14} />
                  <span>Student</span>
                </div>
              </th>
              <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-black text-white uppercase tracking-widest">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt size={14} />
                  <span>Schedule</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {isLoading ? ([...Array(10)].map((_, index) => (
              <tr key={index} className="bg-white">
                <td className="px-3 sm:px-6 py-4 border-r-2 border-black/10">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-black/10 border-2 border-black mr-3 flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-black/10 border-2 border-black w-full animate-pulse">&nbsp;</div>
                      <div className="h-3 bg-black/5 border-2 border-black/20 w-4/5 animate-pulse">&nbsp;</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 border-r-2 border-black/10">
                  <div className="space-y-2">
                    <div className="h-4 bg-black/10 border-2 border-black w-4/5 animate-pulse">&nbsp;</div>
                    <div className="h-3 bg-black/5 border-2 border-black/20 w-2/5 animate-pulse">&nbsp;</div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-black/10 border-2 border-black w-4/5 animate-pulse">&nbsp;</div>
                    <div className="h-3 bg-black/5 border-2 border-black/20 w-3/5 animate-pulse">&nbsp;</div>
                  </div>
                </td>
              </tr>
            )))
              : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={`${item["Timestamp"]}-${index}`} className="hover:bg-neo-yellow/10 transition-colors bg-white">
                    <td className="px-3 sm:px-6 py-4 border-r-2 border-black/10">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-neo-yellow border-2 border-black flex items-center justify-center mr-3 flex-shrink-0 shadow-neo-sm">
                          <span className="text-xs font-black text-black">
                            {item["Nama Tentor"]?.charAt(0)?.toUpperCase() || 'T'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-black break-words text-sm sm:text-base uppercase tracking-tight">
                            {item["Nama Tentor"]}
                          </span>
                          {item["Email Address"] && (
                            <span className="text-[10px] font-bold text-black border-neo-sm border-black bg-white px-1 mt-1 break-words self-start">
                              {maskEmail(item["Email Address"])}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 border-r-2 border-black/10">
                      <div className="space-y-2">
                        <div className="font-black text-black break-words text-sm sm:text-base uppercase tracking-tight">
                          {item["Nama Siswa"]}
                        </div>
                        {item["Durasi Les"] && (
                          <div className="inline-flex">
                            <span className={`neo-badge ${getDurationBadgeColor(item["Durasi Les"])} uppercase`}>
                              {item["Durasi Les"]} MIN
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="space-y-2 text-xs sm:text-sm font-bold">
                        <div className="flex items-start">
                          <FaCalendarAlt className="mr-2 mt-0.5 text-black flex-shrink-0" size={12} />
                          <span className="text-black uppercase">
                            {formatDateToLong(item["Hari dan Tanggal Les"])}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <FaClock className="mr-2 mt-0.5 text-black flex-shrink-0" size={12} />
                          <span className="text-black border-b-2 border-dashed border-black">
                            {formatTimeToHHMM(String(item["Jam Kegiatan Les"]))}
                          </span>
                        </div>
                        <div className="flex items-start pt-1">
                          <span className="text-[9px] font-black bg-black text-white px-1 uppercase letter-tracking-tighter">
                            ID: {item["Timestamp"]}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-3 sm:px-6 py-12 text-center bg-white">
                    <div className="max-w-xs sm:max-w-sm mx-auto">
                      <div className="neo-card bg-neo-yellow inline-block mb-4 p-4">
                        <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-black font-black uppercase tracking-tight mb-2 text-sm sm:text-base">{getEmptyMessage()}</p>
                      {searchQuery && (
                        <p className="text-xs font-bold text-black/60 uppercase">
                          Search is global across all data fields
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="border-t-neo border-black bg-white px-3 sm:px-6 py-4">
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
