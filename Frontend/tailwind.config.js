/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite/plugin";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./demo/**/*.html",
    "./js/**/*.js",
    "./docs/**/*.*",
  ],
  darkMode: "class", // Combining dark mode settings
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [flowbite],
};
