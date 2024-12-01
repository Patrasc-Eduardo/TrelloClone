import dbConnect from "@/utils/db";
import List from "@/models/List";

export default async function handler(req, res) {
    const { method, query } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            const lists = await List.find({ boardId: query.boardId });
            res.status(200).json({ success: true, data: lists });
            break;

        case "POST":
            const list = await List.create({ ...req.body, boardId: query.boardId });
            res.status(201).json({ success: true, data: list });
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
