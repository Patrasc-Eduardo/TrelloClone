import dbConnect from "@/utils/db";
import Board from "@/models/Board";
import List from "@/models/List"; // Import the List model
import Card from "@/models/Card"; // Import the Card model (if required)

export default async function handler(req, res) {
    const { boardId } = req.query;
    await dbConnect();

    switch (req.method) {
        case "GET":
            try {
                const board = await Board.findById(boardId).populate({
                    path: "lists",
                    populate: { path: "cards" }, // Populate lists and their cards
                });
                if (!board) {
                    return res.status(404).json({ success: false, message: "Board not found" });
                }
                res.status(200).json({ success: true, data: board });
            } catch (error) {
                console.error("Error fetching board:", error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
