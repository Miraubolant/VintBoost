/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalism palette from Coolors
        'vinted': '#1D3354',
        'cream': '#E9FFF9',
        'pink-pastel': '#D64045',
        'mint': '#9ED8DB',
        'slate': '#467599',
        'nb-black': '#1a1a1a',
        'nb-white': '#FFFFFF',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'grotesk': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '6px 6px 0px 0px #1a1a1a',
        'brutal-sm': '4px 4px 0px 0px #1a1a1a',
        'brutal-lg': '8px 8px 0px 0px #1a1a1a',
        'brutal-hover': '8px 8px 0px 0px #1a1a1a',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
