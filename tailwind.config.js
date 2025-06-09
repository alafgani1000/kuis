import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                lexend: ["Lexend"],
                pacifico: ["Pacifico"],
            },
        },
        screens: {
            sm: "576px",
            md: "760px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        backgroundImage: {
            landing: "url('/images/bg1.jpg')",
        },
    },

    plugins: [forms],
};
