/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:
        {
        // VariableFont не сработает - на мобильных он предоставляет лишь одно значение - default
          inter: ["InterRegular"],
          interMedium: ["InterMedium"],
          interBold: ["InterBold"],

          mulish: ["MulishRegular"],
          mulishMedium: ["MulishMedium"],
          mulishBold: ["MulishBold"],
        },
      fontSize: {
        '9': '9px',
        '10': '10px',
        '11': '11px',
        '12': '12px',
        '13': '13px',
        '14': '14px',
        '15': '15px',
        '16': '16px',
        '17': '17px',
        '18': '18px',
        '19': '19px',
        '20': '20px',
        '24': '24px',
        '26': '26px',
        '28': '28px',
        '30': '30px',
        '33': '33px',
        '38': '38px',
        '42': '42px',
        '46': '46px',
        '50': '50px',
        '60': '60px',
      },
      fontWeight: {
        // для унификации CustomText
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      spacing: {
        // 4: 14,
        10: 38,
      },
    },
  },
  // гарантия, что эти классы не исчезнут при оптимизации
  safelist: [
    "font-inter",
    "font-interMedium",
    "font-interBold",
    "font-mulish",
    "font-mulishMedium",
    "font-mulishBold",
  ],
  plugins: [],
};