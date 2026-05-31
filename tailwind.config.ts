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
        coffee: {
          espresso: '#1A0F0A',      // deep espresso black-brown
          primary: '#2D1810',       // rich coffee brown
          secondary: '#3D2820',     // card backgrounds
          border: '#5A4034',        // subtle borders
          textPrimary: '#F5E6D3',   // cream/latte text
          textSecondary: '#C9B8A0', // muted brown
          accent: '#4F9C8F',        // teal CTA
          gold: '#FFD700',          // star ratings
        }
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 5px rgba(79, 156, 143, 0.3))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(79, 156, 143, 0.7))' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
