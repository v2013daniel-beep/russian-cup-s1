import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dota: {
          black: "#0A0A0A",
          void: "#111111",
          surface: "#141414",
          panel: "#1A1A1A",
          red: "#E53935",
          "red-bright": "#FF2A2A",
          gold: "#FFD700",
          "gold-dim": "#D4AF37",
          "gold-dark": "#B8860B",
          text: "#F5F5F5",
          muted: "#A0A0A0",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "Oswald", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at top, rgba(229,57,53,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(255,215,0,0.08) 0%, transparent 50%), linear-gradient(to bottom, #0A0A0A, #111111)",
        "gold-gradient": "linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%)",
        "red-gradient": "linear-gradient(135deg, #FF2A2A 0%, #E53935 50%, #9B0000 100%)",
      },
      boxShadow: {
        "glow-red": "0 0 30px rgba(229,57,53,0.4)",
        "glow-gold": "0 0 30px rgba(255,215,0,0.3)",
        "glow-red-sm": "0 0 15px rgba(229,57,53,0.35)",
        "glow-gold-sm": "0 0 15px rgba(255,215,0,0.25)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(229,57,53,0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(229,57,53,0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
