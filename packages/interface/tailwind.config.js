module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        transparent: "transparent",
        primary: "#FFFFFF",
        secondary: "#8ccddf",
        black: {
          DEFAULT: "#000000",
          type1: "#292825",
        },
      },
      gridTemplateColumns: {
        droids: "260px minmax(250px, 1fr) 100px",
      },
    },
  },
  screens: {
    sm: "640px",
    // => @media (min-width: 640px) { ... }

    md: "768px",
    // => @media (min-width: 768px) { ... }

    lg: "1024px",
    // => @media (min-width: 1024px) { ... }

    xl: "1280px",
    // => @media (min-width: 1280px) { ... }

    "2xl": "1536px",
    // => @media (min-width: 1536px) { ... }
  },
  variants: {
    extend: {
      maxHeight: ["hover", "focus", "responsive"],
      minHeight: ["hover", "focus", "responsive"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // import tailwind forms
  ],
};
