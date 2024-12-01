import dbConnect from "@/utils/db";
import Board from "@/models/Board";

export default async function handler(req, res) {
    const { boardId } = req.query; // Extract `boardId` from the dynamic route

    await dbConnect();

    switch (req.method) {
        case "GET": {
            try {
                const board = await Board.findById(boardId).populate("lists"); // Fetch the board by ID
                if (!board) {
                    return res.status(404).json({ success: false, message: "Board not found" });
                }
                return res.status(200).json({ success: true, data: board });
            } catch (error) {
                console.error("Error fetching board:", error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        }

        case "PUT": {
            try {
                const updatedBoard = await Board.findByIdAndUpdate(boardId, req.body, {
                    new: true, // Return the updated document
                    runValidators: true, // Run schema validators
                });
                if (!updatedBoard) {
                    return res.status(404).json({ success: false, message: "Board not found" });
                }
                return res.status(200).json({ success: true, data: updatedBoard });
            } catch (error) {
                console.error("Error updating board:", error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        }

        case "DELETE": {
            try {
                const deletedBoard = await Board.findByIdAndDelete(boardId);
                if (!deletedBoard) {
                    return res.status(404).json({ success: false, message: "Board not found" });
                }
                return res.status(200).json({ success: true, message: "Board deleted successfully" });
            } catch (error) {
                console.error("Error deleting board:", error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        }

        default:
            return res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
