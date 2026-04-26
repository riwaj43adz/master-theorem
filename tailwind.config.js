/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#06060a',
        surface: '#0d0d14',
        surfaceAlt: '#12121c',
        primary: '#6366f1',
        primaryLight: '#818cf8',
        accent: '#a855f7',
        accentLight: '#c084fc',
        cyan: '#22d3ee',
        root: '#f43f5e',
        rootGlow: '#fb7185',
        middle: '#f59e0b',
        middleGlow: '#fbbf24',
        leaves: '#10b981',
        leavesGlow: '#34d399',
        muted: '#64748b',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'glow-breathe': 'glowBreathe 2.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        glowBreathe: {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 8px currentColor)' },
          '50%': { filter: 'brightness(1.3) drop-shadow(0 0 20px currentColor)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-40': '40px 40px',
      },
    },
  },
  plugins: [],
}
