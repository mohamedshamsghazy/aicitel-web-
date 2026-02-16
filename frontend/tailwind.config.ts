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
                primary: {
                    DEFAULT: "#2563EB", // Electric Blue
                    hover: "#1D4ED8",
                    glow: "rgba(37, 99, 235, 0.5)",
                },
                secondary: {
                    DEFAULT: "#64748B", // Soft Neutral Gray
                    dark: "#475569",    // Slate 600
                    light: "#94A3B8",   // Slate 400
                },
                background: {
                    DEFAULT: "#F8FAFC", // Slate 50
                    dark: "#0F172A",    // Slate 900
                },
                text: {
                    primary: "#0F172A",   // Slate 900
                    secondary: "#64748B", // Slate 500
                    inverted: "#F8FAFC",  // Slate 50
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
