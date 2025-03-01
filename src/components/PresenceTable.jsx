import PropTypes from 'prop-types'
import { useState, useMemo, useEffect } from 'react'
import { Pagination } from './Pagination'

const ITEMS_PER_PAGE = 15

export const PresenceTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1)
  
  // Reset to first page when data changes (e.g., after search)
  useEffect(() => {
    setCurrentPage(1)
  }, [data])

  const totalPages = useMemo(() => Math.max(Math.ceil(data.length / ITEMS_PER_PAGE), 1), [data.length])
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return data.slice(start, end)
  }, [data, currentPage])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      // Scroll to top of table
      document.getElementById('tableTop')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="mt-4">
      <div id="tableTop" className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2">Nama Tentor</th>
              <th className="border border-gray-300 p-2">Nama Siswa</th>
              <th className="border border-gray-300 p-2">Hari dan Tanggal Les</th>
              <th className="border border-gray-300 p-2">Jam Kegiatan Les</th>
              <th className="border border-gray-300 p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={`${item["Timestamp"]}-${index}`}>
                  <td className="border border-gray-300 p-2">{item["Nama Tentor"]}</td>
                  <td className="border border-gray-300 p-2">{item["Nama Siswa"]}</td>
                  <td className="border border-gray-300 p-2">{item["Hari dan Tanggal Les"]}</td>
                  <td className="border border-gray-300 p-2">{item["Jam Kegiatan Les"]}</td>
                  <td className="border border-gray-300 p-2">{item["Timestamp"]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {data.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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
  })).isRequired
}
