/** @type {import('tailwindcss').Config} */

const preset = require("./projects/shared/tailwind-preset.js");

module.exports = {
  presets: [preset],

  content: ["./projects/**/*.{html,ts}", "./src/**/*.{html,ts}"],

  theme: {
    extend: {},
  },

  plugins: [],

  safelist: [{ pattern: /.*/ }],
};
