import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import ListColumn from "@/components/ListColumn";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function BoardPage() {
    const router = useRouter();
    const { boardId } = router.query;
    const [board, setBoard] = useState(null);
    const [listName, setListName] = useState("");

    useEffect(() => {
        if (!boardId) return;
        async function fetchBoard() {
            const response = await fetch(`/api/boards/${boardId}`);
            const data = await response.json();
            setBoard(data.data);
        }
        fetchBoard();
    }, [boardId]);

    async function addList() {
        if (!listName) return alert("List name cannot be empty!");
        try {
            const response = await fetch(`/api/boards/${boardId}/lists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: listName }),
            });
            const data = await response.json();
            if (data.success) {
                setBoard((prev) => ({
                    ...prev,
                    lists: [...prev.lists, data.data],
                }));
                setListName(""); // Clear input field
            }
        } catch (error) {
            console.error("Error adding list:", error);
        }
    }

    function handleDragEnd(result) {
        // Implement drag-and-drop logic here
        console.log(result);
    }

    if (!board) return <div>Loading...</div>;

    return (
        <div>
            <Navbar />
            <div className="p-8 mt-16">
                <h1 className="text-3xl font-bold mb-6">{board.name}</h1>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Enter list name"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="p-2 rounded-lg border w-1/3 mr-4"
                    />
                    <button
                        onClick={addList}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Add List
                    </button>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="board-lists" type="list" direction="horizontal">
                        {(provided) => (
                            <div
                                className="flex space-x-4 overflow-x-auto"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {board.lists.map((list, index) => (
                                    <ListColumn
                                        key={list._id}
                                        list={list}
                                        boardId={boardId}
                                        index={index}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}
