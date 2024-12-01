import dbConnect from "@/utils/db";
import Board from "@/models/Board";

export default async function handler(req, res) {
    try {
        await dbConnect();

        if (req.method === "GET") {
            const boards = await Board.find(); // Fetch all boards
            return res.status(200).json({ success: true, data: boards });
        }

        if (req.method === "POST") {
            const board = await Board.create(req.body); // Create a new board
            return res.status(201).json({ success: true, data: board });
        }

        res.status(405).json({ success: false, message: "Method not allowed" });
    } catch (error) {
        console.error("Error in /api/boards:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
