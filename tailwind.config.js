/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... other config
  theme: {
    extend: {
      // ... other extensions
      keyframes: {
        hologram: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      animation: {
        hologram: 'hologram 3s ease-in-out infinite',
      },
    },
  },
  // ... other config
} 