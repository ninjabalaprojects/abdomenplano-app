/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terracota: '#C4704F',
        'dusty-rose': '#D4A5A5',
        sage: '#8FAF9F',
        cream: '#FAF7F2',
        beige: '#F5EDE3',
        'warm-brown': '#3D2C2C',
        'light-brown': '#7A5C5C',
        'pale-rose': '#F0DADA',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
