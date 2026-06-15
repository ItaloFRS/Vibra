import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#954400",
          container: "#FB8B3F",
        },
        secondary: {
          DEFAULT: "#644E9D",
          container: "#DAC9FF",
        },
        tertiary: "#B00F69",
        background: {
          DEFAULT: "#FFF4EF",
          dark: "#0C0A09", // stone-950
        },
        surface: {
          DEFAULT: "#FFF4EF",
          dark: "#1C1917", // stone-900
          container: "#FFE3CF",
          "container-high": "#FFDCC2",
          "container-low": "#FFEEE2",
        },
        "on-surface": "#482603",
        "on-surface-variant": "#7D522B",
        outline: {
          DEFAULT: "#9C6D43",
          variant: "#D9A274",
        },
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        }
      },
      fontFamily: {
        plus: ["var(--font-plus-jakarta-sans)"],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.5rem',
        DEFAULT: '1rem',
        'lg': '2rem',
        'xl': '3rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
