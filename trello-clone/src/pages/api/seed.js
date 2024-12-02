import dbConnect from "@/utils/db";
import Board from "@/models/Board";
import List from "@/models/List";
import Card from "@/models/Card";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    await dbConnect();

    try {
        // Clear existing data
        await Board.deleteMany();
        await List.deleteMany();
        await Card.deleteMany();

        console.log("Cleared all existing data!");

        // Create sample data
        const sampleBoard = await Board.create({ name: "Sample Board" });

        const list1 = await List.create({
            name: "To Do",
            boardId: sampleBoard._id,
        });

        const list2 = await List.create({
            name: "In Progress",
            boardId: sampleBoard._id,
        });

        const list3 = await List.create({
            name: "Done",
            boardId: sampleBoard._id,
        });

        const card1 = await Card.create({
            title: "Task 1",
            description: "Description for Task 1",
            listId: list1._id,
        });

        const card2 = await Card.create({
            title: "Task 2",
            description: "Description for Task 2",
            listId: list1._id,
        });

        const card3 = await Card.create({
            title: "Task 3",
            description: "Description for Task 3",
            listId: list2._id,
        });

        const card4 = await Card.create({
            title: "Task 4",
            description: "Description for Task 4",
            listId: list3._id,
        });

        // Add lists and cards to board
        list1.cards.push(card1._id, card2._id);
        await list1.save();

        list2.cards.push(card3._id);
        await list2.save();

        list3.cards.push(card4._id);
        await list3.save();

        sampleBoard.lists.push(list1._id, list2._id, list3._id);
        await sampleBoard.save();

        console.log("Database seeded successfully!");
        return res.status(200).json({ message: "Database seeded successfully!" });
    } catch (error) {
        console.error("Error seeding database:", error);
        return res.status(500).json({ message: "Error seeding database", error });
    }
}
