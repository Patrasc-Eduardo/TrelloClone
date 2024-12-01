import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BoardPage() {
    const router = useRouter();
    const { boardId } = router.query; // Extract `boardId` from the URL
    const [board, setBoard] = useState(null); // Store board data
    const [listName, setListName] = useState(""); // New list input
    const [cardTitle, setCardTitle] = useState(""); // New card input
    const [currentListId, setCurrentListId] = useState(null); // Active list for adding a card

    useEffect(() => {
        if (!boardId) return;

        // Fetch board data from the API
        async function fetchBoard() {
            try {
                const response = await fetch(`/api/boards/${boardId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBoard(data.data);
                } else {
                    console.error("Error fetching board:", response.statusText);
                }
            } catch (err) {
                console.error("Network error:", err);
            }
        }

        fetchBoard();
    }, [boardId]);

    // Add a new list
    async function addList() {
        if (!listName) return alert("List name cannot be empty!");
        try {
            const response = await fetch(`/api/boards/${boardId}/lists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: listName }),
            });
            const newList = await response.json();
            setBoard((prev) => ({
                ...prev,
                lists: [...prev.lists, newList.data],
            }));
            setListName("");
        } catch (err) {
            console.error("Error adding list:", err);
        }
    }

    // Add a new card to a specific list
    async function addCard(listId) {
        if (!cardTitle) return alert("Card title cannot be empty!");
        try {
            const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: cardTitle }),
            });
            const newCard = await response.json();
            setBoard((prev) => {
                const updatedLists = prev.lists.map((list) =>
                    list._id === listId ? { ...list, cards: [...list.cards, newCard.data] } : list
                );
                return { ...prev, lists: updatedLists };
            });
            setCardTitle("");
            setCurrentListId(null);
        } catch (err) {
            console.error("Error adding card:", err);
        }
    }

    if (!board) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 p-8 text-white">
            <h1 className="text-4xl font-bold mb-8">{board.name}</h1>

            {/* Add List Section */}
            <div className="flex mb-6">
                <input
                    type="text"
                    placeholder="Enter list name"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    className="p-2 rounded-lg text-black w-1/3"
                />
                <button
                    onClick={addList}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 ml-4 rounded-lg"
                >
                    Add List
                </button>
            </div>

            {/* Render Lists */}
            <div className="flex space-x-4 overflow-x-auto">
                {board.lists.map((list) => (
                    <div key={list._id} className="bg-gray-800 p-4 rounded-lg shadow-lg w-72">
                        <h2 className="text-xl font-semibold mb-4">{list.name}</h2>
                        {/* Render Cards */}
                        <div>
                            {list.cards.map((card) => (
                                <div key={card._id} className="bg-gray-700 p-2 rounded-lg mb-2 shadow">
                                    {card.title}
                                </div>
                            ))}
                        </div>
                        {/* Add Card Section */}
                        {currentListId === list._id ? (
                            <div className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Enter card title"
                                    value={cardTitle}
                                    onChange={(e) => setCardTitle(e.target.value)}
                                    className="p-2 rounded-lg text-black w-full"
                                />
                                <button
                                    onClick={() => addCard(list._id)}
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 mt-2 rounded-lg"
                                >
                                    Add Card
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setCurrentListId(list._id)}
                                className="text-blue-300 mt-4"
                            >
                                + Add Card
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
