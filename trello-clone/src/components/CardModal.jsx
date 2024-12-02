'use client'

import { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FiX } from "react-icons/fi";

export default function CardModal({ card, listId, index, refreshBoard }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log("RERENDER. isModalOpen", isModalOpen);

    const [tempCardTitle, setTempCardTitle] = useState(card.title || "Untitled Card");
    const [tempCardDescription, setTempCardDescription] = useState(card.description || "");

    // Store the original values to revert on cancel
    const originalTitle = card.title || "Untitled Card";
    const originalDescription = card.description || "";

    const cardId = card?._id;
    if (!cardId) {
        console.error("Card ID is missing:", card);
        return null;
    }

    // Handle saving the card
    async function saveCardDetails() {
        if (!tempCardTitle.trim()) return alert("Card title cannot be empty!");

        try {
            const response = await fetch(`/api/cards/${cardId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: tempCardTitle, description: tempCardDescription }),
            });

            if (response.ok) {
                setIsModalOpen(false);  // Close modal after saving
                refreshBoard();  // Refresh board after saving
            } else {
                const error = await response.json();
                console.error("Error saving card:", error);
            }
        } catch (error) {
            console.error("Error saving card:", error);
        }
    }

    // Cancel changes and close modal
    function cancelChanges() {
        console.log("Cancelling Changes");
        setTempCardTitle(originalTitle);
        setTempCardDescription(originalDescription);
        setIsModalOpen(false);  // Close modal after canceling
    }

    // Delete card
    async function deleteCard() {
        const confirmDelete = confirm("Are you sure you want to delete this card?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/cards/${cardId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setIsModalOpen(false);  // Close modal after deletion
                refreshBoard();  // Refresh board after deletion
            } else {
                const error = await response.json();
                console.error("Error deleting card:", error);
            }
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    }

    // Modal Close handler: Makes sure the modal is closed when called
    function handleModalClose() {
        console.log("Closing Modal. isOpenModal", isModalOpen);
        setIsModalOpen(false); // Ensures the modal closes when either "X" or "Cancel" is clicked
    }

    useEffect(() => {
        console.log("Modal state changed:", isModalOpen);
    }, [isModalOpen]);

    return (
        <>
            <Draggable draggableId={cardId} index={index}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="bg-gray-100 p-2 rounded shadow mb-2 cursor-pointer"
                        onClick={() => setIsModalOpen(true)}  // Open modal when clicked
                    >
                        {card.title || "Untitled Card"}

                        {/* Modal Rendering */}
                    </div>
                )}
            </Draggable>
        {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Edit Card</h2>
                                    <FiX
                                        className="cursor-pointer text-red-500"
                                        onClick={handleModalClose}  // Close modal when clicking X
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        value={tempCardTitle}
                                        onChange={(e) => setTempCardTitle(e.target.value)}
                                        className="p-2 border rounded w-full"
                                        placeholder="Card Title"
                                    />
                                    <textarea
                                        value={tempCardDescription}
                                        onChange={(e) => setTempCardDescription(e.target.value)}
                                        className="p-2 border rounded w-full"
                                        placeholder="Card Description"
                                        rows="4"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={saveCardDetails}  // Save changes
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={cancelChanges}  // Cancel changes
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteCard}  // Delete card
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
        </>
        
    );
}
