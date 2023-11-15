/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: 'jit',
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      Montserrat: 'Montserrat, sans-serif',
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
    fontSize: {
      sm: '1.1rem',
      xsm: '14px',
      lg: '3.1rem',
      xl: '4.0rem',
    },
    fontWeight: {
      thin: 200,
      semiLight: 300,
      light: 400,
      normal: 500,
      medium: 600,
      bold: 700,
      smbold: 800,
      xbold: 900,
    },
  
    extend: {
      colors:{
        primary:'#1A8753',
      },
      screens: {
        mf: '990px',
      },
      keyframes: {
        'slide-in': {
          '0%': {
            '-webkit-transform': 'translateX(120%)',
            transform: 'translateX(120%)',
          },
          '100%': {
            '-webkit-transform': 'translateX(0%)',
            transform: 'translateX(0%)',
          },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
};