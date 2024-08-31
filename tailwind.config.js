/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      colors:{
        primary: {
          DEFAULT: '#1e3a8a', // This is the hex code for blue-900
        },
      },
      boxShadow: {
        '3xl': '-11px 33px 35px -3px rgba(0,0,0,0.2)',
      }
    },
    fontFamily:{
      sans:['SUSE'],
      serif:['SUSE'],
      mono:['SUSE']
    },
  },
  plugins: [],
}

