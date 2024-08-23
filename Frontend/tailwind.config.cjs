/** @type {import('tailwindcss').Config} */
module.exports= {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', "sans-serif"],
        // Add more custom font families as needed
      },
    },
  },
  plugins: [],
};
