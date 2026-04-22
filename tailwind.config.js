/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#F5F7FA',
        'surface-2': '#EEF1F6',
        border: '#E2E8F0',

        primary: '#FF6B2C',        // naranja energético — CTAs, acciones principales
        'primary-light': '#FFF0E9',// naranja muy suave — fondos de cards activas
        'primary-dark': '#D94E10', // naranja oscuro — hover states

        accent: '#2563EB',         // azul medio — datos, métricas, información
        'accent-light': '#EFF6FF', // azul muy suave — fondos de badges de info
        'accent-dark': '#1D4ED8',  // azul oscuro — hover states

        ink: '#0A0A0A',            // negro casi puro — títulos y texto de peso
        'ink-secondary': '#374151',// gris oscuro — texto de cuerpo
        'ink-muted': '#9CA3AF',    // gris medio — texto secundario / placeholders

        success: '#16A34A',
        error: '#DC2626',
        warning: '#D97706',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'button': '0 4px 14px rgba(255,107,44,0.35)',
        'card': '0 2px 16px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
