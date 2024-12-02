import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

export default function CardModal({ card, listId, index, refreshBoard }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempCardTitle, setTempCardTitle] = useState(card.title);
    const [tempCardDescription, setTempCardDescription] = useState(card.description || "");

    async function saveCardDetails() {
        try {
            const response = await fetch(`/api/cards/${card._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: tempCardTitle, description: tempCardDescription }),
            });
            if (response.ok) {
                setIsModalOpen(false);
                refreshBoard();
            }
        } catch (error) {
            console.error("Error updating card:", error);
        }
    }

    async function deleteCard() {
        try {
            const response = await fetch(`/api/cards/${card._id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                refreshBoard();
            }
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    }

    return (
        <Draggable draggableId={card._id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-2 rounded shadow mb-2"
                >
                    <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
                        {card.title}
                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
                                <h2 className="text-xl font-bold mb-4">Edit Card</h2>
                                <input
                                    type="text"
                                    value={tempCardTitle}
                                    onChange={(e) => setTempCardTitle(e.target.value)}
                                    className="w-full p-2 border rounded mb-4"
                                />
                                <textarea
                                    value={tempCardDescription}
                                    onChange={(e) => setTempCardDescription(e.target.value)}
                                    className="w-full p-2 border rounded mb-4"
                                    rows="4"
                                    placeholder="Add a description"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={saveCardDetails}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteCard}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
}
