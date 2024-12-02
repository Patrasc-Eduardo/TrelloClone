import dbConnect from "@/utils/db";
import Board from "@/models/Board";

export default async function handler(req, res) {
    await dbConnect();

    const { boardId } = req.query;

    switch (req.method) {
        case "GET":
            try {
                const board = await Board.findById(boardId).populate("lists");
                if (!board) return res.status(404).json({ success: false, message: "Board not found" });
                res.status(200).json({ success: true, data: board });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const { name } = req.body;
                const updatedBoard = await Board.findByIdAndUpdate(boardId, { name }, { new: true });
                res.status(200).json({ success: true, data: updatedBoard });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid request method" });
            break;
    }
}
