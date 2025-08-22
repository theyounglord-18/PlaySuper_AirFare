/** @type {import('tailwindcss').Config} */
module.exports = {
  // This content array is essential. It tells Tailwind where to look for class names.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // The new animation slides elements up as they fade in, creating a more dynamic effect.
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
