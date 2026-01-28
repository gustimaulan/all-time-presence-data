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
    if (!duration) return 'bg-notion-blue/10 text-notion-blue'

    const numDuration = parseInt(duration)
    if (isNaN(numDuration)) return 'bg-notion-blue/10 text-notion-blue'

    if (numDuration <= 30) return 'bg-notion-blue/10 text-notion-blue'
    if (numDuration <= 60) return 'bg-notion-green/20 text-notion-text'
    if (numDuration <= 90) return 'bg-notion-yellow/40 text-notion-text'
    if (numDuration <= 120) return 'bg-notion-orange/40 text-notion-text'
    if (numDuration <= 150) return 'bg-notion-pink/40 text-notion-text'
    return 'bg-notion-red/20 text-notion-text'
  }

  return (
    <div className="notion-card overflow-hidden">
      <div id="tableTop" className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-full border-collapse">
          <thead className="bg-notion-gray-light border-b border-notion-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-notion-gray uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <FaUser className="opacity-50" size={12} />
                  <span>Tutor</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-notion-gray uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <FaUser className="opacity-50" size={12} />
                  <span>Student</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-notion-gray uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="opacity-50" size={12} />
                  <span>Schedule</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-notion-border">
            {isLoading ? ([...Array(10)].map((_, index) => (
              <tr key={index} className="bg-white">
                <td className="px-4 py-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-notion bg-notion-hover animate-pulse mr-3 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-notion-hover rounded w-3/4 animate-pulse">&nbsp;</div>
                      <div className="h-2 bg-notion-hover/50 rounded w-1/2 animate-pulse">&nbsp;</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-notion-hover rounded w-3/4 animate-pulse">&nbsp;</div>
                    <div className="h-2 bg-notion-hover/50 rounded w-1/4 animate-pulse">&nbsp;</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-notion-hover rounded w-1/2 animate-pulse">&nbsp;</div>
                    <div className="h-2 bg-notion-hover/50 rounded w-1/3 animate-pulse">&nbsp;</div>
                  </div>
                </td>
              </tr>
            )))
              : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={`${item["Timestamp"]}-${index}`} className="hover:bg-notion-hover/50 transition-colors bg-white group">
                    <td className="px-4 py-4">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-notion bg-notion-blue/10 flex items-center justify-center mr-3 flex-shrink-0 text-notion-blue">
                          <span className="text-[10px] font-bold">
                            {item["Nama Tentor"]?.charAt(0)?.toUpperCase() || 'T'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-notion-text text-sm transition-colors group-hover:text-notion-blue">
                            {item["Nama Tentor"]}
                          </span>
                          {item["Email Address"] && (
                            <span className="text-[10px] text-notion-gray mt-0.5 break-all">
                              {maskEmail(item["Email Address"])}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1.5">
                        <div className="font-medium text-notion-text text-sm">
                          {item["Nama Siswa"]}
                        </div>
                        {item["Durasi Les"] && (
                          <div className="inline-flex">
                            <span className={`notion-badge ${getDurationBadgeColor(item["Durasi Les"])} px-1.5 py-px text-[10px] font-bold uppercase`}>
                              {item["Durasi Les"]} min
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 text-xs text-notion-gray">
                        <div className="flex items-center text-notion-text font-medium">
                          <FaCalendarAlt className="mr-2 opacity-40" size={10} />
                          <span>
                            {formatDateToLong(item["Hari dan Tanggal Les"])}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2 opacity-40" size={10} />
                          <span>
                            {formatTimeToHHMM(String(item["Jam Kegiatan Les"]))}
                          </span>
                        </div>
                        <div className="pt-1">
                          <span className="text-[9px] font-mono bg-notion-gray-light text-notion-gray px-1 rounded">
                            ID: {item["Timestamp"]}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-20 text-center bg-white">
                    <div className="max-w-xs mx-auto">
                      <div className="w-12 h-12 bg-notion-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-notion-gray opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-notion-text font-medium mb-1">{getEmptyMessage()}</p>
                      {searchQuery && (
                        <p className="text-xs text-notion-gray">
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
        <div className="border-t border-notion-border bg-notion-gray-light/30 px-4 py-3">
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
