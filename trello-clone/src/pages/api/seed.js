import dbConnect from "@/utils/db";
import Board from "@/models/Board";
import List from "@/models/List";
import Card from "@/models/Card";

export default async function handler(req, res) {
    try {
        // Connect to the database
        await dbConnect();

        // Clear existing data for a fresh seed
        await Board.deleteMany({});
        await List.deleteMany({});
        await Card.deleteMany({});

        // Create sample board
        const board = await Board.create({ name: "Sample Board" });

        // Create sample lists for the board
        const list1 = await List.create({ boardId: board._id, name: "To Do" });
        const list2 = await List.create({ boardId: board._id, name: "In Progress" });
        const list3 = await List.create({ boardId: board._id, name: "Done" });

        // Add sample cards to the lists
        await Card.create({ listId: list1._id, title: "Task 1", description: "This is task 1" });
        await Card.create({ listId: list1._id, title: "Task 2", description: "This is task 2" });
        await Card.create({ listId: list2._id, title: "Task 3", description: "This is task 3" });
        await Card.create({ listId: list3._id, title: "Task 4", description: "This is task 4" });

        // Return success response
        res.status(200).json({ success: true, message: "Database seeded successfully" });
    } catch (err) {
        console.error("Error seeding database:", err);
        res.status(500).json({ success: false, message: "Database seeding failed" });
    }
}
