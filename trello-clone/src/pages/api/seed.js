import dbConnect from "@/utils/db";
import Board from "@/models/Board";
import List from "@/models/List";
import Card from "@/models/Card";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Only POST requests are allowed." });
    }

    try {
        await Board.deleteMany({});
        await List.deleteMany({});
        await Card.deleteMany({});

        const board = await Board.create({ name: "Sample Board" });

        const list1 = await List.create({ name: "To Do", boardId: board._id });
        const list2 = await List.create({ name: "In Progress", boardId: board._id });
        const list3 = await List.create({ name: "Done", boardId: board._id });

        const card1 = await Card.create({ title: "Task 1", listId: list1._id });
        const card2 = await Card.create({ title: "Task 2", listId: list1._id });
        const card3 = await Card.create({ title: "Task 3", listId: list2._id });

        list1.cards.push(card1._id, card2._id);
        list2.cards.push(card3._id);

        await list1.save();
        await list2.save();
        await board.lists.push(list1._id, list2._id, list3._id);
        await board.save();

        res.status(201).json({ success: true, message: "Database seeded successfully." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
