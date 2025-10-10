import { X, Search } from 'react-feather'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import axios from '../axios'
import { useQuery } from '@tanstack/react-query'

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isLoading
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 100) // 100ms debounce

  // Fetch all tutors
  const { data: allTutorsData } = useQuery({
    queryKey: ['allTutors'],
    queryFn: async () => {
      const res = await axios.get(`/tutors`)
      return Object.values(res.data.names || {})
    },
    staleTime: Infinity, // Data doesn't change often, so cache indefinitely
    cacheTime: Infinity,
  })

  // Fetch all students
  const { data: allStudentsData } = useQuery({
    queryKey: ['allStudents'],
    queryFn: async () => {
      const res = await axios.get(`/students`)
      return Object.values(res.data.names || {})
    },
    staleTime: Infinity, // Data doesn't change often, so cache indefinitely
    cacheTime: Infinity,
  })

  const allTutors = allTutorsData || []
  const allStudents = allStudentsData || []

  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filterSuggestions = () => {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase()

      const filteredTutors = allTutors
        .filter(name => typeof name === 'string' && name.toLowerCase().includes(lowerCaseQuery))
        .map(name => ({ type: 'tutor', name: name, id: name }))

      const filteredStudents = allStudents
        .filter(name => typeof name === 'string' && name.toLowerCase().includes(lowerCaseQuery))
        .map(name => ({ type: 'student', name: name, id: name }))

      const combinedSuggestions = [...filteredTutors, ...filteredStudents]
      setSuggestions(combinedSuggestions)

      // Only show suggestions if the input is currently focused and there are suggestions
      if (isInputFocused && combinedSuggestions.length > 0) {
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    }

    filterSuggestions()
  }, [debouncedSearchQuery, allTutors, allStudents, isInputFocused])

  const handleClear = () => {
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion.name)
    setShowSuggestions(false)
    handleSearch(suggestion.name) // Trigger search with the selected suggestion
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSearch(searchQuery)
    }} className="mb-4">
      <div className="flex items-center space-x-2 mt-3">
        <div className="relative flex-grow">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsInputFocused(false)
                setShowSuggestions(false)
              }, 100) // Delay to allow click on suggestion
            }}
            className="border rounded p-2 w-full pl-10 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-50"
            placeholder="Search by Tutor, Student..."
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 dark:hover:bg-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onMouseDown={() => handleSelectSuggestion(suggestion)} // Use onMouseDown to prevent onBlur from firing first
                  className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-50"
                >
                  {suggestion.name} ({suggestion.type})
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={isLoading || !searchQuery.trim()}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {searchQuery && (
        <div className="mt-2 text-sm text-gray-600 dark:text-slate-400">
          <span className="font-medium">Searching for:</span> "{searchQuery}"
        </div>
      )}
    </form>
  )
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
}
