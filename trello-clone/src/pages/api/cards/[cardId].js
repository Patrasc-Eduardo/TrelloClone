import dbConnect from "@/utils/db";
import Card from "@/models/Card";

export default async function handler(req, res) {
    await dbConnect();

    const { cardId } = req.query;

    switch (req.method) {
        case "PUT": // Update card details
            try {
                const { title, description } = req.body;
                const updatedCard = await Card.findByIdAndUpdate(
                    cardId,
                    { title, description },
                    { new: true }
                );
                if (!updatedCard) return res.status(404).json({ success: false, message: "Card not found." });
                res.status(200).json({ success: true, data: updatedCard });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        case "DELETE": // Delete a card
            try {
                await Card.findByIdAndDelete(cardId);
                res.status(200).json({ success: true, message: "Card deleted successfully." });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid request method." });
            break;
    }
}
