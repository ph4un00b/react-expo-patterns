// // tailwind.config.js
// const nativewind = require("nativewind/tailwind/css");

// module.exports = {
//   content: ["./mobile/**/*.{js,ts,jsx,tsx}"],
//   plugins: [nativewind()],
//   // ...
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./App.tsx"],
  content: ["./App.tsx", "./mobile/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
