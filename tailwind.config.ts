import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#00B050',
        'accent-hover': '#009040',
        ink: '#0a0a0a',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', '"DM Sans"', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        card: '12px',
        modal: '20px',
      },
    },
  },
  plugins: [],
}
export default config
