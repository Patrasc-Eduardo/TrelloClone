import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
    const [boards, setBoards] = useState([]);
    const [boardName, setBoardName] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function fetchBoards() {
            const response = await fetch("/api/boards");
            const data = await response.json();
            setBoards(data.data || []);
        }
        fetchBoards();
    }, []);

    async function createBoard() {
        if (!boardName) return alert("Enter a board name!");
        const response = await fetch("/api/boards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: boardName }),
        });
        const newBoard = await response.json();
        setBoards([...boards, newBoard.data]);
        setBoardName("");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Trello Clone</h1>
            <div className="flex items-center space-x-4 mb-8">
                <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Enter Board Name"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/3"
                />
                <button
                    onClick={createBoard}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Add Board
                </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {boards.map((board) => (
                    <div
                        key={board._id}
                        onClick={() => router.push(`/boards/${board._id}`)}
                        className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg"
                    >
                        <h2 className="text-lg font-semibold">{board.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
