import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#F7F5F1',
          alt: '#EEF2F3',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F1F4F5',
        },
        ink: {
          DEFAULT: '#0F1B24',
          muted: '#41525C',
          faint: '#586268',
        },
        accent: {
          DEFAULT: '#0A6E78',
          hover: '#0A616A',
          soft: '#D6EBED',
        },
        hero: {
          sky: '#BFE0E6',
          sand: '#E9E1D3',
        },
        line: {
          DEFAULT: '#E2E1DC',
          strong: '#CFD6D8',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-lg': ['clamp(2.75rem, 5vw + 1rem, 4.25rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.25rem, 3.5vw + 1rem, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        glass: '0 1px 2px rgba(15,27,36,0.04), 0 10px 30px rgba(15,27,36,0.05)',
        'glass-lift': '0 2px 4px rgba(15,27,36,0.05), 0 20px 50px rgba(15,27,36,0.07)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
