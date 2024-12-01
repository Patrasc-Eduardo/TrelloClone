import dbConnect from "@/utils/db";
import List from "@/models/List";

export default async function handler(req, res) {
    const { boardId } = req.query;
    await dbConnect();

    switch (req.method) {
        case "POST":
            try {
                const list = await List.create({ ...req.body, boardId });
                res.status(201).json({ success: true, data: list });
            } catch (error) {
                res.status(400).json({ success: false, message: "Error creating list" });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
