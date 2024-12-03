import dbConnect from "@/utils/db";  // Assuming dbConnect is your MongoDB connection utility
import Board from "@/models/Board";  // Assuming Board is your Mongoose model
import List from "@/models/List";  // Assuming List is your Mongoose model for lists
import Card from "@/models/Card";  // Assuming Card is your Mongoose model for cards

dbConnect();  // Ensure DB is connected

export default async function handler(req, res) {
    const {
        method,
        query: { boardId },
    } = req;

    if (method === "GET") {
        // Fetch the board and populate the lists and cards
        try {
            const board = await Board.findById(boardId).populate({
                path: "lists",
                populate: {
                    path: "cards",  // Populate cards within the list
                },
            });

            if (!board) {
                return res.status(404).json({ success: false, message: "Board not found" });
            }

            return res.status(200).json({ success: true, data: board });
        } catch (error) {
            console.error("Error fetching board:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    if (method === "PUT") {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Board name cannot be empty!" });
        }

        try {
            // Update the board name
            const board = await Board.findByIdAndUpdate(boardId, { name }, { new: true });

            if (!board) {
                return res.status(404).json({ success: false, message: "Board not found" });
            }

            return res.status(200).json({ success: true, data: board });
        } catch (error) {
            console.error("Error updating board name:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    if (method === "DELETE") {
        try {
            // Delete the board
            const board = await Board.findByIdAndDelete(boardId);

            if (!board) {
                return res.status(404).json({ success: false, message: "Board not found" });
            }

            // Optionally, you can also delete the lists and cards associated with the board.
            await List.deleteMany({ board: boardId });
            await Card.deleteMany({ board: boardId });

            return res.status(200).json({ success: true, message: "Board and associated lists/cards deleted" });
        } catch (error) {
            console.error("Error deleting board:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    if (method === "POST") {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "List name cannot be empty!" });
        }

        try {
            const board = await Board.findById(boardId);
            if (!board) {
                return res.status(404).json({ success: false, message: "Board not found" });
            }

            // Create a new list and add it to the board's lists
            const list = new List({
                name,
                board: boardId,
            });

            await list.save();

            // Add the list to the board's lists array
            board.lists.push(list);
            await board.save();

            return res.status(201).json({ success: true, data: list });
        } catch (error) {
            console.error("Error creating list:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    if (method === "PUT" && req.body.lists) {
        // Reorder lists inside the board
        try {
            const board = await Board.findById(boardId);
            if (!board) {
                return res.status(404).json({ success: false, message: "Board not found" });
            }

            // Reorder the lists based on the new list order
            const { lists } = req.body;
            board.lists = lists;  // Update the lists order
            await board.save();

            return res.status(200).json({ success: true, data: board });
        } catch (error) {
            console.error("Error reordering lists:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
