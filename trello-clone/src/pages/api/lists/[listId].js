import dbConnect from "@/utils/db";
import List from "@/models/List";

export default async function handler(req, res) {
    await dbConnect();

    const { listId } = req.query;

    switch (req.method) {
        case "PUT": // Update list name
            try {
                const { name } = req.body;
                const updatedList = await List.findByIdAndUpdate(listId, { name }, { new: true });
                if (!updatedList) return res.status(404).json({ success: false, message: "List not found." });
                res.status(200).json({ success: true, data: updatedList });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        case "DELETE": // Delete a list
            try {
                await List.findByIdAndDelete(listId);
                res.status(200).json({ success: true, message: "List deleted successfully." });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid request method." });
            break;
    }
}
