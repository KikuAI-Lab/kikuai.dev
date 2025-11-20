/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue",
    "./pages/**/*.vue",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue"
  ],
  theme: {
    extend: {
      colors: {
        bg: '#17191d',
        'bg-darker': '#17191d',
        'bg-card': '#282f33',
        'bg-card-hover': '#30373b',
        text: '#e5e5e5',
        'text-muted': '#9ba0a5',
        hover: '#1f2327',
        accent: '#a89cc4',
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'content': '900px',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
