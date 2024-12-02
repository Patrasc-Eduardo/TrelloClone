import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

export default function ListColumn({ list, boardId, index }) {
    const [cardTitle, setCardTitle] = useState("");

    async function addCard() {
        if (!cardTitle) return alert("Card title cannot be empty!");
        try {
            const response = await fetch(`/api/boards/${boardId}/lists/${list._id}/cards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: cardTitle }),
            });
            const data = await response.json();
            if (data.success) {
                list.cards.push(data.data); // Add the new card to the list
                setCardTitle(""); // Clear input field
            }
        } catch (error) {
            console.error("Error adding card:", error);
        }
    }

    return (
        <Draggable draggableId={list._id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="bg-gray-200 p-4 rounded-lg w-72 shadow-lg"
                >
                    <h2 className="text-xl font-bold mb-4">{list.name}</h2>
                    <Droppable droppableId={list._id} type="card">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-2"
                            >
                                {list.cards.map((card, index) => (
                                    <Draggable key={card._id} draggableId={card._id} index={index}>
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                className="bg-white p-2 rounded-lg shadow cursor-pointer"
                                            >
                                                {card.title}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Enter card title"
                            value={cardTitle}
                            onChange={(e) => setCardTitle(e.target.value)}
                            className="border rounded-lg px-2 py-1 w-full mb-2"
                        />
                        <button
                            onClick={addCard}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Add Card
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
