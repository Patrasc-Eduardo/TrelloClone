import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
    const [boards, setBoards] = useState([]);
    const [boardName, setBoardName] = useState("");

    useEffect(() => {
        async function fetchBoards() {
            const response = await fetch("/api/boards");
            const data = await response.json();
            setBoards(data.data || []);
        }
        fetchBoards();
    }, []);

    async function addBoard() {
        if (!boardName) return alert("Board name cannot be empty!");
        const response = await fetch("/api/boards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: boardName }),
        });
        const newBoard = await response.json();
        setBoards((prev) => [...prev, newBoard.data]);
        setBoardName("");
    }

    return (
        <div>
            <Navbar />
            <div className="p-8 mt-16">
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Enter board name"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        className="p-2 rounded-lg border w-1/3 mr-4"
                    />
                    <button
                        onClick={addBoard}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Add Board
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {boards.map((board) => (
                        <Link
                            href={`/boards/${board._id}`}
                            key={board._id}
                            className="block bg-white shadow-lg rounded-lg p-4 hover:bg-gray-100"
                        >
                            <h2 className="text-xl font-bold">{board.name}</h2>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
