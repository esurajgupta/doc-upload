/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '-11px 33px 35px -3px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
}

