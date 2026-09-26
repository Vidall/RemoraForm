import type { Config } from 'tailwindcss';

/**
 * Tailwind config — Remora Pages
 * Design system: fundo escuro, tipografia serif nos títulos,
 * acento dourado. Mobile-first é a REGRA — todos os breakpoints
 * escalam pra cima, nunca reduzem.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg)',
          card: 'var(--color-bg-card)',
          elevated: 'var(--color-bg-elevated)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        fg: {
          DEFAULT: 'var(--color-fg)',
          muted: 'var(--color-fg-muted)',
          subtle: 'var(--color-fg-subtle)',
        },
        accent: {
          DEFAULT: '#C9A227',
          hover: '#D4B03E',
          soft: 'rgba(201, 162, 39, 0.12)',
        },
        segmento: {
          perfumaria: '#C9A227',
          restaurante: '#DC2626',
          salao: '#EC4899',
          loja_roupas: '#8B5CF6',
          outro: '#64748B',
        },
        danger: '#EF4444',
        success: '#22C55E',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        wizard: '680px',
      },
      minHeight: {
        touch: '48px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'star-pop': {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 220ms ease-out',
        'slide-in': 'slide-in 260ms ease-out',
        'star-pop': 'star-pop 240ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
