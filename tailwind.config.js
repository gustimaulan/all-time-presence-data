/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        notion: {
          bg: '#FFFFFF',
          text: '#37352F',
          border: '#E9E9E7',
          hover: '#F1F1EF',
          blue: '#2383E2',
          'blue-hover': '#1F70C1',
          gray: '#787774',
          'gray-light': '#F7F7F5',
          yellow: '#FFF9E3',
          pink: '#F5E0E9',
          orange: '#FAEBDD',
          green: '#E7F3EF',
          red: '#FDEBEC',
          purple: '#F1ECF7',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'notion': '3px',       // Notion uses very subtle rounding
        'notion-md': '5px',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'notion-sm': '0 1px 2px rgba(15, 15, 15, 0.1)',
        'notion': '0 2px 4px rgba(15, 15, 15, 0.05), 0 0 0 1px rgba(15, 15, 15, 0.1)',
        'notion-lg': '0 4px 12px rgba(15, 15, 15, 0.1), 0 0 0 1px rgba(15, 15, 15, 0.05)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      borderWidth: {
        'notion': '1px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}
