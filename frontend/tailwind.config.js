/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0a',
          secondary: '#121212',
          purple: '#7B5EA7',
          deepPurple: '#1A0533',
        },
        accent: {
          green: '#1DB954',
          lime: '#C5F135',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          dark: '#121212',
        },
        status: {
          draft: '#FFA500',
          scripted: '#7B5EA7',
          published: '#1DB954',
        },
      },
      borderRadius: {
        card: '16px',
        pill: '50px',
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Circular Std"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1440px',
      },
    },
  },
  plugins: [],
};
