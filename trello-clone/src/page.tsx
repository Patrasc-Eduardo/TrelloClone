"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [boards, setBoards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchBoards() {
      try {
        const res = await fetch("/api/boards");
        const data = await res.json();
        setBoards(data.data);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      }
    }
    fetchBoards();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Boards</h1>
      <div className="grid grid-cols-3 gap-4">
        {boards.map((board) => (
          <div
            key={board._id}
            className="p-4 bg-white shadow rounded hover:bg-gray-200 cursor-pointer"
            onClick={() => router.push(`/boards/${board._id}`)}
          >
            <h2 className="text-xl font-semibold">{board.name}</h2>
          </div>
        ))}
        <div
          className="p-4 bg-gray-100 shadow rounded hover:bg-gray-200 cursor-pointer"
          onClick={() => alert("Feature to create a new board!")}
        >
          <h2 className="text-xl font-semibold text-center">+ Add Board</h2>
        </div>
      </div>
    </div>
  );
}
