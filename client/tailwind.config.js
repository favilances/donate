/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#1E1E1E',
        porcelain: '#F5F5F5',
        primary: '#1D1F2C',
        'primary-foreground': '#F9FAFB',
        accent: '#6366F1',
        'accent-foreground': '#1F2937',
        muted: '#F3F4F6',
        'muted-foreground': '#6B7280',
        border: '#E5E7EB',
        surface: '#F9FAFB',
        'surface-dark': '#111827',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.5rem',
      },
      boxShadow: {
        brand: '0 40px 80px -20px rgba(15, 23, 42, 0.25)',
        soft: '0 18px 40px -14px rgba(148, 163, 184, 0.35)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.04) 50%, rgba(14, 165, 233, 0.12) 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

