import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { X } from 'react-feather'

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-notion-green text-notion-text border-notion-border',
    error: 'bg-notion-red text-notion-text border-notion-border',
    info: 'bg-notion-blue/10 text-notion-blue border-notion-blue/20',
    warning: 'bg-notion-yellow text-notion-text border-notion-border'
  }[type]

  return (
    <div className={`fixed bottom-6 right-6 ${bgColor} border rounded-notion-md shadow-notion-lg px-5 py-3 flex items-center gap-4 min-w-[300px] max-w-md z-50 animate-slide-up`}>
      <span className="flex-1 font-medium text-sm">{message}</span>
      <button
        onClick={onClose}
        className="text-notion-gray hover:text-notion-text transition-colors p-1"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  )
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
}

export default Toast
