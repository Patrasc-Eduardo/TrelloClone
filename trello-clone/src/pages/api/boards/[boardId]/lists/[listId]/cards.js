import dbConnect from "@/utils/db";
import List from "@/models/List";
import Card from "@/models/Card";

export default async function handler(req, res) {
    await dbConnect();

    const { listId } = req.query;

    switch (req.method) {
        case "POST":
            try {
                const { title } = req.body;
                const newCard = await Card.create({ title, listId });
                await List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });
                res.status(201).json({ success: true, data: newCard });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid request method" });
            break;
    }
}
