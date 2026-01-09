/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                coffee: {
                    100: "#FDFBF7", // Background
                    200: "#F5F5DC", // Beige
                    800: "#2D1B14", // Espresso
                },
            },
            fontFamily: {
                serif: ['var(--font-serif)', 'serif'],
                sans: ['var(--font-sans)', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
