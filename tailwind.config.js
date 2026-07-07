/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          primary: '#E9B84A',
          fill: '#EDC062',
          light: '#EDC77E',
          dark: '#AE895B',
        },
        teal: {
          'card-dark': '#183739',
          'card-light': '#2E6264',
          secondary: '#A7C4C7',
        },
        bg: {
          base: '#FFFFFC',
        },
        surface: {
          card: '#FEFEFE',
        },
        ink: '#1E2A2E',
        status: {
          active: '#4A6E52',
          paused: '#E5E6E5',
          insufficient: '#FFE0DB',
          alert: '#FDDAD4',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Nunito Sans', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
