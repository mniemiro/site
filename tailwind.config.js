module.exports = {
  // ... existing config ...
  theme: {
    extend: {
      keyframes: {
        hologram: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
      },
    },
  },
}