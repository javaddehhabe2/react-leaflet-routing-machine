/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      body: ["BonyadeKoodak","IranYekan"],
      display: ["BonyadeKoodak","IranYekan"],
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
        modalside: "#ccc",
        close: "#aaa",
        labelsetting: "#1a1a1a",
        drivericon: "#F3F2FF",
        drivericonborder: "#DDDAFF",
        drivericonlight: "#F6EBF3",
        drivericonlightcolor: "#8A006C",
        drivericonlightborder: "#8a006c59",
        sliderbar:"#F2F2F2",
        timelineHeader:"#00000080",
        popupTitle:"#e8e7fa"
      },
    },
  },
  plugins: [],
};
