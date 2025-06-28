/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'edirne': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#C41E3A', // Ana Edirne kırmızısı
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'edirne-gold': '#FFD700',
        'edirne-blue': '#1E88E5',
        'edirne-green': '#4CAF50',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'fade-in-delay': 'fadeIn 1s ease-in-out 0.3s backwards',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-up-delay': 'slideUp 0.6s ease-out 0.2s backwards',
        'slide-up-delay-2': 'slideUp 0.6s ease-out 0.4s backwards',
        'slide-up-delay-3': 'slideUp 0.6s ease-out 0.6s backwards',
        'slide-up-delay-4': 'slideUp 0.6s ease-out 0.8s backwards',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}