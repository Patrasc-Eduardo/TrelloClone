import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
    const [boards, setBoards] = useState([]);
    const [theme, setTheme] = useState("bg-gradient-to-r from-blue-500 to-pink-500");
    const [newBoardName, setNewBoardName] = useState("");

    useEffect(() => {
        async function fetchBoards() {
            const response = await fetch("/api/boards");
            const data = await response.json();
            if (data.success) {
                setBoards(data.data);
            }
        }
        fetchBoards();
    }, []);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    async function addBoard() {
        if (!newBoardName.trim()) return alert("Board name cannot be empty!");
        try {
            const response = await fetch("/api/boards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newBoardName }),
            });
            if (response.ok) {
                const data = await response.json();
                setBoards([...boards, data.data]);
                setNewBoardName("");
            }
        } catch (error) {
            console.error("Error adding board:", error);
        }
    }

    return (
        <div className={`${theme} min-h-screen`}>
            <Navbar onThemeChange={handleThemeChange} />
            <div className="p-8 mt-16">
                <h1 className="text-4xl font-bold text-white mb-8">Your Boards</h1>
                <div className="mb-6 flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter new board name"
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        className="p-2 rounded-lg border w-1/3"
                    />
                    <button
                        onClick={addBoard}
                        className="bg-white text-blue-500 px-4 py-2 rounded-full shadow-md hover:opacity-90"
                    >
                        Add Board
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {boards.map((board) => (
                        <Link href={`/boards/${board._id}`} key={board._id}>
                            <div className="block bg-white shadow-lg rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
                                <h2 className="text-xl font-bold">{board.name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
