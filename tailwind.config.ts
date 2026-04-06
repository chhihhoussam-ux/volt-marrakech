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
        accent: '#C8FF00',
        ink: '#0a0a0a',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'sans-serif'],
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
