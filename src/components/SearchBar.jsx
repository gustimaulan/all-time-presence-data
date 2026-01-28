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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-notion-gray group-focus-within:text-notion-blue transition-colors" />
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
              className="notion-input w-full pl-10 pr-10"
              placeholder="Search by tutor or student name..."
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-notion-gray hover:text-notion-text transition-colors"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-20 w-full mt-1.5 bg-white border border-notion-border rounded-notion-md shadow-notion-lg overflow-hidden py-1 animate-fade-in">
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onMouseDown={() => handleSelectSuggestion(suggestion)}
                      className="px-3 py-2 cursor-pointer hover:bg-notion-hover transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 truncate">
                          <div className={`w-1.5 h-1.5 rounded-full ${suggestion.type === 'tutor' ? 'bg-notion-blue' : 'bg-notion-purple'}`}></div>
                          <span className="text-notion-text font-medium text-sm truncate">{suggestion.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-notion-gray uppercase px-1.5 py-0.5 bg-notion-gray-light rounded-notion tracking-wider">
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
            className="notion-btn-primary px-5 py-1.5 h-[38px] transition-all shadow-notion-sm hover:shadow-notion"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <Search size={16} className="mr-2" />
                Search
              </>
            )}
          </button>
        </div>
      </div>

    </form>
  )
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
}
