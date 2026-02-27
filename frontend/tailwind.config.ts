import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Dark Theme Colors
                primary: {
                    DEFAULT: "#00D9FF", // Electric Cyan
                    hover: "#00B8D4",
                    glow: "rgba(0, 217, 255, 0.3)",
                    dark: "rgba(0, 217, 255, 0.15)",
                },
                accent: {
                    DEFAULT: "#A78BFA", // Soft Violet
                    hover: "#C4B5FD",
                    glow: "rgba(167, 139, 250, 0.3)",
                },
                gold: {
                    DEFAULT: "#D4AF37", // Luxury Gold
                    dark: "rgba(212, 175, 55, 0.2)",
                },
                background: {
                    DEFAULT: "#0A0E27", // Deep Navy
                    dark: "#050810",    // Near Black
                    card: "#1A1F3A",    // Deep Slate
                    glass: "rgba(26, 31, 58, 0.6)",
                },
                text: {
                    primary: "#F8FAFC",   // Nearly White
                    secondary: "#94A3B8", // Muted Light
                    tertiary: "#64748B",  // Softer Gray
                    inverted: "#0A0E27",  // Dark
                },
                border: {
                    DEFAULT: "rgba(148, 163, 184, 0.1)",
                    light: "rgba(148, 163, 184, 0.2)",
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                display: ["var(--font-inter)", "sans-serif"],
            },
            backdropBlur: {
                glass: "12px",
                heavy: "24px",
            },
            boxShadow: {
                glow: "0 0 30px rgba(0, 217, 255, 0.15)",
                "glow-lg": "0 0 60px rgba(0, 217, 255, 0.2)",
                "glow-accent": "0 0 30px rgba(167, 139, 250, 0.15)",
                glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
                "glass-lg": "0 20px 60px rgba(0, 0, 0, 0.4)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "glow-primary": "linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(0, 217, 255, 0) 100%)",
                "glow-accent": "linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(167, 139, 250, 0) 100%)",
            },
        },
    },
    plugins: [],
};
export default config;
