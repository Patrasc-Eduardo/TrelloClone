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
        <div className="p-6">
            <h1 className="text-2xl font-bold">Trello Clone - Boards</h1>
            <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Board Name"
                className="border p-2 mr-2"
            />
            <button onClick={createBoard} className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Board
            </button>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {boards.map((board) => (
                    <div
                        key={board._id}
                        onClick={() => router.push(`/boards/${board._id}`)}
                        className="p-4 bg-gray-100 rounded shadow cursor-pointer"
                    >
                        {board.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
