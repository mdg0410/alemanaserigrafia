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
        'secondary': '#DAA520', // dorado
        'accent': '#FF0000', // rojo
        'highlight': '#FFFF00', // amarillo
        'dark': '#000000', // negro
        'light': '#FFFFFF', // blanco
        'gray-light': '#D3D3D3', // gris claro
      },
    },
  },
  plugins: [],
}