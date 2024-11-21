/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'dropdown': 'white',
        'dropdown-hover': '#f3f4f6',
      },
      textColor: {
        'dropdown': '#111827',
        'dropdown-secondary': '#4b5563',
      }
    },
  },
  plugins: [],
};