import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FiEdit, FiSave, FiX } from "react-icons/fi";
import CardModal from "./CardModal";

export default function ListColumn({ list, boardId, index, refreshBoard }) {
    const [newCardTitle, setNewCardTitle] = useState("");
    const [isEditingListName, setIsEditingListName] = useState(false);
    const [tempListName, setTempListName] = useState(list.name);

    async function addCard() {
        if (!newCardTitle.trim()) return alert("Card title cannot be empty!");
        try {
            const response = await fetch(`/api/lists/${list._id}/cards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newCardTitle }),
            });
            if (response.ok) {
                setNewCardTitle("");
                refreshBoard(); // Refresh board after adding a new card
            } else {
                const error = await response.json();
                console.error("Error adding card:", error);
            }
        } catch (error) {
            console.error("Error adding card:", error);
        }
    }

    async function saveListName() {
        if (!tempListName.trim()) return alert("List name cannot be empty!");
        try {
            const response = await fetch(`/api/lists/${list._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: tempListName }),
            });
            if (response.ok) {
                setIsEditingListName(false);
                refreshBoard();
            }
        } catch (error) {
            console.error("Error updating list name:", error);
        }
    }

    async function deleteList() {
        const confirmDelete = confirm("Are you sure you want to delete this list?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/lists/${list._id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                refreshBoard();
            }
        } catch (error) {
            console.error("Error deleting list:", error);
        }
    }

    return (
        <Draggable draggableId={list._id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="bg-white rounded-lg shadow-md p-4 w-72"
                >
                    <div className="flex items-center justify-between" {...provided.dragHandleProps}>
                        {isEditingListName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={tempListName}
                                    onChange={(e) => setTempListName(e.target.value)}
                                    className="p-2 border rounded w-full"
                                />
                                <button
                                    onClick={saveListName}
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    <FiSave />
                                </button>
                                <button
                                    onClick={() => setIsEditingListName(false)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    <FiX />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold">{list.name}</h2>
                                <div className="flex items-center gap-2">
                                    <FiEdit
                                        onClick={() => setIsEditingListName(true)}
                                        className="text-gray-500 cursor-pointer"
                                    />
                                    <FiX
                                        onClick={deleteList}
                                        className="text-red-500 cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <Droppable droppableId={list._id} type="CARD">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="mt-4">
                                {list.cards.length === 0 && <p className="text-gray-500">No cards</p>}
                                {list.cards.map((card, index) => (
                                    <CardModal
                                        key={card._id}
                                        card={card}
                                        listId={list._id}
                                        index={index}
                                        refreshBoard={refreshBoard}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Add card"
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            className="p-2 border rounded w-full"
                        />
                        <button
                            onClick={addCard}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full mt-2 w-full"
                        >
                            Add Card
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
