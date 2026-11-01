/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        accent2: 'rgb(var(--accent2) / <alpha-value>)',
        volt: '#C6FF3D',
        aqua: '#22E1FF',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 48px -10px rgb(var(--accent) / 0.55)',
        'glow-cyan': '0 0 48px -10px rgb(var(--accent2) / 0.55)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-2deg)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.08) rotate(2deg)', filter: 'brightness(1.25)' },
        },
        spinslow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 1.5s infinite',
        marquee: 'marquee 28s linear infinite',
        flicker: 'flicker 1.6s ease-in-out infinite',
        spinslow: 'spinslow 8s linear infinite',
      },
    },
  },
  plugins: [],
}
