/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* white-10-opacity */
        input: "var(--color-input)", /* elevated-surface */
        ring: "var(--color-ring)", /* cyan-accent */
        background: "var(--color-background)", /* rich-dark-base */
        foreground: "var(--color-foreground)", /* white */
        primary: {
          DEFAULT: "var(--color-primary)", /* electric-blue */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* deep-slate */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* clear-red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* deep-slate */
          foreground: "var(--color-muted-foreground)", /* blue-gray-400 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* cyan-highlight */
          foreground: "var(--color-accent-foreground)", /* rich-dark-base */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* elevated-surface */
          foreground: "var(--color-popover-foreground)", /* white */
        },
        card: {
          DEFAULT: "var(--color-card)", /* elevated-surface */
          foreground: "var(--color-card-foreground)", /* white */
        },
        success: {
          DEFAULT: "var(--color-success)", /* bright-green */
          foreground: "var(--color-success-foreground)", /* rich-dark-base */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber */
          foreground: "var(--color-warning-foreground)", /* rich-dark-base */
        },
        error: {
          DEFAULT: "var(--color-error)", /* clear-red */
          foreground: "var(--color-error-foreground)", /* white */
        },
        surface: {
          DEFAULT: "var(--color-surface)", /* elevated-surface */
          foreground: "var(--color-surface-foreground)", /* white */
        },
        text: {
          primary: "var(--color-text-primary)", /* white */
          secondary: "var(--color-text-secondary)", /* blue-gray-400 */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 217, 255, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 217, 255, 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 150ms ease-out",
        "fade-out": "fade-out 150ms ease-out",
        "slide-in-from-top": "slide-in-from-top 200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        "slide-in-from-bottom": "slide-in-from-bottom 200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      zIndex: {
        '1000': '1000',
        '1100': '1100',
        '1200': '1200',
        '1300': '1300',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}