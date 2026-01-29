/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        // Primary colors
        primary: {
          dark: "#2A2418",      // 메인 텍스트
          DEFAULT: "#5A4A3A",   // 버튼/액센트
          light: "#6B5D4F",     // 보조 텍스트
          lighter: "#9A8C7A",   // 연한 텍스트
        },
        // Background colors
        background: {
          DEFAULT: "#FAF8F4",   // 메인 배경
          light: "#F5F0E8",      // 연한 배경
          lighter: "#ECE4D7",    // 더 연한 배경
          card: "#E8DCC8",       // 카드 배경
          hover: "#EFE6D8",      // hover 배경
        },
        // Border colors
        border: {
          DEFAULT: "#5A4A3A26",  // 기본 테두리 (투명도 포함)
          light: "#E6DFD2",      // 연한 테두리
        },
        // Text colors
        text: {
          primary: "#2A2418",    // 메인 텍스트
          secondary: "#6B5D4F",  // 보조 텍스트
          tertiary: "#9A8C7A",   // 연한 텍스트
        },
      },
    },
  },
  plugins: [],
};
