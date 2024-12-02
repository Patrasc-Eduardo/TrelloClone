import { useState } from "react";

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState("bg-gradient-bg");

    const switchTheme = () => {
        const themes = ["bg-gradient-bg", "bg-gray-800", "bg-indigo-600"];
        setTheme(themes[Math.floor(Math.random() * themes.length)]);
        document.body.className = theme;
    };

    return (
        <button
            onClick={switchTheme}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
            Change Theme
        </button>
    );
}
