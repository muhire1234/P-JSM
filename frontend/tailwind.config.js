import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#112233",
        mist: "#f5f7fb",
        breeze: "#e7f4ff",
        coral: "#ff7a59",
        pine: "#175f53",
        amber: "#d48b00"
      },
      boxShadow: {
        card: "0 14px 30px rgba(17, 34, 51, 0.08)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(at 70% 20%, rgba(255, 122, 89, 0.22), transparent 52%), radial-gradient(at 20% 80%, rgba(23, 95, 83, 0.2), transparent 55%), linear-gradient(135deg, #f5f7fb, #ffffff)"
      }
    }
  },
  plugins: [forms]
};
