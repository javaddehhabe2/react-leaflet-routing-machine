/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      body: ["IranYekan"],
      display: ["IranYekan"],
    },

    extend: {
      fontSize: {
        xxs: "0.5rem",
        xxxs: "0.25rem",
      },
      colors: {
        transparent: "transparent",
        white: "#ffffff",
        bodycolor: "#E4E9F7",
        sidebarcolor: "#FFF",
        primarycolor: "#695CFE",
        primarycolorlight: "#877cfe",
        togglecolor: "#DDD",
        textcolor: "#707070",
        inputcolor: "#e5e6e6",
        hover: "#444",
        setting: "#00970a",
      },
    },
  },
  plugins: [],
};
