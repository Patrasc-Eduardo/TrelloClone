import dbConnect from "@/utils/db";
import Board from "@/models/Board";
import List from "@/models/List";

export default async function handler(req, res) {
    const { boardId } = req.query;

    await dbConnect();

    switch (req.method) {
        case "POST": // Add a new list to the board
            try {
                const { name } = req.body;
                if (!name) {
                    return res.status(400).json({ success: false, message: "List name is required" });
                }
                const newList = await List.create({ name, boardId, cards: [] });
                await Board.findByIdAndUpdate(boardId, { $push: { lists: newList._id } });
                res.status(201).json({ success: true, data: newList });
            } catch (error) {
                console.error("Error adding list:", error);
                res.status(500).json({ success: false, message: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
