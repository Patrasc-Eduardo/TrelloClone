import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import ListColumn from "@/components/ListColumn";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FiEdit, FiSave, FiX } from "react-icons/fi";
import posthog from "posthog-js";  // Import PostHog for tracking

export default function BoardPage() {
  const router = useRouter();
  const { boardId } = router.query;

  const [board, setBoard] = useState(null);
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [tempBoardName, setTempBoardName] = useState("");
  const [newListName, setNewListName] = useState("");

  // Fetch the board data when boardId is available
  useEffect(() => {
    if (boardId) fetchBoard();
  }, [boardId]);

  // Function to fetch the board details
  async function fetchBoard() {
    try {
      const response = await fetch(`/api/boards/${boardId}`);
      const data = await response.json();
      if (data.success) {
        setBoard(data.data);
        setTempBoardName(data.data.name);  // Set the initial board name
      }
    } catch (error) {
      console.error("Error fetching board:", error);
    }
  }

  // Function to save the updated board name
  async function saveBoardName() {
    if (!tempBoardName.trim()) return alert("Board name cannot be empty!");
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tempBoardName }),
      });
      if (response.ok) {
        setIsEditingBoardName(false);
        fetchBoard();

        // Track board name change with PostHog
        posthog.capture("board_name_edited", {
          boardId,
          newBoardName: tempBoardName,
        });
      }
    } catch (error) {
      console.error("Error updating board name:", error);
    }
  }

  // Function to add a new list
  async function addList() {
    if (!newListName.trim()) return alert("List name cannot be empty!");
    try {
      const response = await fetch(`/api/boards/${boardId}/lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName }),
      });
      if (response.ok) {
        setNewListName("");
        fetchBoard();

        // Track list creation with PostHog
        posthog.capture("list_created", {
          listName: newListName,
          boardId,
        });
      }
    } catch (error) {
      console.error("Error adding list:", error);
    }
  }

  // Handle the drag-and-drop logic for lists and cards
  async function onDragEnd(result) {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "LIST") {
      const updatedLists = Array.from(board.lists);
      const [movedList] = updatedLists.splice(source.index, 1);
      updatedLists.splice(destination.index, 0, movedList);

      try {
        await fetch(`/api/boards/${boardId}/lists/reorder`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lists: updatedLists.map((list) => list._id) }),
        });
        fetchBoard();

        // Track list reorder with PostHog
        posthog.capture("list_reordered", {
          boardId,
          newOrder: updatedLists.map((list) => list._id),
        });
      } catch (error) {
        console.error("Error reordering lists:", error);
      }
    }

    if (type === "CARD") {
      const sourceList = board.lists.find((list) => list._id === source.droppableId);
      const destinationList = board.lists.find((list) => list._id === destination.droppableId);

      const sourceCards = Array.from(sourceList.cards);
      const destinationCards = Array.from(destinationList.cards);

      const [movedCard] = sourceCards.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        destinationCards.splice(destination.index, 0, movedCard);
      } else {
        destinationCards.splice(destination.index, 0, movedCard);
      }

      try {
        await fetch(`/api/lists/${destinationList._id}/cards/reorder`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceListId: sourceList._id,
            destinationListId: destinationList._id,
            cards: destinationCards.map((card) => card._id),
          }),
        });
        fetchBoard();

        // Track card reorder with PostHog
        posthog.capture("card_reordered", {
          boardId,
          sourceListId: sourceList._id,
          destinationListId: destinationList._id,
        });
      } catch (error) {
        console.error("Error reordering cards:", error);
      }
    }
  }

  // If the board is still loading, show a loading indicator
  if (!board) return <div>Loading...</div>;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
      <Navbar />
      <div className="p-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          {isEditingBoardName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempBoardName}
                onChange={(e) => setTempBoardName(e.target.value)}
                className="p-2 border rounded"
              />
              <button onClick={saveBoardName} className="bg-green-500 text-white px-4 py-2 rounded">
                <FiSave />
              </button>
              <button
                onClick={() => setIsEditingBoardName(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-white">{board.name}</h1>
              <FiEdit
                onClick={() => setIsEditingBoardName(true)}
                className="text-white cursor-pointer"
              />
            </div>
          )}
        </div>
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Enter list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="p-2 rounded-lg border w-1/3"
          />
          <button
            onClick={addList}
            className="bg-white text-blue-500 px-4 py-2 rounded-full shadow-md hover:opacity-90"
          >
            Add List
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="LIST">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex gap-4">
                {board.lists.map((list, index) => (
                  <ListColumn
                    key={list._id}
                    list={list}
                    boardId={boardId}
                    index={index}
                    refreshBoard={fetchBoard}
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
