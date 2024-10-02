const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["variant", [".dark &", '[data-kb-theme="dark"] &']],
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["JetBrains Mono Variable", ...fontFamily.sans],
        mono: ["JetBrains Mono Variable", ...fontFamily.mono],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
