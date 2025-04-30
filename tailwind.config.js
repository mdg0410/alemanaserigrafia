/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4B0082', // púrpura
        'primary-light': '#6A1B9A', // púrpura más claro para mejor contraste
        'primary-dark': '#3A006E', // púrpura más oscuro
        'secondary': '#DAA520', // dorado
        'secondary-light': '#F1C232', // dorado más claro
        'secondary-dark': '#B7851A', // dorado más oscuro para contraste
        'accent': '#FF0000', // rojo
        'accent-light': '#FF3333', // rojo más claro
        'highlight': '#FFFF00', // amarillo
        'dark': '#000000', // negro
        'dark-soft': '#121212', // negro suave para fondos
        'light': '#FFFFFF', // blanco
        'light-soft': '#F5F5F5', // blanco suave para fondos
        'gray-light': '#D3D3D3', // gris claro
        'gray-dark': '#666666', // gris oscuro para texto con buen contraste
      },
      fontFamily: {
        'sans': ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        'display': ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      boxShadow: {
        'accessibility': '0 0 0 3px rgba(75, 0, 130, 0.5)', // Sombra para focus
        'card': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}