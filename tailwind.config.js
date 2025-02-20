/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '1.5rem'
      },  
    },
    extend: {
      colors: {
        'theme-primary': '#2a629d',
        'theme-black': '#424242',
        'theme-white': '#efefef',
        'theme-error': '#dc3545',
        'theme-green': '#28a745'
      },
      screens: {
        "xs": '480px',
        "tab": "992px"
      },
      fontFamily: {
        fontRegular: ['Montserrat'],
        fontSemiBold: ['MontserratSemiBold'],
        fontBold: ['MontserratBold'],
        fontExtraBold: ['MontserratExtraBold']
      },
    },
  },
  plugins: [],
}

