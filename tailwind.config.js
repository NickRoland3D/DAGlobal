/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d5f5d',
        secondary: '#afc1c0',
        background: '#d1d8d4',
      },
      screens: {
        'md': '900px',
        'xl': '1230px',
      },
    },
  },
  plugins: [],
}
