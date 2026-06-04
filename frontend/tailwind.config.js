/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FFFFFF',
          dark: '#E4E4E7',
          light: '#F4F4F5',
        },
        secondary: {
          DEFAULT: '#A1A1AA',
          dark: '#71717A',
          light: '#D4D4D8',
        },
        indigo: {
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          900: '#18181B',
        },
        purple: {
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          900: '#18181B',
        },
        cyan: {
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          900: '#18181B',
        },
        emerald: {
          400: '#4ADE80',
          500: '#22C55E',
        },
      },
      animation: {
        'float': 'none',
        'pulse-slow': 'none',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
