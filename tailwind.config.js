/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        Mainfront: ["plusSans", "sense-sarif"],
        Inter: ["inter", "sense-sarif"],
        BeVietnam: ["beVietnam", "sense-sarif"],
        productSans: ["productSans", "sense-sarif"],
      },
      colors: {
        // Primary Colors
        primary: {
          50: "#e6f0ff",
          100: "#cce0ff",
          200: "#99c2ff",
          300: "#66a3ff",
          400: "#3385ff",
          500: "#0057d9", // Main primary color
          600: "#0046b3",
          700: "#00348c",
          800: "#002366",
          900: "#001140",
        },
        // Secondary Colors
        secondary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        // Accent Colors
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Neutral Colors
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        // Success, Warning, Error Colors
        success: {
          500: "#22c55e",
          600: "#16a34a",
        },
        warning: {
          500: "#f59e0b",
          600: "#d97706",
        },
        error: {
          500: "#ef4444",
          600: "#dc2626",
        },
        // Background Colors
        background: {
          light: "#ffffff",
          dark: "#0f172a",
        },
        // Text Colors
        text: {
          light: {
            primary: "#1f2937",
            secondary: "#4b5563",
          },
          dark: {
            primary: "#f3f4f6",
            secondary: "#d1d5db",
          },
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        primaryForeground: "hsl(var(--primary-foreground))",
        screens: {
          xssm: "375px",
          xxsm: "420px",
          midmid: "455px",
          midsm: "500px",
          midxmid: "560px",
          mlg: "800px",
          midlg: "960px",
          bxl: "1400px",
          xlg: "1445px",
          x2xl: "1650px",
          xmlg: "1760px",
          xmllg: "1840px",
          xxlg: "1900px",
        },
        secondaryForeground: "hsl(var(--secondary-foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
