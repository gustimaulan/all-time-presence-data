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
        neo: {
          yellow: '#FEF9C3', // Soft Pastel Yellow
          pink: '#FCE7F3',   // Soft Pastel Pink
          blue: '#DBEAFE',   // Soft Pastel Blue
          green: '#DCFCE7',  // Soft Pastel Green
          red: '#FEE2E2',    // Soft Pastel Red
          orange: '#FFEDD5', // Soft Pastel Orange
          purple: '#F3E8FF', // Soft Pastel Purple
          bg: '#FCFCFC',     // Cleaner, softer background
          card: '#FFFFFF',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'neo': '4px',       // Added subtle rounding for "smoother" feel
        'neo-sm': '2px',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'neo': '3px 3px 0px 0px rgba(0, 0, 0, 1)',    // Reduced offset
        'neo-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)', // Reduced offset
        'neo-sm': '1.5px 1.5px 0px 0px rgba(0, 0, 0, 1)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      borderWidth: {
        'neo': '2px',      // Thinner borders
        'neo-sm': '1px',   // Thinner borders
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
