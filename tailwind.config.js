/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.js", "./src/components/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
