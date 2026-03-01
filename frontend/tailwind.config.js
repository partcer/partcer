/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f97316", // orange-500
          light: "#fb923c", // orange-400
          dark: "#ea580c", // orange-600
        },
        secondary: {
          DEFAULT: "#000000", // black
          light: "#262626", // neutral-800
          dark: "#000000", // black
        },
      },
      transitionProperty: {
        'height': 'height',
        'max-height': 'max-height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};
