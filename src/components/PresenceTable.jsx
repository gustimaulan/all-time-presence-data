import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Pagination } from './Pagination'
import { formatTimeToHHMM } from '../utils/dateUtils'
import { FaUser } from 'react-icons/fa'

export const PresenceTable = ({
  data,
  isLoading,
  pagination,
  onPageChange,
  currentPage,
  searchQuery
}) => {
  const [isGroupedByTutor, setIsGroupedByTutor] = useState(false)
  const [isGroupedByStudent, setIsGroupedByStudent] = useState(false)

  const getEmptyMessage = () => {
    if (searchQuery && searchQuery.trim()) {
      return `No results found for "${searchQuery}". Try adjusting your search terms.`
    }
    return "Type in the search box above to view your data."
  }

  const groupedByTutorData = isGroupedByTutor
    ? data.reduce((acc, item) => {
        const tutorName = item["Nama Tentor"]
        if (!acc[tutorName]) {
          acc[tutorName] = []
        }
        acc[tutorName].push(item)
        return acc
      }, {})
    : null

  const finalGroupedData = isGroupedByTutor && isGroupedByStudent
    ? Object.entries(groupedByTutorData).reduce((acc, [tutorName, sessions]) => {
        acc[tutorName] = sessions.reduce((studentAcc, session) => {
          const studentName = session["Nama Siswa"]
          if (!studentAcc[studentName]) {
            studentAcc[studentName] = []
          }
          studentAcc[studentName].push(session)
          return studentAcc
        }, {})
        return acc
      }, {})
    : groupedByTutorData

  return (
    <div className="mt-4 bg-white rounded-lg dark:bg-slate-800">
      <div className="flex items-center justify-end p-2">
        <input
          type="checkbox"
          id="groupByTutor"
          checked={isGroupedByTutor}
          onChange={(e) => setIsGroupedByTutor(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="groupByTutor" className="text-sm font-medium text-gray-700 dark:text-slate-300">
          Group by Tutor
        </label>
      </div>
      {data.length > 0 && (
        <div className="flex items-center justify-end mb-4 p-2">
          <input
            type="checkbox"
            id="groupByStudent"
            checked={isGroupedByStudent}
            onChange={(e) => setIsGroupedByStudent(e.target.checked)}
            className="mr-2"
            disabled={!isGroupedByTutor}
          />
          <label htmlFor="groupByStudent" className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Group by Student
          </label>
        </div>
      )}
      <div id="tableTop" className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-slate-700">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="border border-gray-300 p-2 text-gray-700 dark:border-slate-700 dark:text-slate-200">Tutor</th>
              <th className="border border-gray-300 p-2 text-gray-700 dark:border-slate-700 dark:text-slate-200">Student</th>
              <th className="border border-gray-300 p-2 text-gray-700 dark:border-slate-700 dark:text-slate-200">Date & Time</th>
              <th className="border border-gray-300 p-2 text-gray-700 dark:border-slate-700 dark:text-slate-200">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 dark:text-slate-300">
            {isLoading ? (
              [...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-slate-600"></div>
                  </td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-slate-600"></div>
                  </td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-slate-600"></div>
                  </td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-slate-600"></div>
                  </td>
                  <td className="border border-gray-300 p-2 dark:border-slate-700">
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-slate-600"></div>
                  </td>
                </tr>
              ))
            ) : data.length > 0 ? (
              isGroupedByTutor ? (
                Object.entries(finalGroupedData).map(([tutorName, tutorGroup]) => (
                  <React.Fragment key={tutorName}>
                    <tr className="bg-gray-200 dark:bg-slate-700">
                      <td colSpan="5" className="border border-gray-300 p-2 font-bold text-blue-500 dark:border-slate-700 dark:text-blue-300">
                        <i className="fas fa-user mr-2"></i>{tutorName}
                      </td>
                    </tr>
                    {isGroupedByStudent ? (
                      Object.entries(tutorGroup).map(([studentName, studentSessions]) => (
                        <React.Fragment key={`${tutorName}-${studentName}`}>
                          <tr className="bg-gray-100 dark:bg-slate-600">
                            <td colSpan="5" className="border border-gray-300 p-2 font-semibold text-gray-700 pl-8 dark:border-slate-700 dark:text-slate-200">
                              <FaUser className="inline-block mr-2" />{studentName}
                            </td>
                          </tr>
                          {studentSessions.map((item, index) => (
                            <tr key={`${item["Timestamp"]}-${index}`}>
                              <td className="border border-gray-300 p-2 dark:border-slate-700"></td> {/* Empty for grouped view */}
                              <td className="border border-gray-300 p-2 pl-12 dark:border-slate-700">{item["Nama Siswa"]}</td>
                              <td className="border border-gray-300 p-2 dark:border-slate-700">
                                <div>{item["Hari dan Tanggal Les"]}</div>
                                <div className="text-xs text-gray-500 dark:text-slate-400">{formatTimeToHHMM(String(item["Jam Kegiatan Les"]))}</div>
                              </td>
                              <td className="border border-gray-300 p-2 dark:border-slate-700">{item["Timestamp"]}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))
                    ) : (
                      tutorGroup.map((item, index) => (
                        <tr key={`${item["Timestamp"]}-${index}`}>
                          <td className="border border-gray-300 p-2 dark:border-slate-700"></td> {/* Empty for grouped view */}
                          <td className="border border-gray-300 p-2 dark:border-slate-700">{item["Nama Siswa"]}</td>
                          <td className="border border-gray-300 p-2 dark:border-slate-700">
                            <div>{item["Hari dan Tanggal Les"]}</div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">{formatTimeToHHMM(String(item["Jam Kegiatan Les"]))}</div>
                          </td>
                          <td className="border border-gray-300 p-2 dark:border-slate-700">{item["Timestamp"]}</td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                ))
              ) : (
                data.map((item, index) => (
                  <tr key={`${item["Timestamp"]}-${index}`}>
                    <td className="border border-gray-300 p-2 dark:border-slate-700">{item["Nama Tentor"]}</td>
                    <td className="border border-gray-300 p-2 dark:border-slate-700">{item["Nama Siswa"]}</td>
                    <td className="border border-gray-300 p-2 dark:border-slate-700">
                      <div>{item["Hari dan Tanggal Les"]}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">{formatTimeToHHMM(String(item["Jam Kegiatan Les"]))}</div>
                    </td>
                    <td className="border border-gray-300 p-2 dark:border-slate-700">{item["Timestamp"]}</td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500 dark:text-slate-400">
                  <div>
                    <p className="mb-2">{getEmptyMessage()}</p>
                    {searchQuery && (
                      <p className="text-sm text-slate-400">
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
