/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141414",
        ember: "#e2582c",
        sand: "#f4f1ea",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
