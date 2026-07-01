/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./daekwangtech_homepage_v3_function_pass/index.html",
    "./daekwangtech_homepage_v3_function_pass/styles.css",
    "./daekwangtech_homepage_v3_function_pass/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#FAF9F6",
        soft: "#F4F2EE",
        surface: "#FFFFFF",
        "surface-2": "#F8F7F4",
        "border-soft": "#E8E4DD",
        "border-mid": "#D8D2C7",
        "text-main": "#18181B",
        "text-sub": "#5F5F66",
        "text-muted": "#8B8B93",
        charcoal: "#23262B",
        "charcoal-2": "#2F3338",
        warm: "#C7A97A",
        champagne: "#DCC9A6"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(24, 24, 27, 0.08)",
        cta: "0 16px 40px rgba(24, 24, 27, 0.18)"
      }
    }
  },
  plugins: []
};
