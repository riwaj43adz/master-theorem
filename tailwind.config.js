/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        surfaceAlt: '#f1f5f9',
        primary: '#4f46e5',
        'primary-light': '#6366f1',
        accent: '#7c3aed',
        'accent-light': '#8b5cf6',
        cyan: '#0891b2',
        root: '#e11d48',
        'root-glow': '#fb7185',
        middle: '#d97706',
        'middle-glow': '#fbbf24',
        leaves: '#059669',
        'leaves-glow': '#34d399',
        muted: '#64748b',
        'text-main': '#0f172a',
        'text-sub': '#475569',
        'text-muted': '#94a3b8',
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
        'grid-pattern': 'linear-gradient(rgba(79,70,229,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-40': '40px 40px',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 20px 50px -12px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
