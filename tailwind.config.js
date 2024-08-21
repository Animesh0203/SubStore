module.exports = {
    theme: {
      extend: {
        fontFamily: {
          custom: ['CustomFont', 'sans-serif'], // Replace 'YourCustomFont' with the font's name
        },
        colors: {
          'fresh-green': '#148a2b', // Your fresh green color
          'offwhite': '#5a9e6f', // Your offwhite color
          'border-yellow': '#d4af37',
        },
      },
    },
    variants: {
      extend: {
        backgroundColor: ['hover'],
        borderColor: ['hover'],
        textColor: ['hover'],
      },
    },
    plugins: [],
  }
  