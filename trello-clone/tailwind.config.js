module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-bg': 'linear-gradient(135deg, rgba(29,78,216,0.7), rgba(234,88,12,0.7))',
      },
    },
  },
  plugins: [],
};
