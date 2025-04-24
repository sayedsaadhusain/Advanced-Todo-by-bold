/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Ensure dark mode is enabled via class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
