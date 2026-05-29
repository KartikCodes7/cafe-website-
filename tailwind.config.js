/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
        },
        brand: {
          neonBlue: '#00f0ff',
          neonPurple: '#a100ff',
          gold: '#ffd700',
        }
      },
      backgroundImage: {
        'cinematic-gradient': 'linear-gradient(to bottom, rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 1))',
      }
    },
  },
  plugins: [],
}
