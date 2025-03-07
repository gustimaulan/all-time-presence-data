export const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
      
      <div className="p-5">
        <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="p-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(5)].map((_, j) => (
                    <td key={j} className="p-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
