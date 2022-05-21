module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Lato', 'sans-serif'],
      serif: ['Abril Fatface', 'serif']
    },
    extend: {
      colors: {
        primary: '#0E2446',
        primary2: '#174679',
        primary3: '#2571C4',
        secondary: '#624F94',
        secondary2: '#A89BCA',
        secondary3: '#E5E1EF',
        accent: '#5AB7A2',
        accent2: '#87F0D9',
        accent3: '#BDFCEE',
        grey: '#B9C0CA',
        grey2: '#808997',
        grey3: '#354050',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}