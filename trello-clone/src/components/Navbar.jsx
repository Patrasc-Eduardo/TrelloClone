import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar({ onThemeChange }) {
    return (
        <nav className="bg-white shadow-lg px-8 py-4 fixed top-0 left-0 w-full z-50 flex justify-between items-center">
            <Link href="/" legacyBehavior>
                <a className="text-2xl font-bold text-blue-600 hover:text-blue-800">Trello Clone</a>
            </Link>
            <ThemeSwitcher onThemeChange={onThemeChange} />
        </nav>
    );
}
