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
          DEFAULT: '#0A0F0D',
          100: '#111714',
          200: '#162019',
          300: '#0D1210',
        },
        primary: {
          DEFAULT: '#00D48B',
          dark: '#00A86E',
          light: 'rgba(0,212,139,0.1)',
        },
        muted: {
          DEFAULT: '#8A9490',
          light: '#CDD5D0',
        },
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '22px',
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
        'typing': 'typing 1.2s infinite',
      },
      keyframes: {
        typing: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
