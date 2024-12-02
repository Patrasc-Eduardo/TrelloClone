import dbConnect from "@/utils/db";
import List from "@/models/List";

export default async function handler(req, res) {
    await dbConnect();

    const { listId } = req.query;
    const { title } = req.body;

    if (req.method === "POST") {
        try {
            // Add a new card to the list
            const newCard = {
                title: title,
                description: "", // Default empty description
            };

            // Find the list and add the card to the list's cards array
            const list = await List.findById(listId);
            if (!list) {
                return res.status(404).json({ success: false, message: "List not found" });
            }

            list.cards.push(newCard);
            await list.save();

            res.status(201).json({ success: true, data: list });
        } catch (error) {
            console.error("Error adding card:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
