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
    }} className="space-y-4">
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black" strokeWidth={3} />
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
              className="neo-input w-full pl-12 pr-12 text-black placeholder-black/50"
              placeholder="Search by tutor or student name..."
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <div className="p-1 border-2 border-black bg-white hover:bg-neo-red text-black transition-colors rounded-sm">
                  <X size={16} strokeWidth={3} />
                </div>
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-20 w-full mt-2 bg-white border-neo border-black shadow-neo overflow-hidden">
                <div className="max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onMouseDown={() => handleSelectSuggestion(suggestion)}
                      className="px-4 py-3 cursor-pointer hover:bg-neo-yellow transition-colors border-b-2 border-black last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-black font-black text-sm sm:text-base truncate uppercase tracking-tight">{suggestion.name}</span>
                        <span className="neo-badge bg-white text-black uppercase scale-75 origin-right">
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
            className="neo-btn bg-neo-green text-black disabled:opacity-50 disabled:bg-gray-200"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="black" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="black" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing
              </div>
            ) : (
              <div className="flex items-center justify-center uppercase tracking-tighter">
                <Search size={18} className="mr-2 stroke-[3px]" />
                Search
              </div>
            )}
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-black font-bold uppercase">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate">Searching: <span className="bg-neo-yellow px-1 border-neo-sm border-black">"{searchQuery}"</span></span>
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
