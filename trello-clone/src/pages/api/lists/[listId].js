import dbConnect from "../../../utils/db";
import List from "../../../models/List"; // Import List model

export default async function handler(req, res) {
    await dbConnect();  // Connect to the database

    const { listId } = req.query;  // Get listId from the URL

    // Handle PUT request for updating a list
    if (req.method === "PUT") {
        try {
            const { name } = req.body;  // Get the name from the request body

            // Find and update the list with the new name
            const updatedList = await List.findByIdAndUpdate(
                listId, // List to update
                { name }, // The new name for the list
                { new: true }  // Return the updated list object
            );

            // If no list was found to update, return an error
            if (!updatedList) {
                return res.status(404).json({ success: false, message: "List not found" });
            }

            // Return the updated list
            res.status(200).json({ success: true, data: updatedList });
        } catch (error) {
            // Catch and return any errors that occur during the update
            res.status(500).json({ success: false, message: error.message });
        }
    } else if (req.method === "DELETE") {
        // Handle DELETE request for deleting a list
        try {
            const deletedList = await List.findByIdAndDelete(listId);

            if (!deletedList) {
                return res.status(404).json({ success: false, message: "List not found" });
            }

            res.status(200).json({ success: true, message: "List deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    } else {
        // If the request method is not PUT or DELETE, respond with Method Not Allowed
        res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
