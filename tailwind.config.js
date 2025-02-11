/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        hologram: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
      },
      colors: {
        background: 'white', // or any color you want for bg-background
        // If you're using dark mode, you might want to add:
        dark: {
          background: '#1a1a1a'
        }
      }
    },
  },
  darkMode: 'class', // if you're using dark mode
  plugins: [],
}