/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,tsx,ts,jsx}',
    './components/ui/**/*.{js,tsx,ts,jsx}',
    './app/**/*.{js,tsx,ts,jsx}',
    // If you use a `src` directory, add: './src/**/*.{js,tsx,ts,jsx}'
    // Do the same with `components`, `hooks`, `styles`, or any other top-level directories
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#22c55e',
          dark: '#16a34a',
        },
      },
    },
  },
  plugins: [],
};