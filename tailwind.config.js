module.exports = {
  purge: {
    enabled: true,
    mode: 'all',
    content: [
      './public/index.html',
      './src/index.tailwind.css',
      './src/**/*.jsx'
    ]
  },
  theme: {
    screens: {
      'sm': '480px',
    },
    extend: {
      height: {
        '1/2': '50%',
        '3/4': '75%',
      },
      inset: {
        '8': '2rem',
        '12': '3rem',
      },
      lineHeight: {
        '2': '.5rem',
      },
      fontSize: {
        'smallest': '10px',
      },
      letterSpacing: {
        'tightest': '-.075em',
      },
    },
  },
  variants: {},
  plugins: [],
}
