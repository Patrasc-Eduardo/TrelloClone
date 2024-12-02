import dbConnect from "@/utils/db";
import Board from "@/models/Board";
import List from "@/models/List";

export default async function handler(req, res) {
    await dbConnect();

    const { boardId } = req.query;

    switch (req.method) {
        case "POST": // Add a new list to a board
            try {
                const { name } = req.body;
                if (!name.trim()) {
                    return res.status(400).json({ success: false, message: "List name cannot be empty." });
                }
                const newList = await List.create({ name, boardId });
                await Board.findByIdAndUpdate(boardId, { $push: { lists: newList._id } });
                res.status(201).json({ success: true, data: newList });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid request method." });
            break;
    }
}
