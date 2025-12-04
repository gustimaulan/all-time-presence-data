import { X, Search } from 'react-feather'
import PropTypes from 'prop-types'
import { useState, useEffect, useMemo } from 'react'
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

  const allTutors = useMemo(() => allTutorsData || [], [allTutorsData])
  const allStudents = useMemo(() => allStudentsData || [], [allStudentsData])

  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

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
    }} className="space-y-3">
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
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
                }, 150) // Delay to allow click on suggestion
              }}
              className="block w-full pl-9 sm:pl-12 pr-9 sm:pr-12 py-2.5 sm:py-3 border border-gray-200 dark:border-slate-600 rounded-lg sm:rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm text-sm sm:text-base"
              placeholder="Search by tutor name, student name..."
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
              >
                <div className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
                  <X size={14} className="sm:w-4 sm:h-4" />
                </div>
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg sm:rounded-xl shadow-medium overflow-hidden animate-slide-up">
                <div className="max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onMouseDown={() => handleSelectSuggestion(suggestion)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150 border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white font-medium text-sm sm:text-base truncate">{suggestion.name}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 flex-shrink-0">
                          {suggestion.type}
                        </span>
                      </div>
                    </li>
                  ))}
                </div>
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm text-sm sm:text-base"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Search size={16} className="sm:w-4 sm:h-4 mr-2" />
                Search
              </div>
            )}
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 animate-slide-up">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate">Searching for: <span className="font-medium text-gray-900 dark:text-white">"{searchQuery}"</span></span>
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
