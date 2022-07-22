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
        primary: '#ECF1FF',
        primary2: '#FF6633',
        primary3: '#FF6633',
        secondary: '#0B0573',
        secondary2: '#0B0573',
        secondary3: '#0B0573',
        accent: '#170AF0',
        accent2: '#170AF0',
        accent3: '#E87722',
        grey: '#ECF1FF',
        grey2: '#8D92B0',
        grey3: '#ECF1FF',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}