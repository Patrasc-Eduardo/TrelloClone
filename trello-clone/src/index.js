import { useState, useEffect } from "react";
import BoardCard from "@/components/BoardCard";

export default function Home() {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        async function fetchBoards() {
            const res = await fetch("/api/boards");
            const data = await res.json();
            setBoards(data.data);
        }
        fetchBoards();
    }, []);

    return (
        <div className="p-4 grid grid-cols-3 gap-4">
            {boards.map((board) => (
                <BoardCard key={board._id} name={board.name} />
            ))}
        </div>
    );
}
