import { useState } from "react";

export default function CardModal({ card, onClose }) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || "");
    const [image, setImage] = useState(card.image || null);

    async function updateCard() {
        const response = await fetch(`/api/cards/${card._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, image }),
        });
        if (response.ok) {
            onClose();
        }
    }

    async function deleteCard() {
        const response = await fetch(`/api/cards/${card._id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Edit Card</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border rounded-lg px-4 py-2 w-full mb-4"
                    placeholder="Card title"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded-lg px-4 py-2 w-full mb-4"
                    placeholder="Card description"
                ></textarea>
                <div className="mb-4">
                    <label className="block mb-2">Upload Image:</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="border rounded-lg px-4 py-2 w-full"
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={updateCard}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Save
                    </button>
                    <button
                        onClick={deleteCard}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Delete
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 block mx-auto text-blue-600 hover:underline"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
