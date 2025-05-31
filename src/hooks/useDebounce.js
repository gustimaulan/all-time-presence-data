import { useState, useEffect } from 'react'

/**
 * Custom hook that debounces a value
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 500)
 * @returns {any} The debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function to cancel the timeout if value changes before delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
} 