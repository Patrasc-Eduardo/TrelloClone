import { useState } from "react";

const themes = [
    "bg-gradient-to-r from-blue-500 to-purple-500",
    "bg-gradient-to-r from-green-400 to-blue-500",
    "bg-gradient-to-r from-pink-500 to-yellow-500",
    "bg-gradient-to-r from-gray-800 to-gray-500",
];

export default function ThemeSwitcher({ onThemeChange }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600"
            >
                Change Theme
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                    {themes.map((theme, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onThemeChange(theme);
                                setIsDropdownOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 hover:bg-gray-100`}
                        >
                            Theme {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
