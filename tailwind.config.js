/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)"
        },
        secondary: "var(--secondary)",
        card: "var(--card-bg)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

