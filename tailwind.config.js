/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                coffee: {
                    dark: "#2D1B14", // Background/Text - Deep Espresso
                    light: "#F5F5DC", // Beige - Cream/Foam
                    accent: "#C37D46", // Orange/Brown - Caramel/Brand Color
                    card: "#FFFFFF", // White - Card Backgrounds
                    secondary: "#E6DCCA", // Light Mocha
                },
            },
            fontFamily: {
                serif: ['"Crimson Pro"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
