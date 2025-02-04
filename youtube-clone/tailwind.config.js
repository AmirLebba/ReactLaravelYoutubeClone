/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                gray: {
                    50: "#FAFAFA",
                    100: "#F4F4F5",
                    200: "#E4E4E7",
                    300: "#D4D4D8",
                    400: "#A1A1AA",
                    500: "#71717A",
                    600: "#52525B",
                    700: "#3F3F46",
                    800: "#27272A",
                   
                },
                primary: {
                    500: "#8B5CF6",
                },
            },
        },
    },
    plugins: [],
};
