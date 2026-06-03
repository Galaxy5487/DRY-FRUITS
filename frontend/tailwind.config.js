/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#f7f1e7",
          sand: "#ead9c3",
          amber: "#b86a28",
          cocoa: "#5f3b24",
          olive: "#7c8a4d",
          gold: "#d6a54b"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(95, 59, 36, 0.12)"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Segoe UI", "sans-serif"]
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(214,165,75,0.35), transparent 30%), linear-gradient(120deg, rgba(95,59,36,0.04), rgba(184,106,40,0.1))"
      }
    }
  },
  plugins: []
};
