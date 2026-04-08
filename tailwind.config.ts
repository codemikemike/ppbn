import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      fontFamily: {
        display: [
          "Playfair Display",
          "var(--font-playfair-display)",
          "Georgia",
          "serif",
        ],
      },
    },
  },
} satisfies Config;

export default config;
