/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
          primary: "#1E2837",
          secondary: "#6B5B95",      // Indigo
          accent: "#88B04B",         // Green
          success: "#F7CAC9",        // Pink
          warning: "#F5D76E",        // Yellow
          danger: "#E94B3C",         // Red
          info: "#92A8D1",           // Light Blue
          light: "#F0F8FF",          // Alice Blue
          dark: "#034F84",           // Dark Blue      
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
      addUtilities(newUtilities);
    }
  ],
};
