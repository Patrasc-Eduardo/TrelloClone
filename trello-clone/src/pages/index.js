import { useEffect, useState } from "react";

export default function Home() {
    const [boards, setBoards] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchBoards() {
            try {
                const response = await fetch("/api/boards");

                // Check if the response is valid JSON
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // Parse JSON
                setBoards(data.data || []); // Safely set boards
            } catch (err) {
                console.error("Error fetching boards:", err);
                setError(err.message); // Set error state
            }
        }
        fetchBoards();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Trello Clone - Boards</h1>
            <div className="grid grid-cols-3 gap-4">
                {boards.map((board) => (
                    <div key={board._id} className="p-4 bg-gray-100 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">{board.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
