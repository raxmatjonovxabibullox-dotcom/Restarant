/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbf0',
          100: '#fef5d6',
          200: '#fde69d',
          300: '#fbd15e',
          400: '#f8ba24',
          500: '#d99708',
          600: '#b87304',
          700: '#925106',
          800: '#77400d',
          900: '#643610',
          950: '#3a1b04',
        },
        primary: {
          50: '#fbf7ee',
          100: '#f5ebd2',
          200: '#edd6a6',
          300: '#e3be74',
          400: '#dba347',
          500: '#cc872b',
          600: '#ad6721',
          700: '#874b1c',
          800: '#6f3d1d',
          900: '#5c331c',
          950: '#351a0d',
        },
        dark: {
          800: '#181b20',
          850: '#14161b',
          900: '#0f1115',
          950: '#0a0b0d',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Cinzel', 'serif']
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(217, 151, 8, 0.15)',
        'luxury-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
        'glow': '0 0 25px rgba(248, 186, 36, 0.35)',
        'glow-lg': '0 0 40px rgba(248, 186, 36, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
