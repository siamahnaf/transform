/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      screens: {
        xxs: "0px",
        lg: "960px",
      },
      colors: {
        main: "#62A92B",
      }
    },
  },
  plugins: [],
}

