import dbConnect from "@/utils/db";
import Card from "@/models/Card";

export default async function handler(req, res) {
    const { method, query } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            const cards = await Card.find({ listId: query.listId });
            res.status(200).json({ success: true, data: cards });
            break;

        case "POST":
            const card = await Card.create({ ...req.body, listId: query.listId });
            res.status(201).json({ success: true, data: card });
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
