module.exports = {
  purge: {
    enabled: true,
    content: ['./index.html', './index.js'],
    options: {
      keyframes: true
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem'
      }
    },
    extend: {}
  },
  variants: {},
  plugins: []
}
