/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-to-rainbow': 'linear-gradient(to right, #ff9a9e, #fad0c4, #fbc2eb)',
        'gradient-to-blue': 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
      },
      colors: {
        primary: '#6366f1',
        secondary: '#d946ef',
        background: '#f3f4f6',
      },
      borderRadius: {
        lg: '12px',
        xl: '20px',
      },
    },
  },
  plugins: [],
};
