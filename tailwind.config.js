/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",], darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-red': '#E30613',
        'dark-gray': '#121212',
        'light-gray': '#F5F5F5',
      },
    },
  },
  plugins: [],
}

