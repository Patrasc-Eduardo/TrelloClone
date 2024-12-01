import dbConnect from "@/utils/db";
import Card from "@/models/Card";

export default async function handler(req, res) {
    const { listId } = req.query;
    await dbConnect();

    switch (req.method) {
        case "POST":
            try {
                const card = await Card.create({ ...req.body, listId });
                res.status(201).json({ success: true, data: card });
            } catch (error) {
                res.status(400).json({ success: false, message: "Error creating card" });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
