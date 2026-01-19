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
    success: 'bg-neo-green text-black',
    error: 'bg-neo-red text-black',
    info: 'bg-neo-blue text-black',
    warning: 'bg-neo-yellow text-black'
  }[type]

  return (
    <div className={`fixed bottom-6 right-6 ${bgColor} border-neo border-black shadow-neo rounded-neo px-6 py-4 flex items-center gap-4 min-w-[280px] max-w-md z-50 animate-slide-up`}>
      <span className="flex-1 font-black uppercase tracking-tight text-sm">{message}</span>
      <button
        onClick={onClose}
        className="border-2 border-black bg-white text-black p-1 hover:bg-black hover:text-white transition-all shadow-neo-sm rounded-neo-sm"
        aria-label="Close notification"
      >
        <X size={16} strokeWidth={3} />
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
