import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFB84C',
        secondary: '#4C9AFF',
        accent: '#FF6B9D',
        bgWarm: '#FFF8E7',
        bgPaper: '#FFFFFF',
        ink: '#2E2A4A',
        inkSoft: '#6B6689',
        success: '#3DCF8E',
        warning: '#FFB84C',
        danger: '#FF6B6B',
        gold: '#FFD35E',
      },
      fontFamily: {
        display: ['"Gaegu"', '"KCC-Ganpan"', 'system-ui', 'sans-serif'],
        body: ['"Pretendard"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['48px', { lineHeight: '1.15' }],
        h3: ['32px', { lineHeight: '1.25' }],
        body: ['20px', { lineHeight: '1.5' }],
        small: ['16px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        card: '24px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 12px 24px rgba(46,42,74,0.12)',
        cardLg: '0 20px 48px rgba(46,42,74,0.18)',
        press: 'inset 0 4px 8px rgba(46,42,74,0.12)',
        glow: '0 0 32px rgba(255,184,76,0.45)',
      },
      spacing: {
        touchMin: '120px',
      },
      keyframes: {
        breath: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        breath: 'breath 2.4s ease-in-out infinite',
        floaty: 'floaty 2.2s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
