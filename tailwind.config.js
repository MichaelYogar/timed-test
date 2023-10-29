/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./prisma/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              marginTop: "0",
            },
            p: {
              marginTop: "0",
            },
            color: "rgb(22, 20, 12)",
          },
        },
      },
      gridTemplateAreas: {
        layout: ["header header", "sidebar main", "sidebar main"],
      },
      gridTemplateColumns: {
        layout: "15% 1fr",
      },
      gridTemplateRows: {
        layout: "2.5rem auto",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    require("@savvywombat/tailwindcss-grid-areas"),
  ],
};
