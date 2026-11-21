/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b0b',
        'ink-soft': '#1a1a1a',
        paper: '#efece5',
        'paper-2': '#e4ded3',
        cobalt: '#003bd0',
        'cobalt-deep': '#002a94',
        'cobalt-light': '#7f9dff',
        oud: '#4a3324',
      },
      fontFamily: {
        display: ['Archivo', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Instrument Serif', 'Times New Roman', 'serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      transitionTimingFunction: {
        precision: 'cubic-bezier(0.16, 1, 0.3, 1)',
        editorial: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
}
