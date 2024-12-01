import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    name: { type: String, required: true },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
});

export default mongoose.models.List || mongoose.model("List", ListSchema);
