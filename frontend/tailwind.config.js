/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#26d366",
        background: "#111b21",
        surface: "#202c33",
        icon: "#aebac1",
        primary_green: "#00a884",
        secondary_green: "#005c4b",
        text: "#e9edef",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
