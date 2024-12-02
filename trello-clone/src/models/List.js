import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
});

export default mongoose.models.List || mongoose.model("List", ListSchema);
