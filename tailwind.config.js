/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563eb", foreground: "#ffffff" },
        destructive: { DEFAULT: "#ef4444", foreground: "#ffffff" },
        muted: { DEFAULT: "#f1f5f9", foreground: "#64748b" },
        border: "#e2e8f0",
        background: "#ffffff",
        foreground: "#0f172a",
        card: { DEFAULT: "#ffffff", foreground: "#0f172a" },
      },
      borderRadius: { lg: "0.5rem", md: "0.375rem", sm: "0.25rem" },
    },
  },
  plugins: [],
}
