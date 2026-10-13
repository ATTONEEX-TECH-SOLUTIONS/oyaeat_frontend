import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        green: {
          900: "var(--oya-green-900)",
          700: "var(--oya-green-700)",
          500: "var(--oya-green-500)",
          100: "var(--oya-green-100)",
        },
        amber: {
          600: "var(--oya-amber-600)",
          500: "var(--oya-amber-500)",
          100: "var(--oya-amber-100)",
        },
        ink: {
          900: "var(--oya-ink-900)",
          600: "var(--oya-ink-600)",
          300: "var(--oya-ink-300)",
        },
        surface: {
          0: "var(--oya-surface-0)",
          50: "var(--oya-surface-50)",
          100: "var(--oya-surface-100)",
        },
        border: "var(--oya-border)",
        danger: "var(--oya-danger)",
        warning: "var(--oya-warning)",
        info: "var(--oya-info)",
      },
      borderRadius: {
        sm: "var(--oya-radius-sm)",
        md: "var(--oya-radius-md)",
        lg: "var(--oya-radius-lg)",
      },
      boxShadow: {
        card: "var(--oya-shadow-card)",
        pop: "var(--oya-shadow-pop)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
};

export default config;
