import dbConnect from "@/utils/db";
import Card from "@/models/Card";
import List from "@/models/List";

export default async function handler(req, res) {
    const { listId } = req.query;

    await dbConnect();

    switch (req.method) {
        case "POST": // Add a new card to the list
            try {
                const { title, description = "" } = req.body;
                if (!title) {
                    return res.status(400).json({ success: false, message: "Card title is required" });
                }
                const newCard = await Card.create({ title, description, listId });
                await List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });
                res.status(201).json({ success: true, data: newCard });
            } catch (error) {
                console.error("Error adding card:", error);
                res.status(500).json({ success: false, message: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
